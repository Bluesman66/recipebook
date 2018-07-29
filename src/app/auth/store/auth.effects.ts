import * as firebase from 'firebase';
import { from } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$
        .ofType(AuthActions.TRY_SIGNUP)
        .pipe(
            map(
                (action: AuthActions.TrySignup) => {
                    return action.payload;
                }
            ),
            switchMap(
                (authData: { username: string, password: string }) => {
                    return from(firebase.auth().createUserWithEmailAndPassword(
                        authData.username, authData.password)
                    );
                }
            ),
            switchMap(
                () => {
                    return from(firebase.auth().currentUser.getIdToken());
                }
            ),
            mergeMap(
                (token: string) => {
                    return [
                        {
                            type: AuthActions.SIGNUP
                        },
                        {
                            type: AuthActions.SET_TOKEN,
                            payload: token
                        }
                    ];
                }
            )
        );

    constructor(private actions$: Actions) { }
}
