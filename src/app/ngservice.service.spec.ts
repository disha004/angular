import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgserviceService } from './ngservice.service';

describe('NgserviceService', () => {
  let service: NgserviceService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();
    service = TestBed.inject(NgserviceService);
  });
  /*
  beforeEach(() => {
    TestBed.configureTestingModule({});
    
  });
  */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
