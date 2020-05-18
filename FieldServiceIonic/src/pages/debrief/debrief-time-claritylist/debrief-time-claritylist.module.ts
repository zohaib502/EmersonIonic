import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebriefTimeClaritylistPage } from './debrief-time-claritylist';
import { PipesModule } from '../../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
@NgModule({
  declarations: [
    DebriefTimeClaritylistPage,
  ],
  imports: [
    IonicPageModule.forChild(DebriefTimeClaritylistPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    CustomHeaderPageModule
  ],
})
export class DebriefTimeClaritylistPageModule {}
