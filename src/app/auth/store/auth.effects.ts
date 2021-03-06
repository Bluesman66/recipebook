import * as firebase from 'firebase';
import { from } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

    @Effect()
    authSignin = this.actions$
        .ofType(AuthActions.TRY_SIGNIN)
        .pipe(
            map(
                (action: AuthActions.TrySignin) => {
                    return action.payload;
                }
            ),
            switchMap(
                (authData: { username: string, password: string }) => {
                    return from(firebase.auth().signInWithEmailAndPassword(
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
                    this.router.navigate(['/']);
                    return [
                        {
                            type: AuthActions.SIGNIN
                        },
                        {
                            type: AuthActions.SET_TOKEN,
                            payload: token
                        }
                    ];
                }
            )
        );

    @Effect({ dispatch: false })
    logout = this.actions$
        .ofType(AuthActions.LOGOUT)
        .pipe(
            switchMap(() => from(firebase.auth().signOut())),
            tap(() => this.router.navigate(['/']))
        );

    constructor(private actions$: Actions, private router: Router) { }
}
