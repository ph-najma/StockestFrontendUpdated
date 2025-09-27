import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-google-signin',
  imports: [],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.css',
})
export class GoogleSigninComponent {
  @Output() onGoogleLogin = new EventEmitter<string>();

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }
  initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id:
        '89186691123-vmrq99r21diqv7lhmrju7vkho7qbdcdo.apps.googleusercontent.com',
      callback: (response: any) => {
        this.onGoogleLogin.emit(response.credential);
      },
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInBtn')!,
      { theme: 'outline', size: 'large' }
    );
  }
}
