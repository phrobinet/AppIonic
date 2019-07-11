import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Bontravail } from './bontravail';

interface BtData {
  designation: string;
  description: string;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class BonService {

  constructor(
    private http: HttpClient
  ) { }

  getbontravail(id: string) {
    return this.http
    .get<BtData>(
      `https://theapp-e459e.firebaseio.com/bontravail/${id}.json`
      ).pipe(
        map(resData => {
          console.log('resData' , resData);
          // retour des infos de la DB
          return new Bontravail(
            id,
            resData.description,
            resData.designation,
            resData.note,
            );
    }));
  }
}
