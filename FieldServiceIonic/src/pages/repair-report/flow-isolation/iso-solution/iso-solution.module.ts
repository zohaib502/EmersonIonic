import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoSolutionPage } from './iso-solution';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
@NgModule({
  declarations: [
    IsoSolutionPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoSolutionPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader } }),
    SdrHeaderPageModule
  ],
})
export class IsoSolutionPageModule {}
