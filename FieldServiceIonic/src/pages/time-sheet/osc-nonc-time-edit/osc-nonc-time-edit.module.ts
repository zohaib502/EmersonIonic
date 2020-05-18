import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OscNoncTimeEditPage } from './osc-nonc-time-edit';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { BsDatepickerModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    OscNoncTimeEditPage,
  ],
  imports: [
    IonicPageModule.forChild(OscNoncTimeEditPage),
    CustomHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    ComponentsModule,
    PipesModule,
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
export class OscNoncTimeEditPageModule {}
