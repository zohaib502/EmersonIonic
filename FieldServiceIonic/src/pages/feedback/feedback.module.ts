import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';


@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    CustomHeaderPageModule,
    Ionic2RatingModule
  ],
})
export class FeedbackPageModule { }
