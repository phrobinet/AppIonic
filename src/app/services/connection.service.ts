import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  tab = [];
  tab2 = [];

  constructor(
    private network: Network,
    private storage: Storage,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) { }

  onCheck() {
    this.network.onConnect().subscribe(() => {
      this.alertCtrl.create(
        {
          header: `Connection`,
          message: `Vous avez une connection ` + this.network.type,
          buttons: [
            {
              text: `Verrification de la mémoire`,
              handler() {

              }
            }
          ]
        }
      ).then(alertEl => {
        alertEl.present();
      });
    });

    this.network.onDisconnect().subscribe(() => {
      this.alertCtrl.create(
        {
          header: `Déconnecté`,
          message: `Vous n'avez plus de réseau`,
          buttons: [
            {
              text: `OK`,
              handler() {}
            }
          ]
        }
      );
    });
  }

  onstorage() {
    this.storage.get('BTStanby').then((val) => {
      this.tab = val;
      if (this.tab.length > 0 && this.tab !== undefined) {
        return this.http.put(`https://theapp-e459e.firebaseio.com/bonTravailDone/${this.tab[0].id}.json`,
        {
          description : this.tab[0].description,
          designation: this.tab[0].designation,
          start : this.tab[0].start,
          note: this.tab[0].note,
          stop : this.tab[0].stop,
          img : this.tab[0].img
        }
        ).subscribe(res => {
          this.tab2 = this.tab.splice(0, 1);
          this.storage.set('BTDone', this.tab2);
          this.storage.set('BTStanby', this.tab);
          setTimeout(() => {
            this.onstorage();
          }, 500);
        }, (err: HttpErrorResponse) => {
          this.alertCtrl.create(
            {
              header: `Une erreur est intervenue`,
              message: `Toutes les informations n'ont pas été envoyé sur la base de donnée`,
              buttons: [
                {
                  text: `OK`,
                  handler() {}
                }
              ]
            }
          );
        });
      }
    });
  }
}
