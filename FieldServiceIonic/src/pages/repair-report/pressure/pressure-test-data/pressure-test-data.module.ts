import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PressureTestDataPage } from './pressure-test-data';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    PressureTestDataPage,
  ],
  imports: [
    IonicPageModule.forChild(PressureTestDataPage),
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot(),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class PressureTestDataPageModule { }
