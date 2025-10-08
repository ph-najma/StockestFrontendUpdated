import { TestBed } from '@angular/core/testing';

import { ImagekitUploadService } from './imagekit-upload.service';

describe('ImagekitUploadService', () => {
  let service: ImagekitUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagekitUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
