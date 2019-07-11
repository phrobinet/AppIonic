import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { BtPage } from '../bt/bt.page';
import { ModalController, NavController, AlertController } from '@ionic/angular';

import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-home-scan',
  templateUrl: './home-scan.page.html',
  styleUrls: ['./home-scan.page.scss'],
})
export class HomeScanPage implements OnInit {

  key = 'BT';
  tab = [];
  value = '';
  start = new Date();
  id = 0;


  constructor(
    public router: Router,
    private barcodeScanner: BarcodeScanner,
    private modalController: ModalController,
    private authService: AuthService,
    private nav: NavController,
    private alertCtrl: AlertController,
    private storage: Storage
    ) { }

    ngOnInit() {
      // Check si la mémoir du tel sur la collection est vide
      this.storage.get('BT').then((val) => {
        if (val === null || val.length === 0) {
          this.storage.set('BT', this.tab);
          this.storage.set('BTAwait', this.tab);
          console.log('null');
        } else {
          console.log('pas null');
          this.alertCtrl.create(
            {
              header: `Il y a déjà un Bon de Travail en cours`,
              buttons: [
                {
                  text: `OK`,
                  handler: () => {
                    this.nav.navigateForward(`/bt/${val[0].id}`);
                  }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }
      });
    }

    // Fonction qui scanne le qr code qui a une autre fonction à l'intereur (gobt()) qui va passer le numero du bon à la page "bt"
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.nav.navigateForward(`/bt/${barcodeData.text}`);
    }, (err => {
      console.log('Error ', err );
    }));
  }

    // Fonction pendant la phase de dév qui permet de passer à la pg "bt"
  goToBt() {
    this.router.navigateByUrl(`/bt/${this.value}`);
    this.value = '';
  }

}
