import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteAllowancesPage } from './site-allowances';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    SiteAllowancesPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteAllowancesPage),
    CustomHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule
  ],
})
export class SiteAllowancesPageModule {}
