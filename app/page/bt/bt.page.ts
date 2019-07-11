import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { BonService } from './bon.service';
import { Bontravail } from './bontravail';

@Component({
  selector: 'app-bt',
  templateUrl: './bt.page.html',
  styleUrls: ['./bt.page.scss'],
})

export class BtPage implements OnInit {

  tab = [];
  id = null;
  idBT = null;
  description = '';
  designation = '';
  idData = '';
  nb = null;
  bontravail: Bontravail;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private storage: Storage,
    private nav: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public alertCtrl: AlertController,
    private bonService: BonService,
    private activatedRoute: ActivatedRoute
  ) { }

ngOnInit() {
  this.storage.get('BT').then((val) => {
    this.isLoading = true;
    this.tab = val;
    console.log('tabVal ', val);
  });
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
    .getbontravail(paramMap.get('btid'))
    .subscribe(
      bontravail => {
        this.bontravail = bontravail;
        this.isLoading = false;

        // Permets de verrifier s'il y a déjà le BT en cours
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
        this.storage.set('BT', this.tab);
        this.isLoading = false;
        this.description = this.tab[0].description;
        this.designation = this.tab[0].designation;
        this.idData = this.tab[0].id;
      },
      error => {
        // Message d'erreur
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
      }
    );
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
            console.log('non');
          }
        }
      ]
    })
    .then(alertEl => {
      alertEl.present();
    });
}

onMessage() {
  this.router.navigateByUrl(`note`);
}

onPhoto() {
  this.router.navigateByUrl(`photo`);
}

onStop() {
  this.router.navigateByUrl(`confirm`);
}

}
