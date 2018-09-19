import { NgModule, LOCALE_ID } from '@angular/core';
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
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }]
})
export class ModalCalendarioPageModule {}
