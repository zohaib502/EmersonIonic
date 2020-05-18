import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetAddEditModalPage } from './timesheet-add-edit-modal';
import { TimepickerModule } from 'ngx-bootstrap';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { PipesModule } from '../../../pipes/pipes.module';
@NgModule({
  declarations: [
    TimesheetAddEditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TimesheetAddEditModalPage),
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
    PipesModule
  ],
})
export class TimesheetAddEditModalPageModule {}
