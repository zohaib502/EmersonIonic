import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageRolesPage } from './manage-roles';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManageRolesPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageRolesPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule,
  ],
})
export class ManageRolesPageModule {}
