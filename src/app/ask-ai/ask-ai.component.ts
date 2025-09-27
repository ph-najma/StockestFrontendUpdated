import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserHeaderComponent } from '../user/user-header/user-header.component';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
@Component({
  selector: 'app-ask-ai',
  imports: [ReactiveFormsModule, NgClass, CommonModule, UserHeaderComponent],
  templateUrl: './ask-ai.component.html',
  styleUrl: './ask-ai.component.css',
})
export class AskAiComponent implements OnDestroy {
  queryForm: FormGroup;
  isLoading = false;
  conversation: Message[] = [];
  private subscription = new Subscription();

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.queryForm = this.fb.group({
      query: [''],
    });
  }

  onSubmit() {
    const query = this.queryForm.get('query')?.value.trim();
    if (!query) return;

    this.isLoading = true;
    this.conversation.push({ role: 'user', content: query });

    const generateSubscription = this.apiService
      .generatePrompt(query)
      .subscribe(
        (data: any) => {
          this.conversation.push({
            role: 'assistant',
            content: data.response || 'No response received.',
          });
          console.log(data);
          console.log(this.conversation);
          this.isLoading = false;
          this.queryForm.reset();
        },
        (error: any) => {
          console.error('Error:', error);
          this.conversation.push({
            role: 'assistant',
            content: 'An error occurred while generating the response.',
          });
          this.isLoading = false;
        }
      );
    this.subscription.add(generateSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
