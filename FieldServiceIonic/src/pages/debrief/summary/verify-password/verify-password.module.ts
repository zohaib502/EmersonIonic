import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyPasswordPage } from './verify-password';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    VerifyPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyPasswordPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class VerifyPasswordPageModule { }
