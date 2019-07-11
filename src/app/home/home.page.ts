import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userAcc = { preferences: {}};
  user: FormGroup;
  key: string = 'username';
  usermail: string;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public formbuilder: FormBuilder,
    private storage: Storage
    ) {

    this.user = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')] ],
      password: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(6)]],
    });

  }

  // * Fonction qui va savegarder le mailUser
  saveData() {
    console.log('save');
    this.storage.set(this.key, this.usermail);
  }

  submitform() {
    console.log(this.userAcc);
    this.navCtrl.navigateRoot('/home-scan');
  }

  formsubmit({value, valid}: {value: User, valid: boolean}) {

    let foo = this.user.value;
    let bar = this.user.valid;
    console.log('user :', foo);
    console.log('valid :', bar);
    this.saveData();
    this.router.navigate(['/home-scan']);
  }

}


