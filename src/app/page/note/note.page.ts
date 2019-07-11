import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';

import { ConnectionService } from '../../services/connection.service';


@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  texte: string = '';
  tab = [];
  id: string = '';
  note = [];
  i: number = -1;
  iD: string  = '';


  constructor(
    private storage: Storage,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private connection: ConnectionService
  ) {
    this.connection.onCheck();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('btid');
    this.storage.get('BTCurrent').then((val) => {
      this.tab = val;
      let tableau;
      for (tableau of this.tab) {
        this.i++;
        if (tableau.id === this.id) {
          return this.i;
        }
      }
    });
  }

  onDB() {
    this.tab[0].note.push(this.texte);
    this.storage.set('BTCurrent', this.tab);
    this.router.navigateByUrl(`/bt/${this.id}`);
  }

  onStop(a) {
    this.iD = a;
    this.router.navigateByUrl(`/confirm/${this.iD}`);
  }

}
