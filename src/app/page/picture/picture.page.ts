import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { FIREBASE_CONFIG } from './firebase.config';
import { storage, initializeApp} from 'firebase';

import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {

  user: string;
  id: string;
  here =  false;
  idRef = '';
  refe: number;
  image: string;
  tab = [];
  pictures: any;


  constructor(
    private storageDb: Storage,
    private activatedroute: ActivatedRoute,
    private camera: Camera,
    private alertCtrl: AlertController,
    private router: Router,
    private connection: ConnectionService
  ) {
    initializeApp(FIREBASE_CONFIG);
    this.connection.onCheck();
  }

  ngOnInit() {
    this.storageDb.get('IdUtilisateur').then((val) => {
      this.user = val;
      this.id = this.activatedroute.snapshot.paramMap.get('btid');
      this.storageDb.get('BTCurrent').then((valeur) => {
        this.tab = valeur;
      });
    });
    this.tab[0].refImg = [];
  }


  // * Test Photo n°1
  async takePhoto() {
    this.refe = Date.now();
    try {

      const options: CameraOptions = {
        quality: 90,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      const result = await this.camera.getPicture(options);
      this.here = true;
      this.image = `data:image/jpeg;base64,${result}`;

    } catch (e) {
      console.error(e);
    }
  }

  onValid() {

    this.pictures = storage().ref(`${this.refe}-${this.id}-${this.user}`);
    this.idRef = '${this.refe}-${this.id}-${this.user}';
    this.tab[0].refImg.push(this.idRef)
    this.pictures.putString(this.image, 'data_url').then(() => {
      this.alertCtrl.create(
        {
          header: 'OK',
          message: 'OK',
          buttons: [
            {
              text: 'OK',
              handler: () => {
              }
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
    });
  }




  onStop() {
    this.router.navigateByUrl(`/confirm/${this.id}`);
  }

}
