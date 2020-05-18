import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNotesModalPage } from './add-notes-modal';
import { PipesModule } from '../../../../pipes/pipes.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    AddNotesModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNotesModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule,
  ],
})
export class AddNotesModalPageModule { }
