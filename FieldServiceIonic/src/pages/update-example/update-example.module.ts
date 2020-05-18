import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateExamplePage } from './update-example';
import {CustomHeaderPageModule} from "../custom-header/custom-header.module";

@NgModule({
  declarations: [
    UpdateExamplePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateExamplePage),
    CustomHeaderPageModule,
  ],
})
export class UpdateExamplePageModule {}
