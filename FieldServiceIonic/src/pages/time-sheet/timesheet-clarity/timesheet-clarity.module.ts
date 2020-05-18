import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetClarityPage } from './timesheet-clarity';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    TimesheetClarityPage,
  ],
  imports: [
    IonicPageModule.forChild(TimesheetClarityPage),
    CustomHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    ComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class TimesheetClarityPageModule {}
