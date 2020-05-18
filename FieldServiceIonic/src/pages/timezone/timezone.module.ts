import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimezonePage } from './timezone';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';

@NgModule({
  declarations: [
    TimezonePage,
  ],
  imports: [
    IonicPageModule.forChild(TimezonePage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule,
    CustomHeaderPageModule
  ],
})
export class TimezonePageModule {}
