import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarModalPage } from './calendar-modal';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    CalendarModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    CustomHeaderPageModule,
    Ionic2RatingModule
  ],
})
export class CalendarModalPageModule { }
