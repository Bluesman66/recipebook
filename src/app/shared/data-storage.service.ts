import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable()
export class DataStorageService {

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes() {
    const token = this.authService.getToken();
    //const header = new HttpHeaders().set('Authorization', 'Some token'); 
    return this.httpClient.put('https://ng-recipe-book-27947.firebaseio.com/recipes.json?auth=' + token,
      this.recipeService.getRecipes(), {
        observe: 'body',
        //headers: header
      });
  }

  getRecipes() {    
    const token = this.authService.getToken();
    this.httpClient.get<Recipe[]>('https://ng-recipe-book-27947.firebaseio.com/recipes.json?auth=' + token, {
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
            return recipes;
          }
        )
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}
