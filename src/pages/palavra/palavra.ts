import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-palavra',
  templateUrl: 'palavra.html',
})
export class PalavraPage {

  public palavras = [['Shopping','Hospital'],['Cafe','Dog Park'],['Pub','Space']];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PalavraPage');
  }

  public salvar(): void {
    this.navCtrl.pop();
  }

}
