import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipe.service';
import * as RecipeActions from '../store/recipe.actions';
import * as fromRecipe from '../store/recipe.reducers';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipeIngredients: FormArray;

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromRecipe.FeatureState>) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.store.dispatch(new RecipeActions.UpdateRecipe({ index: this.id, updatedRecipe: this.recipeForm.value }));
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onAddIngredient() {
    // (<FormArray>this.recipeForm.get('ingredients')).push(
    this.recipeIngredients.push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    // (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    this.recipeIngredients.removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    this.recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.store.select('recipes')
        .pipe(take(1))
        .subscribe(
          (recipeState: fromRecipe.State) => {
            const recipe = recipeState.recipes[this.id];
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;
            if (recipe['ingredients']) {
              for (const ingredient of recipe.ingredients) {
                this.recipeIngredients.push(
                  new FormGroup({
                    'name': new FormControl(ingredient.name, Validators.required),
                    'amount': new FormControl(ingredient.amount, [
                      Validators.required,
                      Validators.pattern(/^[1-9]+[0-9]*$/)
                    ])
                  })
                );
              }
            }
          }
        );
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': this.recipeIngredients
    });
  }
}
