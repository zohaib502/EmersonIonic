import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { TimeEntryPage } from './time-entry';

@NgModule({
  declarations: [
    TimeEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeEntryPage),
    CustomHeaderPageModule,
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
export class TimeEntryPageModule {}
