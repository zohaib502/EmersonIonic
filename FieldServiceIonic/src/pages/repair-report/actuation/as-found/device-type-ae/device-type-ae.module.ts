import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceTypeAePage } from './device-type-ae';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../../app/custom-translate-loader';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../../sdr-header/sdr-header.module';

@NgModule({
  declarations: [
    DeviceTypeAePage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceTypeAePage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    SdrHeaderPageModule 
  ],
  exports: [
    DeviceTypeAePage
  ]
})
export class DeviceTypeAePageModule {}

 