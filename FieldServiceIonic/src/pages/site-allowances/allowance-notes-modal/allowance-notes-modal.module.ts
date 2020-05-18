import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllowanceNotesModalPage } from './allowance-notes-modal';
import { PipesModule } from '../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    AllowanceNotesModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AllowanceNotesModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class AllowanceNotesModalPageModule { }
