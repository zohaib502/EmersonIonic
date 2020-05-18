import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPreferencesModalPageSummary } from './user-preferences-modal_summary';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    UserPreferencesModalPageSummary,
  ],
  imports: [
    IonicPageModule.forChild(UserPreferencesModalPageSummary),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class UserPreferencesModalPageSummaryModule { }
