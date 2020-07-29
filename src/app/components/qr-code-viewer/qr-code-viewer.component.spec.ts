import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeViewerComponent } from './qr-code-viewer.component';

describe('QrCodeViewerComponent', () => {
  let component: QrCodeViewerComponent;
  let fixture: ComponentFixture<QrCodeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
