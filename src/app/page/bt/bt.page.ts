import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BonService } from './bon.service';
import { Bontravail } from './bontravail';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-bt',
  templateUrl: './bt.page.html',
  styleUrls: ['./bt.page.scss'],
})

export class BtPage implements OnInit {

  tab = [];
  id: string = '';
  onhold = [];
  description: string = '';
  designation: string = '';
  idData: string = '';
  bontravail: Bontravail;
  isLoading: boolean = false;
  private placeSub: Subscription;

  constructor(
    private storage: Storage,
    private nav: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public  alertCtrl: AlertController,
    private bonService: BonService,
    private connection: ConnectionService,
    private activatedRoute: ActivatedRoute
  ) {
    this.connection.onCheck();
  }


ngOnInit() {
}

ionViewWillEnter() {
  console.log('ionViewWillEnter');
  this.data();
}

data() {
  this.storage.get('BTStanby').then((v) => {
    this.onhold = v;
  });
  console.log(this.onhold);

  this.storage.get('BTCurrent').then((val) => {
    this.isLoading = true;
    this.tab = val;
    console.log('tabVal ', this.tab);

    this.id = this.activatedRoute.snapshot.paramMap.get('btid');
    console.log('id ', this.id);
    if (this.tab.length === 0) {
    }
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('btid')) {
        this.nav.navigateBack('/home-scan');
        return;
      }
      this.placeSub = this.bonService
      // * Récupère le numéro de BT passé en paramètre
      .getbontravail(paramMap.get('btid'))
      .subscribe(
        bontravail => {
          this.bontravail = bontravail;
          this.isLoading = false;

          // * Permets de verrifier s'il y a déjà le BT en cours
          for (const o of this.tab) {
            if (this.bontravail.id === o.id) {
              this.description = this.tab[0].description;
              this.designation = this.tab[0].designation;
              this.idData = this.tab[0].id;
              this.isLoading = false;
              return;
            }
          }
          this.tab.unshift(bontravail);
          this.tab[0].start = new Date();
          this.tab[0].note = [];
          this.storage.set('BTCurrent', this.tab);
          this.isLoading = false;
          this.description = this.tab[0].description;
          this.designation = this.tab[0].designation;
          this.idData = this.tab[0].id;
          console.log('this.tab ', this.tab);
        },
        error => {

          this.isLoading = false;
          if (Array.isArray(this.tab) && this.tab.length <= 0) {
            // * Message d'erreur
            this.alertCtrl.create(
              {
                header: 'Une erreur est intervenue',
                message: 'Le numéro du Bon de Travail est inconnu',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/home-scan']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
            });
            } else {
              this.storage.get('BTCurrent').then((valeur) => {
                this.tab = valeur;
              });
            }

        }
      );
    });
  });
}

addScan() {
  const alert = this.alertCtrl.create(
    {
      header: 'Gérer un BT en simultané ?',
      buttons: [
        {
          text: 'OUI',
          handler: () => {
            this.router.navigateByUrl('home-scan');
          }
        },
        {
          text: 'NON',
          handler: () => {
            this.nav.navigateForward(`home-scan/${this.id}`);
            console.log('this.passeId ', this.id);
          }
        }
      ]
    })
    .then(alertEl => {
      alertEl.present();
    });
}

onMessage() {
  this.router.navigateByUrl(`/note/${this.id}`);
}

onPhoto() {
  this.router.navigateByUrl(`/picture/${this.id}`);
}

onStop(a) {
  this.id = a;
  console.log('Bt click ', this.id);
  this.router.navigateByUrl(`/confirm/${this.id}`);
}

}
