import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminFeedbackdetailPage } from './admin-feedbackdetail';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
    AdminFeedbackdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminFeedbackdetailPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    CustomHeaderPageModule,
    Ionic2RatingModule
  ],
})
export class AdminFeedbackdetailPageModule { }
