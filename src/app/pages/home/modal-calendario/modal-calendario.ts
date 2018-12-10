import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { ModalDiaPage } from '../modal-dia/modal-dia';

import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'page-modal-calendario',
  templateUrl: 'modal-calendario.html',
})
export class ModalCalendarioPage {

  // public pronto = false;
  // private primeiroDia: Date;
  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options;/*: CalendarComponentOptions; = {
    from: new Date((new Date('2018-09-12').getTime()) + (new Date().getTimezoneOffset() * 60 * 1000)),
    to: new Date(),
    monthPickerFormat: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    color: 'secondary'
    // daysConfig:[{
    //   date: new Date( new Date().getTime() - (5*24*60*60*1000) ),
    //   marked: true
    // },{
    //   date: new Date( new Date().getTime() - (6*24*60*60*1000) ),
    //   disable: true
    // }],
    // monthFormat: 'MMM YYYY'
  };*/
  dias: string[];

  constructor(
    //private navCtrl: NavController,
    private navParams: NavParams,
    // private viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {
    this.dias = this.navParams.get('dias');
    console.log('dias', this.dias);

    moment.locale('pt-br');

    // cria um Date a partir da data passada
    const setDia = dia => new Date((new Date(dia).getTime()) + (new Date().getTimezoneOffset() * 60 * 1000));

    const primeiroDia = setDia(this.dias[0]);
    console.log('primeiroDia1', primeiroDia);
    // this.options.from = primeiroDia;
    this.options = {
      from: setDia(this.dias[0]),
      to: new Date(),
      monthPickerFormat: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      color: 'secondary',
      monthFormat: 'MMMM YYYY',
      daysConfig: []
    };

    // this.options.daysConfig = [];
    for (let d = primeiroDia; d <= new Date(); d.setTime( d.getTime() + (24*60*60*1000) ) ) {
      this.options.daysConfig.push({
        date: new Date(d),
        marked: this.dias.some(dia => setDia(dia).getTime() == d.getTime()),
        disable: !this.dias.some(dia => setDia(dia).getTime() == d.getTime())
      });
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalCalendarioPage');
    // this.pronto = true;
    // console.log('primeiroDia2', this.primeiroDia);
    // this.options.from = new Date((new Date('2018-09-12').getTime()) + (new Date().getTimezoneOffset() * 60 * 1000));
    // this.options.from =  new Date((new Date(this.dias[0]).getTime()) + (new Date().getTimezoneOffset() * 60 * 1000));
  }

  public async onChange($event) {
    // console.log($event);
    const modal = await this.modalCtrl.create({
      component: ModalDiaPage,
      componentProps: { dia:$event }
    });
    return await modal.present();
    // let modalDia = this.modalCtrl.create('ModalDiaPage', {dia:$event});
    // modalDia.onDidDismiss(data => {
    //   console.log(data);
    // });
    // modalDia.present();
  }

  public fechar(): void {
    this.modalCtrl.dismiss();
  }

}
