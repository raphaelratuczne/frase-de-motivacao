import { Component } from '@angular/core';
import { IonicPage, /*NavController,*/ NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-calendario',
  templateUrl: 'modal-calendario.html',
})
export class ModalCalendarioPage {

  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  constructor(/*private navCtrl: NavController,*/ private navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCalendarioPage');
  }

  public onChange($event) {
    console.log($event);
  }

  public fechar(): void {
    this.viewCtrl.dismiss(this.navParams.get('dados') + 'rere');
  }

}
