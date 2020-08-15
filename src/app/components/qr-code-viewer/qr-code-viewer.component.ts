import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
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
  restaurantColor: string;
  replication: string = '1';
  isChecked = false;

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
    html2canvas(this.qrCodeCard.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      // var pdf = new jsPDF('p', 'mm', [canvas.width, canvas.height]);

      // pdf.addImage(imgData, 'JPEG', 0, 0);
      // pdf.save('download.pdf');

      var pdf = new jsPDF('p', 'mm', 'letter');

      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();

      if (this.replication === '1') {
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      } else if (this.replication === '4') {
        pdf.addImage(imgData, 'JPEG', 0, 0, width / 2, height / 2);
        pdf.addImage(imgData, 'JPEG', width / 2, 0, width / 2, height / 2);
        pdf.addImage(imgData, 'JPEG', 0, height / 2, width / 2, height / 2);
        pdf.addImage(
          imgData,
          'JPEG',
          width / 2,
          height / 2,
          width / 2,
          height / 2
        );
      }

      pdf.save('download.pdf');
    });
  }

  onChange(event): void {
    console.log(event.target.value);
    this.replication = event.target.value;
  }
}
