import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreTestPage } from './pre-test';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../../app/custom-translate-loader';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PreTestPage,
  ],
  imports: [
    IonicPageModule.forChild(PreTestPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
  ],
  exports: [
    PreTestPage
  ]
})
export class PreTestPageModule {}
