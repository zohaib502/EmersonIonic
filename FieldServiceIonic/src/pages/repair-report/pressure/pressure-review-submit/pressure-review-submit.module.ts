import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PressureReviewSubmitPage } from './pressure-review-submit';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { CustomHeaderPageModule } from '../../../custom-header/custom-header.module';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PressureReviewSubmitPage,
  ],
  imports: [
    IonicPageModule.forChild(PressureReviewSubmitPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    CustomHeaderPageModule,
    PipesModule
  ],
})
export class PressureReviewSubmitPageModule { }
