import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoAsFoundPage } from './iso-as-found';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';

@NgModule({
  declarations: [
    IsoAsFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoAsFoundPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader } }),
    SdrHeaderPageModule
  ],
})
export class IsoAsFoundPageModule {}
