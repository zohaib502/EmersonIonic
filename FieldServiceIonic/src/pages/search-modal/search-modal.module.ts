import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchModalPage } from './search-modal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class SearchModalPageModule {}
