
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
  tab = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    // console.log('authenticate ', email, ',', password);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            console.log(resData.expiresIn);
            this.router.navigateByUrl('/home-scan');
            this.storage.set('IdUtilisateur', email);
            // this.storage.set('BT', this.tab);
            // this.storage.set('BTAwait', this.tab);
            // if (this.tab.length === 0) {
            //   this.router.navigateByUrl('/home-scan');
            //   } else {
            //   this.router.navigateByUrl(`/bt/${ this.tab[0].id}`);
            //   }
            this.isLoading = false;
            loadingEl.dismiss();
          },
          errRes => {
            // console.log('code');
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
        message: 'Pas de connexion',
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }
}

