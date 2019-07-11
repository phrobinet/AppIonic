import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
// import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();

  tab = [];
  selectedImage: string;
  usePicker = false;
  myImg = null;
  id = '';
  here = false;

  constructor(
    public alertCtrl: AlertController,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.storage.get('BT').then((val) => {
      this.tab = val;
      this.id = this.tab[0].id;
    });


  }
  onPickImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.myImg = base64Image;
      this.here = true;
      this.tab[0].img = this.myImg;
      this.storage.set('BT', this.tab);
    }, (err) => {
      this.alertCtrl.create(
        {
          header: 'Une erreur est intervenue',
          message: 'La photo n\'a pu être sauvegardé',
          buttons: [
            {
              text: 'Okay',
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

  onValid() {
    this.tab[0].img = this.myImg;
    this.storage.set('BT', this.tab);
    this.router.navigateByUrl(`/bt/${this.tab[0].id}`);
  }

  onStop() {
    this.router.navigateByUrl(`confirm`);
  }

}

