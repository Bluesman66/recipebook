import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from '../../auth/store/auth.actions';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as RecipeActions from '../../recipes/store/recipe.actions';
import { DataStorageService } from '../../shared/data-storage.service';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.authState = this.store.select('auth');
  }

  onSaveData() {
    this.dataStorageService.storeRecipes()
      .subscribe(
        (response) => {
          console.log(response);
        }
      );
  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
