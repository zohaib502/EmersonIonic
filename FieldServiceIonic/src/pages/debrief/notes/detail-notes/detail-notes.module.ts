import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailNotesPage } from './detail-notes';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    DetailNotesPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailNotesPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    ComponentsModule
  ],
})
export class DetailNotesPageModule {}
