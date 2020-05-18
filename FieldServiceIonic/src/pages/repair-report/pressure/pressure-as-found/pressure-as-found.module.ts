import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PressureAsFoundPage } from './pressure-as-found';import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    PressureAsFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(PressureAsFoundPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader } }),
    SdrHeaderPageModule
  ],
})
export class PressureAsFoundPageModule {}
