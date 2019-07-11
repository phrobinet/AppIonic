import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

    // Import du module de création et scan des QRcode
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ReactiveFormsModule } from '@angular/forms';
import { BtPageModule } from './page/bt/bt.module';
import { NoteComponent } from './page/bt/note/note.component';

// Import du module de stockage DB
import { IonicStorageModule } from '@ionic/storage';

// Import du module photo
import { Camera } from '@ionic-native/camera/ngx';

// Import du module PDf
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  declarations: [AppComponent, NoteComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    BtPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    Camera,
    File,
    FileOpener
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
