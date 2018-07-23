import * as firebase from 'firebase';

import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }

}
