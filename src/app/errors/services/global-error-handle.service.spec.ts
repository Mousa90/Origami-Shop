import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandler } from './global-error-handle.service';

describe('GlobalErrorHandleService', () => {
  let service: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
