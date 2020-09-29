import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPortalHomeComponent } from './business-portal-home.component';

describe('BusinessPortalHomeComponent', () => {
  let component: BusinessPortalHomeComponent;
  let fixture: ComponentFixture<BusinessPortalHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPortalHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPortalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
