import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarModule } from "ion2-calendar";

import { ModalCalendarioPage } from './modal-calendario';

@NgModule({
  declarations: [
    ModalCalendarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCalendarioPage),
    CalendarModule
  ]
})
export class ModalCalendarioPageModule {}
