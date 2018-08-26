import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItensPage } from './itens';

@NgModule({
  declarations: [ItensPage],
  imports: [IonicPageModule.forChild(ItensPage)],
})
export class ItensPageModule {}
