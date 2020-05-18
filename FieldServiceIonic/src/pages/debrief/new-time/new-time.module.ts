import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTimePage } from './new-time';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module';
import { BsDatepickerModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    NewTimePage,
  ],
  imports: [
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot(),
    IonicPageModule.forChild(NewTimePage),
  ],
})
export class NewTimePageModule {}
