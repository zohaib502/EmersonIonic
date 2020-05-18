import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LanguagesPage } from './languages';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';


@NgModule({
  declarations: [
    LanguagesPage,
  ],
  imports: [
    IonicPageModule.forChild(LanguagesPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    CustomHeaderPageModule,
    NgxPaginationModule
  ],
})
export class LanguagesPageModule { }
