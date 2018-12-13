import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'page-menu',
  template: `
    <ion-content>
      <ion-list>
        <ion-list-header>Minha Terapia</ion-list-header>
        <ion-item (click)="fechar('sair')">
          <ion-label>Deslogar</ion-label>
          <ion-icon name="log-out" slot="end"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class MenuPage {

  constructor(
    // public navParams: NavParams,
    private popoverController: PopoverController
  ) { }

  ionViewDidLoad() { }

  public fechar(op): void {
    this.popoverController.dismiss(op);
  }

}
