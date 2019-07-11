import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  tab = [];
  tabAwait = [];
  tab2 = [];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private authService: AuthService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onBT() {
    this.router.navigateByUrl(`/bt/${this.tab[0].id}`);
  }

  onLogout() {
      // * Importation des bases de données internes || Importing internal databases
      this.storage.get('BTCurrent').then((val) => {
        this.tab = val;
        this.storage.get('BTStanby').then((valeur) => {
          this.tabAwait = valeur;

          // * Verrification si la BD Await est vide ainsi que la Bd en cours
          // * Check if the Await database is empty as well as the current database
          console.log('tabAwait ', this.tabAwait.length === 0 );
          console.log('tab ', this.tab.length === 0 );
          if (this.tabAwait.length === 0 && this.tab.length === 0) {
            console.log('logout');
            this.authService.logout();
            this.router.navigateByUrl('/auth');
            // * Permet de vider la base de donnée internet à l'app || Allows to empty the internet database to the app
            this.storage.clear().then(() => {
              console.log('all keys cleared');
            });
            return;
          }

      // * S'il y a des données  en attente à envoyer || If there is data waiting to be sent
          if (this.tabAwait.length !== 0) {
          console.log('tabAwait ', this.tabAwait.length);
          this.alertCtrl.create(
            {
              header: 'Une erreur est intervenue',
              message: 'Toutes les informations n\'ont pas été envoyé. Il vous reste ' + this.tabAwait.length + ' bon de travail à envoyer',
              buttons: [
                {
                  text: 'Envoyer',
                  handler: () => {
                    this.sendBT();
                  }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
          } else {
            // * Verrification d'un éventuelle bon de travail en cours || Verification of a possible work order in progress
            if (this.tab.length !== 0) {
              console.log('length ', this.tab.length);
              this.alertCtrl.create(
                {
                    header: 'Une erreur est intervenue',
                    message: 'Vous avez un bon de travail en cours',
                    buttons: [
                      {
                        text: 'Ok',
                        handler: () => {
                          this.router.navigateByUrl(`bt/${this.tab[0].id}`);
                        }
                      }
                    ]
                  })
                  .then(alertEl => {
                    alertEl.present();
                  });
                }
              }
            });
        });
  }


   // * Fonction qui envoie les donnée en attente à la base de donnée || Function that sends pending data to the database
  sendBT() {
      return this.http.put(`https://theapp-e459e.firebaseio.com/bonTravailDone/${this.tabAwait[0].id}.json`,
      {
        description : this.tabAwait[0].description,
        designation: this.tabAwait[0].designation,
        start : this.tabAwait[0].start,
        note: this.tabAwait[0].note,
        stop : this.tabAwait[0].stop,
        img : this.tabAwait[0].img
      }
      ).subscribe( res => {
        this.tab2 = this.tabAwait.splice(0, 1);
        this.storage.set('BTdone', this.tab2);
        this.storage.set('BTCurrent', this.tab);
        setTimeout(() => {
          this.onLogout();
        }, 500);
      }, (err: HttpErrorResponse) => {
        this.alertCtrl.create(
          {
            header: 'Une erreur est intervenue',
            message: 'Toutes les informations n\'ont pas été envoyé sur la base de donnée',
            buttons: [
              {
                text: 'Réessayer',
                handler: () => {
                  this.onLogout();
                }
              }
            ]
          }
        );
      });
  }
}
