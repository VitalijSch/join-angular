import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewContactComponent } from './add-new-contact.component';

describe('AddNewContactComponent', () => {
  let component: AddNewContactComponent;
  let fixture: ComponentFixture<AddNewContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
