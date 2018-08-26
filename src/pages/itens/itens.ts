import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-itens',
  templateUrl: 'itens.html',
})
export class ItensPage {

  public page: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
    if (!this.page) {
      this.navCtrl.setRoot('RoteiroPage');
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ItensPage', this.page);
  }

  public getHeader(): string {
    switch (this.page) {
      case 'grato': return 'Gratidão';
      case 'paixao': return 'Paixão';
      case 'plano': return 'Planos';
    }
  }

  public getText(): string {
    switch(this.page) {
      case 'grato': return 'Sou grato por:';
      case 'paixao': return 'Minhas paixões são:';
      case 'plano': return 'Meus planos para o futuro são:';
    }
  }

  public salvar(): void {
    this.navCtrl.pop();
  }
}
