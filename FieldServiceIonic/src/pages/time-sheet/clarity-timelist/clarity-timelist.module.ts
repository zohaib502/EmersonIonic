import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClarityTimelistPage } from './clarity-timelist';
import { CustomHeaderPageModule } from '../../custom-header/custom-header.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ClarityTimelistPage,
  ],
  imports: [
    IonicPageModule.forChild(ClarityTimelistPage),
    CustomHeaderPageModule,
    BsDatepickerModule,
    DatepickerModule,
    ComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule
  ],
})
export class ClarityTimelistPageModule {}
