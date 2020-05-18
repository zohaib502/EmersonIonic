import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonSearchModalPage } from './common-search-modal';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CommonSearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonSearchModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    NgxPaginationModule,
    PipesModule
  ],
})
export class CommonSearchModalPageModule { }
