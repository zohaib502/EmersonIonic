import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoTestDataPage } from './iso-test-data';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TimepickerModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    IsoTestDataPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoTestDataPage),
    SdrHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class IsoTestDataPageModule {}
