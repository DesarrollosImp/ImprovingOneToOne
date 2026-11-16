import { TestBed } from '@angular/core/testing';

import { OnetooneService } from './onetoone.service';

describe('OnetooneService', () => {
  let service: OnetooneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnetooneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
