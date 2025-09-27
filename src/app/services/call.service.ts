import { Injectable, ElementRef } from '@angular/core';
import { SignalingService } from './signaling.service';
@Injectable({
  providedIn: 'root',
})
export class CallService {
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  connection!: RTCPeerConnection;

  constructor(private signalingService: SignalingService) {}

  private async _initConnection(
    localVideo: ElementRef,
    remoteVideo: ElementRef
  ): Promise<void> {
    this.connection = new RTCPeerConnection(this.configuration);

    await this._getStreams(localVideo, remoteVideo);

    this._registerConnectionListeners();
  }

  // public async makeCall(
  //   localVideo: ElementRef,
  //   remoteVideo: ElementRef
  // ): Promise<void> {
  //   await this._initConnection(localVideo, remoteVideo);

  //   const offer = await this.connection.createOffer();

  //   await this.connection.setLocalDescription(offer);

  //   this.signalingService.sendMessage({ type: 'offer', offer });
  // }
  public endCall(): void {
    if (this.connection) {
      this.connection.getSenders().forEach((sender) => {
        this.connection.removeTrack(sender);
      });

      this.connection.close();
      this.connection = undefined!;
      console.log('Call ended, connection closed.');
    }
  }

  // public async handleOffer(
  //   offer: RTCSessionDescription,
  //   localVideo: ElementRef,
  //   remoteVideo: ElementRef
  // ): Promise<void> {
  //   await this._initConnection(localVideo, remoteVideo);

  //   await this.connection.setRemoteDescription(
  //     new RTCSessionDescription(offer)
  //   );

  //   const answer = await this.connection.createAnswer();

  //   await this.connection.setLocalDescription(answer);

  //   this.signalingService.sendMessage({ type: 'answer', answer });
  // }

  public async handleAnswer(answer: RTCSessionDescription): Promise<void> {
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  public async handleCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (candidate) {
      await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private _registerConnectionListeners(): void {
    this.connection.onicegatheringstatechange = (ev: Event) => {
      console.log(
        `ICE gathering state changed: ${this.connection.iceGatheringState}`
      );
    };

    this.connection.onconnectionstatechange = () => {
      console.log(
        `Connection state change: ${this.connection.connectionState}`
      );
    };

    this.connection.onsignalingstatechange = () => {
      console.log(`Signaling state change: ${this.connection.signalingState}`);
    };

    this.connection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state change: ${this.connection.iceConnectionState}`
      );
    };
    // this.connection.onicecandidate = (event) => {
    //   if (event.candidate) {
    //     const payload = {
    //       type: 'candidate',
    //       candidate: event.candidate.toJSON(),
    //     };
    //     this.signalingService.sendMessage(payload);
    //   }
    // };
  }

  private async _getStreams(
    localVideo: ElementRef,
    remoteVideo: ElementRef
  ): Promise<void> {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Show your own camera
    localVideo.nativeElement.srcObject = localStream;

    // Add tracks to connection
    localStream.getTracks().forEach((track) => {
      this.connection.addTrack(track, localStream);
    });

    // Prepare stream for remote user
    const remoteStream = new MediaStream();
    remoteVideo.nativeElement.srcObject = remoteStream;

    // When remote track is received, add to remoteStream
    this.connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
  }
}
