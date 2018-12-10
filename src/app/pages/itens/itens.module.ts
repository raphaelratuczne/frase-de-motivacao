import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ItensPage } from './itens';

@NgModule({
  declarations: [ItensPage],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ItensPage
      }
    ])
  ],
})
export class ItensPageModule {}
