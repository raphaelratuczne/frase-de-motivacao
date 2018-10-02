import { Component } from '@angular/core';
import { IonicPage, /*NavController,*/ NavParams, ViewController } from 'ionic-angular';

import { DiaProvider } from '../../../providers/dia.provider';

import { Dia } from '../../../models/dia';

import { todayDateToString } from '../../../functions/today-date-to-string';

@IonicPage()
@Component({
  selector: 'page-modal-dia',
  templateUrl: 'modal-dia.html',
})
export class ModalDiaPage {

  public hoje: string;
  public converterDia = (dia:string) => dia ? dia.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1') : '';
  public dia: Promise<Dia>;

  constructor(
    // public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private diaProvider: DiaProvider
  ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalDiaPage');
    // console.log(this.navParams.get('dia'));
    const dia = this.navParams.get('dia');
    this.hoje = todayDateToString(new Date(dia.time));
    this.dia = this.diaProvider.getDia(this.hoje);
  }

  public fechar(): void {
    this.viewCtrl.dismiss();
  }

}
