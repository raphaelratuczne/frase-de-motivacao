import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TextoPage } from './texto';

@NgModule({
  declarations: [TextoPage],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: TextoPage
      }
    ])
  ],
})
export class TextoPageModule {}
