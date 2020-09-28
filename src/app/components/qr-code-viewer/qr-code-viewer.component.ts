import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-qr-code-viewer',
  templateUrl: './qr-code-viewer.component.html',
  styleUrls: ['./qr-code-viewer.component.scss'],
})
export class QrCodeViewerComponent implements OnInit {
  @ViewChild('qrcodecard', { static: false, read: ElementRef })
  qrCodeCard: ElementRef;
  restaurantColor: string;
  replication: string = '1';

  firstLineText: string = 'CHECK IN';
  secondLineText: string = '';

  public restaurantQrCode: string = null;

  constructor(
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) {
    // assign a value
    this.restaurantQrCode =
      appConfig.menusBaseUrl + this.route.snapshot.paramMap.get('id');

    //this.restaurantColor = this.route.snapshot.paramMap.get('color');
    this.restaurantColor = '#009688';
  }

  ngOnInit(): void {}

  downloadQrCode() {
    window.scroll(0, 0);
    html2canvas(this.qrCodeCard.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      var pdf = new jsPDF('p', 'mm', 'letter');

      var width = pdf.internal.pageSize.getWidth() - 5;
      var height = pdf.internal.pageSize.getHeight() - 5;

      if (this.replication === '1') {
        pdf.addImage(imgData, 'jpeg', 0, 0, width, height);
      } else if (this.replication === '4') {
        pdf.addImage(imgData, 'jpeg', 0, 0, width / 2, height / 2);
        pdf.addImage(imgData, 'jpeg', width / 2, 0, width / 2, height / 2);
        pdf.addImage(imgData, 'jpeg', 0, height / 2, width / 2, height / 2);
        pdf.addImage(
          imgData,
          'jpeg',
          width / 2,
          height / 2,
          width / 2,
          height / 2
        );
      } else if (this.replication === '9') {
        pdf.addImage(imgData, 'jpeg', 0, 0, width / 3, height / 3);
        pdf.addImage(imgData, 'jpeg', width / 3, 0, width / 3, height / 3);
        pdf.addImage(
          imgData,
          'jpeg',
          (2 * width) / 3,
          0,
          width / 3,
          height / 3
        );

        pdf.addImage(imgData, 'jpeg', 0, height / 3, width / 3, height / 3);
        pdf.addImage(
          imgData,
          'jpeg',
          width / 3,
          height / 3,
          width / 3,
          height / 3
        );
        pdf.addImage(
          imgData,
          'jpeg',
          (2 * width) / 3,
          height / 3,
          width / 3,
          height / 3
        );

        pdf.addImage(
          imgData,
          'jpeg',
          0,
          (2 * height) / 3,
          width / 3,
          height / 3
        );
        pdf.addImage(
          imgData,
          'jpeg',
          width / 3,
          (2 * height) / 3,
          width / 3,
          height / 3
        );
        pdf.addImage(
          imgData,
          'jpeg',
          (2 * width) / 3,
          (2 * height) / 3,
          width / 3,
          height / 3
        );
      }

      pdf.save('download.pdf');
    });
  }

  onChange(event): void {
    this.replication = event.target.value;
  }

  getMarginTop() {
    return this.secondLineText === '' ? 20 : 0;
  }
}
