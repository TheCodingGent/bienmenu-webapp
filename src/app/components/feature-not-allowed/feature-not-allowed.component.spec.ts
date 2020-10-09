import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureNotAllowedComponent } from './feature-not-allowed.component';

describe('FeatureNotAllowedComponent', () => {
  let component: FeatureNotAllowedComponent;
  let fixture: ComponentFixture<FeatureNotAllowedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureNotAllowedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
