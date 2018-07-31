import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

    @Effect()
    recipeFetch = this.actions$
        .ofType(RecipeActions.FETCH_RECIPES)
        .pipe(
            switchMap(
                (action: RecipeActions.FetchRecipes) => {
                    return this.httpClient.get<Recipe[]>('https://ng-recipe-book-27947.firebaseio.com/recipes.json', {
                        observe: 'body',
                        responseType: 'json'
                    })
                    .pipe(
                        map(
                            (recipes) => {
                                console.log(recipes);
                                for (const recipe of recipes) {
                                    if (!recipe['ingredients']) {
                                        recipe['ingredients'] = [];
                                    }
                                }
                                return {
                                    type: RecipeActions.SET_RECIPES,
                                    payload: recipes
                                };
                            }
                        )
                    );
                }
            )
        );


    constructor(private actions$: Actions,
        private httpClient: HttpClient) { }
}
