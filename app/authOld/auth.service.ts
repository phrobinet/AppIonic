// import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthService {
//     private _userIsAuthenticated = true;
//     private _userId = 'abc';

//     get userIsAuthenticated() {
//         return this._userIsAuthenticated;
//     }

//     get userId() {
//         return this._userId;
//     }

//     constructor() {}

//     login() {
//         this._userIsAuthenticated = true;
//     }

//     logout() {
//         this._userIsAuthenticated = false;
//     }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _userIsAuthenticated = false;
  private _user = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }
      ));
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
        environment.firebaseAPIKey
      }`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this))
    );
  }

  login(email: string, password: string) {
    console.log('login')
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.firebaseAPIKey
        }`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
    ) {
      const data = JSON.stringify(
        {
        userId: userId,
        token: token,
        tokenExpirationDate: tokenExpirationDate,
        email: email
      });
      Plugins.Storage.set({key: 'authData', value: data});
    }


  private setUserData(userData: AuthResponseData) {
      const expirationTime = new Date(
        new Date().getTime() + (+userData.expiresIn * 1000
          ));
      this._user.next(
        new User(
          userData.localId,
          userData.email,
          userData.idToken,
          expirationTime
        )
      );
      this.storeAuthData(
        userData.localId,
        userData.idToken,
        expirationTime.toISOString(),
        userData.email
        );
    }

}
