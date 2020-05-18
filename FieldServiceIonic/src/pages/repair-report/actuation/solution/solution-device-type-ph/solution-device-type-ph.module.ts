import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceTypePhSolution } from './solution-device-type-ph';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../../app/custom-translate-loader';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { SdrHeaderPageModule } from '../../../sdr-header/sdr-header.module';

@NgModule({
  declarations: [
    DeviceTypePhSolution,
  ],
  imports: [
    IonicPageModule.forChild(DeviceTypePhSolution),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    SdrHeaderPageModule
  ],
  exports: [
    DeviceTypePhSolution
  ]
})
export class DeviceTypePhSolutionModule {}
