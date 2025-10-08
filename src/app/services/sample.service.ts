import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor(private http :HttpClient) { }
  getUsers(){
    this.http.get(`{$environment.apiUrl}/login`)
  }
}
