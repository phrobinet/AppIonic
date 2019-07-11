// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoadingController } from '@ionic/angular';
// import { NgForm } from '@angular/forms';

// import { AuthService } from './auth.service';
// import { Storage } from '@ionic/storage';

// export interface User {
//   email: string;
//   password: string;
//   key: string;
//   usermail: string;
// }

// @Component({
//   selector: 'app-auth',
//   templateUrl: './auth.page.html',
//   styleUrls: ['./auth.page.scss']
// })
// export class AuthPage implements OnInit {
//   key = 'usermail';
//   isLoading = false;
//   tab = [];


//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private loadingCtrl: LoadingController,
//     private storage: Storage
//     ) {}

//     saveData(a) {
//       this.storage.set(this.key, a);
//     }
//   ngOnInit() {
//   }

//   onLogin() {
//     this.isLoading = true;
//     this.authService.login();
//     this.router.navigateByUrl('/home-scan');
//     // this.loadingCtrl
//     //   .create({ keyboardClose: true, message: 'Logging in...' })
//     //   .then(loadingEl => {
//     //     loadingEl.present();
//     //     setTimeout(() => {
//     //       this.isLoading = false;
//     //       loadingEl.dismiss();
//     //     }, 500);
//     //   });
//   }
//   onSubmit(form: NgForm) {
//     if (!form.valid) {
//       return;
//     }
//     const email = form.value.email;
//     const password = form.value.password;
//     this.saveData(email);
//     this.storage.set('BT', this.tab);
//     console.log(email, password);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {}

  ngOnInit() {}
  

  authenticate(email: string, password: string) {
    console.log('authenticate ', email, ',', password);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          console.log(this.isLogin);
          authObs = this.authService.login(email, password);
        } else {
          console.log('not isLogin');
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.router.navigateByUrl('/home-scan');
            this.isLoading = false;
            loadingEl.dismiss();
            console.log('coucou');
            console.log('coucou2');
          },
          errRes => {
            console.log('code')
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail inconnu.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Mot de passe incorrect.';
            }
            this.showAlert(message);
          }
        );
      });
  }


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'L\'authentification a échouée',
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }
}

