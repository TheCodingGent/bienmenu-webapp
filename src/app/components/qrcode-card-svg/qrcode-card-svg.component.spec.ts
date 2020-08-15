import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeCardSvgComponent } from './qrcode-card-svg.component';

describe('QrcodeCardSvgComponent', () => {
  let component: QrcodeCardSvgComponent;
  let fixture: ComponentFixture<QrcodeCardSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeCardSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeCardSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
