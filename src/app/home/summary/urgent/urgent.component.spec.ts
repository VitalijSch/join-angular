import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentComponent } from './urgent.component';

describe('UrgentComponent', () => {
  let component: UrgentComponent;
  let fixture: ComponentFixture<UrgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
