import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditModalPage } from './edit-modal';
import { PipesModule } from '../../../../pipes/pipes.module';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { TimepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    EditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot()
  ],
})
export class EditModalPageModule { }
