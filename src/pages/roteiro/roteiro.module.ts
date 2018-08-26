import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoteiroPage } from './roteiro';

@NgModule({
  declarations: [RoteiroPage],
  imports: [IonicPageModule.forChild(RoteiroPage)],
  exports: [RoteiroPage]
})
export class RoteiroPageModule {}
