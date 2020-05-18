import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClarityTimeEntryPage } from './clarity-time-entry';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap';
@NgModule({
  declarations: [
    ClarityTimeEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ClarityTimeEntryPage),
    CustomHeaderPageModule,
    ComponentsModule,
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
export class ClarityTimeEntryPageModule { }
