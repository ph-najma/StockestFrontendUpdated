import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SignalingService } from '../services/signaling.service';
import { CallService } from '../services/call.service';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeaderComponent } from '../user/user-header/user-header.component';
@Component({
  selector: 'app-video-call',
  imports: [CommonModule, FormsModule, UserHeaderComponent],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css',
})
export class VideoCallComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  roomCode: string = '';
  joinCode: string = '';
  peerConnection!: RTCPeerConnection;

  constructor(private socketService: SignalingService) {}

  async ngOnInit() {
    this.setupSocketListeners();
    await this.setupMedia();
  }

  async setupMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.localVideo.nativeElement.srcObject = stream;
    this.initPeerConnection(stream);
  }

  initPeerConnection(stream: MediaStream) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track, stream));

    this.peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      this.remoteVideo.nativeElement.srcObject = stream;
      console.log('Received remote stream:', event.streams);
    };
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit('ice-candidate', {
          roomCode: this.roomCode,
          candidate: event.candidate,
        });
      }
    };
  }

  setupSocketListeners() {
    this.socketService.on('room-created', (code: any) => {
      this.roomCode = code;
    });

    this.socketService.on('room-joined', async () => {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socketService.emit('offer', { roomCode: this.joinCode, offer });
    });

    this.socketService.on('user-joined', () => {
      console.log('User joined the room');
    });

    this.socketService.on('offer', async (offer) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socketService.emit('answer', { roomCode: this.roomCode, answer });
    });

    this.socketService.on('answer', async (answer) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    this.socketService.on('ice-candidate', async (candidate) => {
      if (candidate) {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    this.socketService.on('call-ended', () => {
      this.endCall();
    });
  }

  createRoom() {
    this.socketService.emit('create-room');
  }

  joinRoom() {
    this.roomCode = this.joinCode;
    this.socketService.emit('join-room', this.joinCode);
  }

  endCall() {
    this.socketService.emit('call-ended', { roomCode: this.roomCode });

    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
      this.peerConnection.close();
    }

    this.peerConnection = null!;
    this.remoteVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = null;
    this.roomCode = '';
  }
  isMicOn = true;
  isCameraOn = true;

  toggleMic() {
    const stream = this.localVideo.nativeElement.srcObject as MediaStream;
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.isMicOn = audioTrack.enabled;
    }
  }

  toggleCamera() {
    const stream = this.localVideo.nativeElement.srcObject as MediaStream;
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.isCameraOn = videoTrack.enabled;
    }
  }

  toggleFullScreen(type: 'local' | 'remote') {
    const videoEl =
      type === 'local'
        ? this.localVideo.nativeElement
        : this.remoteVideo.nativeElement;
    if (!document.fullscreenElement) {
      videoEl.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
