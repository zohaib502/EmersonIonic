import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaterialModalPage } from './material-modal';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    MaterialModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MaterialModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class MaterialModalPageModule { }
