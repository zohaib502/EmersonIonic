import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckdeviceModalPage } from './checkdevice-modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CheckdeviceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckdeviceModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class CheckdeviceModalPageModule {}
