import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewRepairReportPage } from './new-repair-report';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { TimepickerModule } from 'ngx-bootstrap';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    NewRepairReportPage,
  ],
  imports: [
    IonicPageModule.forChild(NewRepairReportPage),
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
export class NewRepairReportPageModule {}
