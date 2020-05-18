import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OSCNonCTimeEntryPage } from './osc-nonc-time-entry';

import { HttpClient } from '@angular/common/http';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { TimepickerModule } from 'ngx-bootstrap';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    OSCNonCTimeEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(OSCNonCTimeEntryPage),
    PipesModule,
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
export class OSCNonCTimeEntryPageModule {}
