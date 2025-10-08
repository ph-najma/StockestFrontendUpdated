import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ImagekitUploadService {
  private imagekit: ImageKit;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.imagekit = new ImageKit({
      publicKey: environment.imagekit.publicKey,
      urlEndpoint: environment.imagekit.urlEndpoint,
      // 👇 type assertion to silence TS error
      authenticationEndpoint: environment.imagekit.authenticationEndpoint,
    } as any); // ✅ add `as any`
  }

  async upload(file: File, folder = '/user_profiles'): Promise<any> {
    // Step 1: Get auth parameters from backend
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const authResponse = await this.http
      .get<any>(`${this.apiUrl}/imagekit/auth`, { headers })
      .toPromise();
    const auth = authResponse?.data ?? authResponse; // backend wraps in { data }
    console.log('auth from service', auth);

    // Step 2: Convert file to base64 (ImageKit requires base64 string or URL)
    const base64 = await this.toBase64(file);

    // Step 3: Upload with authentication
    // return this.imagekit.upload({
    //   file: base64,
    //   fileName: file.name,
    //   folder,
    //   token: auth.token,
    //   signature: auth.signature,
    //   expire: auth.expire,
    // });
    const response = await this.imagekit.upload({
      file: base64,
      fileName: file.name,
      folder,
      token: auth.token,
      signature: auth.signature,
      expire: auth.expire,
    });

    console.log('Upload response:', response);
    return response;
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }
}
