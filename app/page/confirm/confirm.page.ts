import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  id = null;
  bontravail = '';
  tab = [];
  tab2 = [];
  isLoading = false;

  constructor(
    private router: Router,
    private storage: Storage,
    // private http: HttpClient,
    // private toastCtrl: ToastController,
    // private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.storage.get('BT').then((val) => {
      this.tab = val;
      this.id = this.tab[0].id;
    });
  }

  onYes() {
  //   this.isLoading = true;
  //   this.tab[0].stop = new Date();
  //   return this.http.put(`https://theapp-e459e.firebaseio.com/bonTravailDone/${this.id}.json`,
  //   {
  //     description : this.tab[0].description,
  //     designation: this.tab[0].designation,
  //     start : this.tab[0].start,
  //     note: this.tab[0].note,
  //     stop : this.tab[0].stop,
  //     img : this.tab[0].img
  //   }
  //   )
  //   .subscribe( res => {
  //     console.log('res ', res);
  //     this.tab2 = this.tab.splice(0, 1);
  //     this.storage.set('BTdone', this.tab2);
  //     this.storage.set('BT', this.tab);
  //     this.isLoading = false;
  //     this.presentToast();
      this.router.navigateByUrl('/print');
  //   },
  //   (err: HttpErrorResponse) => {
  //     console.log('error ', err.error);
  //     console.log('name ', err.name);
  //     console.log('message ', err.message);
  //     console.log('status ', err.status);
  //     this.isLoading = false;
  //     // Si problème lors de l'envoie sur la DB, donc mise en place d'une collection en attente
  //     this.tab2 = this.tab.splice(0, 1);
  //     this.storage.set('BTAwait', this.tab2);
  //     this.alertCtrl.create(
  //       {
  //         header: 'Une erreur est intervenue',
  //         message: 'Les informations n\'ont être envoyé, elles seront stockées jusqu\'au moment de se déloguer',
  //         buttons: [
  //           {
  //             text: 'OK',
  //             handler: () => {
  //               this.router.navigateByUrl('/print');
  //             }
  //           }
  //         ]
  //       })
  //       .then(alertEl => {
  //         alertEl.present();
  //       });
  //   }
  //   );
  // }

  //   // Message de confirmation d'envoie des données
  // async presentToast() {
  //   const toast = await this.toastCtrl.create({
  //     message: 'Your data have been saved.',
  //     duration: 2000
  //   });
  //   toast.present();
  }

  onNo() {
    console.log('retour ', this.id);

    this.router.navigateByUrl(`/bt/${this.id}`);
  }

}
