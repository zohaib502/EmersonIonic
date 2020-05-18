import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeNonclaritylistPage } from './time-nonclaritylist';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { PipesModule } from '../../../pipes/pipes.module';
@NgModule({
  declarations: [
    TimeNonclaritylistPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeNonclaritylistPage),
    CustomHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    ComponentsModule,
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class TimeNonclaritylistPageModule {}
