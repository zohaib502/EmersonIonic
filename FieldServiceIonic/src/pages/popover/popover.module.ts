import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPage } from './popover';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';

@NgModule({
  declarations: [
    PopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
  ],
})
export class PopoverPageModule { }
