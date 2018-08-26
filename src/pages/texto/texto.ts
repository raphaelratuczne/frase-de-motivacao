import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-texto',
  templateUrl: 'texto.html',
})
export class TextoPage {

  public page: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
    if (!this.page) {
      this.navCtrl.setRoot('RoteiroPage');
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TextoPage');
  }

  public getHeader(): string {
    switch (this.page) {
      case 'objetivo': return 'Objetivo';
      case 'orgulho': return 'Orgulho';
    }
  }

  public getText(): string {
    switch(this.page) {
      case 'objetivo': return 'O que devo cumprir no dia de hoje:';
      case 'orgulho': return 'Sinto orgulho de mim porque:';
    }
  }

  public salvar(): void {
    this.navCtrl.pop();
  }
}
