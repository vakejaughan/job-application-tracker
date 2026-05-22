import { TestBed } from '@angular/core/testing';

import { JobApplication } from './job-application';

describe('JobApplication', () => {
  let service: JobApplication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobApplication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
