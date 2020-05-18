import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswordModalPage } from './forgot-password-modal';

@NgModule({
  declarations: [
    ForgotPasswordModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordModalPage),
  ],
})
export class ForgotPasswordModalPageModule {}
