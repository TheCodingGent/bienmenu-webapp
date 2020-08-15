import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-qrcode-card-svg',
  templateUrl: './qrcode-card-svg.component.html',
  styleUrls: ['./qrcode-card-svg.component.css'],
})
export class QrcodeCardSvgComponent implements OnInit {
  @Input() color: string;

  constructor(private elRef: ElementRef) {}

  setColorThemeProperty() {
    this.elRef.nativeElement.style.setProperty('--main-color', this.color);
  }

  ngOnInit(): void {
    this.setColorThemeProperty();
  }
}
