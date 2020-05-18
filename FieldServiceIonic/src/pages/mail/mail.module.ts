import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MailPage } from './mail';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';

@NgModule({
  declarations: [
    MailPage,
  ],
  imports: [
    IonicPageModule.forChild(MailPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class MailPageModule {}
