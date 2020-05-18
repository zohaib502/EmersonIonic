import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { SdrHeaderPageModule } from '../sdr-header/sdr-header.module';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { ReviewSubmitPage } from './review-submit';

@NgModule({
  declarations: [
    ReviewSubmitPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewSubmitPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    CustomHeaderPageModule
  ],
})
export class ReviewSubmitPageModule {}
