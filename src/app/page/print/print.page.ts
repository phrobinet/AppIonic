import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ConnectionService } from '../../services/connection.service';

@Component({
    selector: 'app-print',
    templateUrl: './print.page.html',
    styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {


    mycount = 0;
    tab = [];
    id = '';
    tab2 = [];
    stanby = [];
    user: '';
    i = -1;


  constructor(
    private router: Router,
    private storage: Storage,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private connection: ConnectionService
  ) {
    this.connection.onCheck();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('btid');
    this.storage.get('BTCurrent').then((val) => {
      this.tab = val;
      let tableau;
      for (tableau of this.tab) {
        this.i++;
        console.log(this.i);
        if (tableau.id === this.id) {
          return this.id;
        }
      }
    });
    this.storage.get('BTStandby').then((valeur) => {
      this.stanby = valeur;
    });
    console.log('Stanby ', this.stanby);
    this.storage.get('IdUtilisateur').then((val) => {
      this.user = val;
    });
  }

  onAdd() {
    this.mycount = this.mycount + 1;
  }

  onLess() {
    this.mycount = this.mycount - 1;
  }

  onPrint() {
    this.tab[this.i].stop = new Date();
    this.loadingCtrl
    // *  Création du spinner en pop
    .create({ keyboardClose: true, message: 'Sending data ...'})
    .then(loadinEl => {
      loadinEl.present();

      // * Adresse de la base de donnée
      return this.http.put(`https://theappdone.firebaseio.com/bonTravailDone/${this.id}.json`,
      {
        id: this.tab[this.i].id,
        description : this.tab[this.i].description,
        designation: this.tab[this.i].designation,
        start : this.tab[this.i].start,
        stop : this.tab[this.i].stop,
        note: this.tab[this.i].note,
        img : this.tab[this.i].refImg,
        NbrCopy : this.mycount,
        user: this.user
      }
      )
    .subscribe( res => {
      console.log('res ', res);
      this.tab2 = this.tab.splice(this.i, 1);
      console.log('this.tab ', this.tab);
      console.log('res ', res);
      console.log(`this.tab2 `, this.tab2);
      this.storage.set('BTCurrent', this.tab);
      this.storage.set('BTDone', this.tab2);
      loadinEl.dismiss();
      this.presentToast();
      this.router.navigateByUrl('/home-scan');
      if (this.tab.length === 0) {
      } else {
        this.router.navigateByUrl(`/bt/${ this.tab[0].id}`);
      }
    },
    (err: HttpErrorResponse) => {
      // console.log('error ', err.error);
      // console.log('name ', err.name);
      // console.log('message ', err.message);
      // console.log('status ', err.status);
      loadinEl.dismiss();

      // * Si problème lors de l'envoie sur la DB, donc mise en place d'une collection en attente
      this.alertCtrl.create(
        {
          header: 'Une erreur est intervenue',
          message: 'Les informations n\'ont être envoyées, elles seront stockées jusqu\'au moment de se déloguer',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.stanby.push(this.tab2);
                this.storage.set('BTStanby', this.stanby);
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
