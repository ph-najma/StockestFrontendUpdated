import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { SignalingService } from '../../services/signaling.service';
import { CallService } from '../../services/call.service';
import { Router } from '@angular/router';
import { UserHeaderComponent } from '../user-header/user-header.component';
@Component({
  selector: 'app-instructor-home',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './instructor-home.component.html',
  styleUrl: './instructor-home.component.css',
})
export class InstructorHomeComponent {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef;
  public isReady = false;
  public remoteReady = false;
  courses: any[] = [];
  isCourse: Boolean = true;
  userId: string | null = '';
  role: 'instructor' | 'student' = 'instructor';
  private isCallActive = false;
  assignedCourses: Set<string> = new Set();
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private callService: CallService,
    private signalingService: SignalingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAssignedCourses();
    // this.signalingService
    //   .getMessages()
    //   .subscribe((payload) => this._handleMessage(payload));
    this.userId = this.apiService.getUserId();
  }

  public async makeCall(): Promise<void> {
    // if (!this.isCallActive) {
    //   this.isCallActive = true; // Set call state
    //   this.signalingService.sendMessage({
    //     type: 'offer',
    //     role: this.role,
    //   });
    //   await this.callService.makeCall(this.localVideo, this.remoteVideo);
    // }
    this.router.navigate(['/video-call']);
  }
  // public endCall(): void {
  //   this.callService.endCall();
  //   this.cleanupVideos();
  //   this.isCallActive = false; // Reset call state
  //   this.signalingService.sendMessage({ type: 'end-call' }); // Notify other participants
  // }
  // public confirmEndCall(): void {
  //   if (confirm('Are you sure you want to end the call?')) {
  //     this.endCall();
  //   }
  // }

  private cleanupVideos(): void {
    const cleanStream = (videoElement: ElementRef) => {
      const stream = videoElement.nativeElement.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoElement.nativeElement.srcObject = null;
      }
    };
    cleanStream(this.localVideo);
    cleanStream(this.remoteVideo);
  }
  // private async _handleMessage(data: any): Promise<void> {
  //   switch (data.type) {
  //     case 'start-call':
  //       if (data.role !== this.role && !this.isCallActive) {
  //         this.isCallActive = true;
  //         await this.callService.makeCall(this.localVideo, this.remoteVideo);
  //       }
  //       break;
  //     case 'offer':
  //       await this.callService.handleOffer(
  //         data.offer,
  //         this.localVideo,
  //         this.remoteVideo
  //       );
  //       break;
  //     case 'answer':
  //       await this.callService.handleAnswer(data.answer);
  //       break;

  //     case 'candidate':
  //       this.callService.handleCandidate(data.candidate);
  //       break;
  //     case 'end-call':
  //       this.endCall();
  //       break;
  //     default:

  //   }
  // }
  fetchAssignedCourses() {
    const purchasedCoursesubscription = this.apiService
      .getAssignedCourses()
      .subscribe((response: any) => {
        console.log(response);
        this.courses = response.data;
        console.log(this.courses);
      });
    this.subscription.add(purchasedCoursesubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.isCallActive) {
      // this.endCall();
    }
  }
}
