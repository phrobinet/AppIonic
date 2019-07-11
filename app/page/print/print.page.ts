import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// import { File } from '@ionic-native/file/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-print',
    templateUrl: './print.page.html',
    styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {


    mycount = 0;
    pdfObj = '';
    tab = [];
    tab2 = [];
    pdjObj: any;
    blob: any;
    isLoading = false;

  constructor(
    private router: Router,
    private storage: Storage,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    // private plt: Platform
    // private file: File,
    // private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    this.storage.get('BT').then((val) => {
      this.tab = val;
    });
  }

  onAdd() {
    this.mycount = this.mycount + 1;
    console.log(this.mycount);
  }

  onLess() {
    this.mycount = this.mycount - 1;
    console.log(this.mycount);
  }

  onPrint() {
    this.isLoading = true;
    this.tab[0].stop = new Date();
    return this.http.put(`https://theapp-e459e.firebaseio.com/bonTravailDone/${this.tab[0].id}.json`,
    {
      id: this.tab[0].id,
      description : this.tab[0].description,
      designation: this.tab[0].designation,
      start : this.tab[0].start,
      note: this.tab[0].note,
      stop : this.tab[0].stop,
      img : this.tab[0].img,
      NbrCopy : this.mycount
    }
    )
    .subscribe( res => {
      console.log('res ', res);
      this.tab2 = this.tab.splice(0, 1);
      this.storage.set('BTdone', this.tab2);
      this.storage.set('BT', this.tab);
      this.isLoading = false;
      this.presentToast();
      if (this.tab.length === 0) {
        this.router.navigateByUrl('/home-scan');
        } else {
        console.log(this.tab[0].id);
        this.router.navigateByUrl(`/bt/${ this.tab[0].id}`);
        }
      console.log('PDF ', this.pdfObj);
      },
      (err: HttpErrorResponse) => {
      console.log('error ', err.error);
      console.log('name ', err.name);
      console.log('message ', err.message);
      console.log('status ', err.status);
      this.isLoading = false;
      // Si problème lors de l'envoie sur la DB, donc mise en place d'une collection en attente
      this.alertCtrl.create(
        {
          header: 'Une erreur est intervenue',
          message: 'Les informations n\'ont être envoyé, elles seront stockées jusqu\'au moment de se déloguer',
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
  }

  // Message de confirmation d'envoie des données
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Your data have been saved.',
      duration: 2000
    });
    toast.present();
  }
}
