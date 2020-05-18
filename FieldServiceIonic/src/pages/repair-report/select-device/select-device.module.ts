import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectDevicePage } from './select-device';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SelectDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectDevicePage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } })
  ],
})
export class SelectDevicePageModule { }
