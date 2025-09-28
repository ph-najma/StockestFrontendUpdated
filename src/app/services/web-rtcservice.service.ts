import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class WebRTCserviceService {
  private socket: any;
  private peerConnection: RTCPeerConnection;

  constructor() {
    this.socket = io(environment.apiUrl);

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server-url',
          username: 'user',
          credential: 'pass',
        },
      ],
    });

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        this.socket.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Track received:', event.streams[0]);
      const remoteVideo = document.getElementById(
        'remoteVideo'
      ) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Listen for signaling messages
    this.socket.on('signal', (signalData: any) => {
      console.log('Received signal:', signalData);
      this.handleSignal(signalData.sessionId, signalData.signalData);
    });

    // Listen for ICE candidates from other users
    this.socket.on('ice-candidate', (data: any) => {
      console.log('Received ICE candidate:', data.candidate);
      this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }

  async joinSession(sessionId: string, userId: string | null) {
    this.socket.emit('join-session', { sessionId, userId });
  }

  async startCall(sessionId: string, localStream: MediaStream) {
    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('signal', {
      sessionId,
      signalData: offer,
    });
  }

  async handleSignal(sessionId: string, signalData: any) {
    if (signalData.type === 'offer') {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(signalData)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('signal', {
        sessionId,
        signalData: answer,
      });
    } else if (signalData.type === 'answer') {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(signalData)
      );
    }
  }

  closeConnection() {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.ontrack = null;
      this.peerConnection.close();
    }

    // Reset peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
  }
}
