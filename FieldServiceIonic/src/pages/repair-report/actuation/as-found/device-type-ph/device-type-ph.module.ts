import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceTypePhPage } from './device-type-ph';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../../app/custom-translate-loader';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../../sdr-header/sdr-header.module';

@NgModule({
  declarations: [
    DeviceTypePhPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceTypePhPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    SdrHeaderPageModule 
  ],
  exports: [
    DeviceTypePhPage
  ]
})
export class DeviceTypePhPageModule {}
