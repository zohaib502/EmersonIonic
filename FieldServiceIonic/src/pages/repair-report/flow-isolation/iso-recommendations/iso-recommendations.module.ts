
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoRecommendationsPage } from './iso-recommendations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    IsoRecommendationsPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoRecommendationsPage),
    SdrHeaderPageModule,
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
  ],
})
export class IsoRecommendationsPageModule {}
