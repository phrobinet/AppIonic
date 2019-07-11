import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  id: string = '';
  bontravail: string = '';
  tab = [];
  tab2 = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private storage: Storage,
    private avtivatedRoute: ActivatedRoute,
    private connection: ConnectionService
  ) { 
    this.connection.onCheck()
  }

  ngOnInit(): void {
    this.id = this.avtivatedRoute.snapshot.paramMap.get('btid');
    console.log('id ', this.id);
    this.storage.get('BTCurrent').then((val) => {
      this.tab = val;
    });
  }

  onYes(): void {
    console.log('Yes ', this.id);
    this.router.navigateByUrl(`/print/${this.id}`);
  }

  onNo(): void {
    this.router.navigateByUrl(`/bt/${this.id}`);
  }

}
