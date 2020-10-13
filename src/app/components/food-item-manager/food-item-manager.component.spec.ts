import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemManagerComponent } from './food-item-manager.component';

describe('FoodItemManagerComponent', () => {
  let component: FoodItemManagerComponent;
  let fixture: ComponentFixture<FoodItemManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodItemManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodItemManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
