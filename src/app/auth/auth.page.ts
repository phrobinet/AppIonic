
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
  // isLoading = false;
  isLogin = true;
  tab = [];
  splash = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.splash = false;
    }, 5000);
  }

  authenticate(email: string, password: string) {
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
            loadingEl.dismiss();
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_NOT_FOUND') {
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
        header: 'L\'authentification a échoué',
        message: 'Pas de connexion',
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }
}

