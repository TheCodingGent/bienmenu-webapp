import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-qr-code-viewer',
  templateUrl: './qr-code-viewer.component.html',
  styleUrls: ['./qr-code-viewer.component.css'],
})
export class QrCodeViewerComponent implements OnInit {
  @ViewChild('qrcodecard', { static: false, read: ElementRef })
  qrCodeCard: ElementRef;

  public restaurantQrCode: string = null;

  constructor(
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) {
    // assign a value
    this.restaurantQrCode =
      appConfig.menusBaseUrl + this.route.snapshot.paramMap.get('id'); // TO BE UPDATED WITH DOMAIN NAME
  }

  ngOnInit(): void {}

  downloadQrCode() {
    html2canvas(this.qrCodeCard.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      var pdf = new jsPDF('p', 'mm', [canvas.width, canvas.height]);

      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save('download.pdf');
    });
  }
}
