import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPreferencesPage } from './user-preferences';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';


@NgModule({
  declarations: [
    UserPreferencesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPreferencesPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    CustomHeaderPageModule
  ],
})
export class UserPreferencesPageModule { }
