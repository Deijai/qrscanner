import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { DataLocalService } from './../../services/data-local.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  swiperOpts = {};

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastController: ToastController,
    private dataLocal: DataLocalService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  scan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        if( !barcodeData.cancelled ) {
          this.dataLocal.save(barcodeData.format, barcodeData.text);
          this.showToast(`${barcodeData.text} success`, 'success');
        }
      })
      .catch((err) => {
        this.showToast(`Error: ${err}`, 'danger');

        this.dataLocal.save('QRCode', 'geo:42.61665247685971,-78.0137529953373');
      });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      animated: true,
      duration: 2000,
      message: msg,
      position: 'top',
      color
    });
    toast.present();
  }
}
