import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ModalDiaPage } from './modal-dia';

@NgModule({
  declarations: [
    ModalDiaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDiaPage),
  ],
})
export class ModalDiaPageModule {}
