import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qr-code-viewer',
  templateUrl: './qr-code-viewer.component.html',
  styleUrls: ['../../app.component.css', './qr-code-viewer.component.css'],
})
export class QrCodeViewerComponent implements OnInit {
  public restaurantQrCode: string = null;

  constructor(private route: ActivatedRoute) {
    // assign a value
    this.restaurantQrCode =
      'http://localhost:4200/menus/' + this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {}
}
