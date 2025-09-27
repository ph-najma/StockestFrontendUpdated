import { TestBed } from '@angular/core/testing';

import { WebRTCserviceService } from './web-rtcservice.service';

describe('WebRTCserviceService', () => {
  let service: WebRTCserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRTCserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
