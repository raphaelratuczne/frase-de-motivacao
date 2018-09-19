import { Component } from '@angular/core';
import { IonicPage, /*NavController,*/ NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-dia',
  templateUrl: 'modal-dia.html',
})
export class ModalDiaPage {

  constructor(/*public navCtrl: NavController,*/ public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalDiaPage');
    console.log(this.navParams.get('dia'));
  }

  public fechar(): void {
    this.viewCtrl.dismiss();
  }

}
