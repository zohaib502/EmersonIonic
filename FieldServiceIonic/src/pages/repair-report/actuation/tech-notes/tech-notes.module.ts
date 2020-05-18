import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechNotesPage } from './tech-notes';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    TechNotesPage,
  ],
  imports: [
    IonicPageModule.forChild(TechNotesPage),
    SdrHeaderPageModule,
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),

  ],
})
export class TechNotesPageModule {}
