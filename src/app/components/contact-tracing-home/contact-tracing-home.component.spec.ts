import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTracingHomeComponent } from './contact-tracing-home.component';

describe('ContactTracingHomeComponent', () => {
  let component: ContactTracingHomeComponent;
  let fixture: ComponentFixture<ContactTracingHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactTracingHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTracingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
