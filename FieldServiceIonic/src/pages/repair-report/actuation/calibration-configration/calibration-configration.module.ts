import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalibrationConfigrationPage } from './calibration-configration';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    CalibrationConfigrationPage,
  ],
  imports: [
    IonicPageModule.forChild(CalibrationConfigrationPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule
  ],
})
export class CalibrationConfigrationPageModule {}
