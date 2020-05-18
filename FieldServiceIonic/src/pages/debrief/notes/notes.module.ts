import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotesPage } from './notes';
import { PipesModule } from '../../../pipes/pipes.module';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    NotesPage,
  ],
  imports: [
    IonicPageModule.forChild(NotesPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule
  ],
})
export class NotesPageModule { }
