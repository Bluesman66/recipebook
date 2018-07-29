import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { RecipeService } from '../recipes/recipe.service';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { DataStorageService } from '../shared/data-storage.service';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        AppRoutingModule
    ],
    exports: [
        AppRoutingModule,
        HeaderComponent
    ],
    providers: [
        RecipeService,
        DataStorageService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
    ]
})
export class CoreModule {

}