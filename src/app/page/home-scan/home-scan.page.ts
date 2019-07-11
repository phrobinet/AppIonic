import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './../../auth/auth.service';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-home-scan',
  templateUrl: './home-scan.page.html',
  styleUrls: ['./home-scan.page.scss'],
})
export class HomeScanPage implements OnInit {

  key: string = 'BTCurrent';
  tab = [];
  tab2 = [];
  value = '';
  start = new Date();
  id: number = 0;
  passeId: string = '';
  user: string = '';


  constructor(
    public router: Router,
    private barcodeScanner: BarcodeScanner,
    private activatedRoute: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private connection: ConnectionService,
    private storage: Storage
    ) {
      this.connection.onCheck();
    }

    ngOnInit() {
      this.passeId = this.activatedRoute.snapshot.paramMap.get('btid');
      console.log('this.passeId ', this.passeId);
      if (this.passeId === null) {
      // * Check si la mémoire du tel sur la collection est vide
      this.storage.get('BTCurrent').then((val) => {
        if (val === null || val.length === 0) {
          this.storage.set('BTCurrent', this.tab);
          this.storage.set('BTStanby', this.tab);
        } else {
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
}

    // * Fonction qui scanne le qr code qui a une autre fonction à l'intereur (gobt()) qui va passer le numero du bon à la page "bt"
  scanCode() {
    // * if this.passId is not null send data to firebase
    if (this.passeId !== null) {
      this.storage.get('BT').then((val) => {
        this.tab = val;
        this.storage.get('IdUtilisateur').then((valeur) => {
          this.user = valeur;
          this.tab[0].stop = new Date();
          this.loadingCtrl
          .create({keyboardClose: true, message: 'Sending data ...'})
          .then(loadingEl => {
            loadingEl.present();
            return this.http.put(`https://theappdone.firebaseio.com/bonTravailDone/${this.tab[0].id}.json`,
            {
              id: this.tab[0].id,
              description: this.tab[0].decription,
              designation: this.tab[0].designation,
              start: this.tab[0].start,
              stop: this.tab[0].stop,
              note: this.tab[0].note,
              nbrCopy: '1',
              User: this.user
            })
            .subscribe(res => {
              this.tab2 = this.tab.splice(0, 1);
              this.storage.set('BTDone', this.tab2);
              this.storage.set('BTCurrent', this.tab);
              loadingEl.dismiss();
              this.presentToast();
              this.nav.navigateForward(`/bt/${this.value}`);
              this.value = '';
            },
            (err: HttpErrorResponse) => {
              console.log('error ', err.error);
              console.log('name ', err.name);
              console.log('message ', err.message);
              console.log('status ', err.status);
              loadingEl.dismiss(); // * Fin d'affichage du pop
              // * Si problème lors de l'envoie sur la DB, donc mise en place d'une collection en attente
              this.alertCtrl.create(
                {
                  header: 'Une erreur est intervenue',
                  message: 'Les informations n\'ont être envoyées, elles seront stockées jusqu\'au moment de se déloguer',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.router.navigateByUrl('/home-scan');
                      }
                    }
                  ]
                })
                .then(alertEl => {
                  alertEl.present();
                });
              }
            );
          });
        });
      });
    }
    this.barcodeScanner.scan().then(barcodeData => {
      this.nav.navigateForward(`/bt/${barcodeData.text}`);
    }).catch(err => {
      console.log('Error ', err );
      }
      );
  }

    // * Fonction pendant la phase de dév qui permet de passer à la pg "bt"
  goToBt() {
    // * if this.passId is not null send data to firebase
    if (this.passeId !== null) {
      this.storage.get('BTCurrent').then((val) => {
        this.tab = val;
        console.log('this.tab ', this.tab);
        this.storage.get('IdUtilisateur').then((valeur) => {
          this.user = valeur;
          this.tab[0].stop = new Date();
          this.loadingCtrl
          .create({keyboardClose: true, message: 'Sending data ...'})
          .then(loadingEl => {
            loadingEl.present();
            return this.http.put(`https://theappdone.firebaseio.com/bonTravailDone/${this.tab[0].id}.json`,
            {
              id: this.tab[0].id,
              description: this.tab[0].decription,
              designation: this.tab[0].designation,
              start: this.tab[0].start,
              stop: this.tab[0].stop,
              note: this.tab[0].note,
              nbrCopy: '1',
              user: this.user
            })
            .subscribe(res => {
              this.tab2 = this.tab.splice(0, 1);
              this.storage.set('BTDone', this.tab2);
              this.storage.set('BTCurrent', this.tab);
              loadingEl.dismiss();
              this.presentToast();
              this.nav.navigateForward(`/bt/${this.value}`);
              this.value = '';
            },
            (err: HttpErrorResponse) => {
              console.log('error ', err.error);
              console.log('name ', err.name);
              console.log('message ', err.message);
              console.log('status ', err.status);
              loadingEl.dismiss(); // * Fin d'affichage du pop

              // * Si problème lors de l'envoie sur la DB, donc mise en place d'une collection en attente
              this.alertCtrl.create(
                {
                  header: 'Une erreur est intervenue',
                  message: 'Les informations n\'ont être envoyées, elles seront stockées jusqu\'au moment de se déloguer',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.router.navigateByUrl(`/bt/${this.value}`);
                        this.value = '';
                      }
                    }
                  ]
                })
                .then(alertEl => {
                  alertEl.present();
                });
              }
            );
          });
        });
      });
    } else {
      this.nav.navigateForward(`/bt/${this.value}`);
      this.value = '';
    }
  }

      // * Message de confirmation d'envoie des données
      async presentToast() {
        const toast = await this.toastCtrl.create({
          message: 'Your data have been saved.',
          duration: 2000
        });
        toast.present();
      }

}
