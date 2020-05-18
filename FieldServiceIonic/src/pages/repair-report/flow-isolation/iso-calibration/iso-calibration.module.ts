import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoCalibrationPage } from './iso-calibration';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';

@NgModule({
  declarations: [
    IsoCalibrationPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoCalibrationPage),
     TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule


  ],
})
export class IsoCalibrationPageModule {}
