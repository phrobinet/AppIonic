import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  texte = '';
  addNote = null;
  tab = [];
  id = '';
  // bontravail = '';


  constructor(
    private storage: Storage,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.id = this.activatedRoute.snapshot.paramMap.get('myid');
    this.storage.get('BT').then((val) => {
      this.tab = val;
      this.id = val[0].id;
    });
  }

  onDB() {
      // const tableau = this.tab;
      this.tab[0].note = this.texte;
      this.storage.set('BT', this.tab);
      this.router.navigateByUrl(`/bt/${this.tab[0].id}`);
  }

  onStop() {
    this.router.navigateByUrl(`confirm`);
  }

}
