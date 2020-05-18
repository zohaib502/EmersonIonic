import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoReviewSubmitPage } from './iso-review-submit';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { CustomHeaderPageModule } from '../../../custom-header/custom-header.module';

@NgModule({
  declarations: [
    IsoReviewSubmitPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoReviewSubmitPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    CustomHeaderPageModule
  ],
})
export class IsoReviewSubmitPageModule {}
