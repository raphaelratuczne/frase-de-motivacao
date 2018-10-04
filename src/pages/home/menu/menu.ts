import { Component } from '@angular/core';
import { IonicPage, /*NavParams,*/ ViewController } from 'ionic-angular';

@IonicPage()
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
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() { }

  public fechar(op): void {
    this.viewCtrl.dismiss(op);
  }

}
