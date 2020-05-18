import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SdrTabsPage } from './sdr-tabs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';

@NgModule({
  declarations: [
    SdrTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(SdrTabsPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    CustomHeaderPageModule

  ],
})
export class SdrTabsPageModule {}
