import { TestBed } from '@angular/core/testing';

import { ContactColorsService } from './contact-colors.service';

describe('ContactColorsService', () => {
  let service: ContactColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
