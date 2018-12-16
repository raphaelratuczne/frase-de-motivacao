import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import { ModalCalendarioPage } from './modal-calendario';

@NgModule({
  declarations: [ModalCalendarioPage],
  imports: [
    IonicModule,
    CalendarModule,
    FormsModule
  ]
})
export class ModalCalendarioPageModule {}
