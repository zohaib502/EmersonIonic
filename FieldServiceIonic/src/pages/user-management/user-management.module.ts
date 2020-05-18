import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserManagementPage } from './user-management';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    UserManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(UserManagementPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    CustomHeaderPageModule,
    NgxPaginationModule
  ],
})
export class UserManagementPageModule {}
