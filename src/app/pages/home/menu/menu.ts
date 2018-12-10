import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'page-menu',
  template: `
    <ion-list>
      <ion-list-header>Minha Terapia</ion-list-header>
      <button ion-item (click)="fechar('sair')">
        <ion-icon name="log-out" item-start></ion-icon>
        Deslogar
      </button>
    </ion-list>
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
