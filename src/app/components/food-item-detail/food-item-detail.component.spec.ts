import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemDetailComponent } from './food-item-detail.component';

describe('FoodItemDetailsComponent', () => {
  let component: FoodItemDetailComponent;
  let fixture: ComponentFixture<FoodItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FoodItemDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
