import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CallService } from '../../services/call.service';
import { SignalingService } from '../../services/signaling.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { UserHeaderComponent } from '../user-header/user-header.component';
declare var Razorpay: any;
@Component({
  selector: 'app-tarding-course',
  imports: [CommonModule, RouterModule, UserHeaderComponent],
  templateUrl: './tarding-course.component.html',
  styleUrl: './tarding-course.component.css',
})
export class TardingCourseComponent implements OnInit, OnDestroy {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef;
  courses: any[] = [];
  private isCallActive = false;
  isCourse: Boolean = true;
  userId: string | null = ''; // To store the actual user ID
  currentSessionId: string = '';
  role: 'instructor' | 'student' = 'student';
  purchasedCourses: Set<string> = new Set();

  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private callService: CallService,
    private signalingService: SignalingService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchPurchasedCourses();
    this.userId = this.apiService.getUserId();
    // this.signalingService
    //   .getMessages()
    //   .subscribe((payload) => this._handleMessage(payload));
    this.userId = this.apiService.getUserId();
  }
  // public async makeCall(): Promise<void> {
  //   if (!this.isCallActive) {
  //     this.isCallActive = true; // Set call state
  //     this.signalingService.sendMessage({
  //       type: 'answer',
  //       role: this.role,
  //     });
  //     await this.callService.makeCall(this.localVideo, this.remoteVideo);
  //   }
  // }
  // public endCall(): void {
  //   this.callService.endCall();
  //   this.cleanupVideos();
  //   this.isCallActive = false; // Reset call state
  //   this.signalingService.sendMessage({ type: 'end-call' }); // Notify other participants
  // }
  public confirmEndCall(): void {
    if (confirm('Are you sure you want to end the call?')) {
      // this.endCall(); // Notify other participants
    }
  }

  private cleanupVideos(): void {
    // Clear video elements
    if (this.localVideo?.nativeElement.srcObject) {
      const localStream = this.localVideo.nativeElement
        .srcObject as MediaStream;
      localStream.getTracks().forEach((track) => track.stop());
      this.localVideo.nativeElement.srcObject = null;
    }

    if (this.remoteVideo?.nativeElement.srcObject) {
      const remoteStream = this.remoteVideo.nativeElement
        .srcObject as MediaStream;
      remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteVideo.nativeElement.srcObject = null;
    }
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
  //       break;
  //   }
  // }

  fetchPurchasedCourses() {
    const purchasedCoursesubscription = this.apiService
      .getPurchasedCourses()
      .subscribe((response: any) => {
        console.log(response);
        this.purchasedCourses = new Set(
          response.data.map((course: any) => course._id)
        );
        console.log(this.purchasedCourses);
      });
    this.subscription.add(purchasedCoursesubscription);
  }
  isPurchased(courseId: string): boolean {
    return this.purchasedCourses.has(courseId);
  }

  fetchData() {
    const ActiveSessionsSubscription = this.apiService
      .getActiveSessions()
      .subscribe((response: any) => {
        console.log(response); // Log the fetched data

        // Process the data to match the required structure
        this.courses = response.data.map((session: any) => ({
          id: session._id,
          title: session.specialization,
          instructor: session.instructor_name,
          rating: 4.5, // Default or calculated rating (you can adjust this)
          originalPrice: 999, // Replace with actual price if available
          discountedPrice: session.hourly_rate || 500, // Use hourly_rate or default
          discount: 50, // Example: hardcoded discount (replace with logic)
          image: 'assets/course.jpg', // Default image path
        }));
      });
    this.subscription.add(ActiveSessionsSubscription);
  }
  buyCourse(course: any): void {
    console.log(`Processing payment for course: ${course.title}`);

    // Create Razorpay order
    const createOrderSubscription = this.apiService
      .createOrder(course.discountedPrice)
      .subscribe(
        (order) => {
          const options: any = {
            key: 'rzp_test_sHq1xf34I99z5x',
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            handler: (response: any) => {
              const payload = {
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                course_id: course.id,
                isCourse: this.isCourse,
              };
              // Verify the payment
              this.apiService.verifyPayment(payload).subscribe(
                (result) => {
                  if (result.success) {
                    alert(`Payment successful for course: ${course.title}`);
                    this.purchasedCourses.add(course.id);
                  } else {
                    alert('Payment verification failed!');
                  }
                },
                (error) => {
                  console.error(error);
                  alert('Payment verification error!');
                }
              );
            },
            prefill: {
              name: 'Your Name',
              email: 'your-email@example.com',
              contact: '9999999999',
            },
            theme: {
              color: '#528FF0',
            },
          };

          const razorpay = new Razorpay(options);
          razorpay.open();
        },
        (error) => {
          console.error(error);
          alert('Failed to create order');
        }
      );
    this.subscription.add(createOrderSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
