import { TestBed } from '@angular/core/testing';

import { OutdoorTempService } from './outdoor-temp.service';

describe('OutdoorTempService', () => {
  let service: OutdoorTempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutdoorTempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
