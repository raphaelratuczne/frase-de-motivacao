import { Component, ViewEncapsulation } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { ModalDiaPage } from '../modal-dia/modal-dia';

import { todayDateToString } from '../../../functions/today-date-to-string';

@Component({
  selector: 'page-modal-calendario',
  templateUrl: 'modal-calendario.html',
  styleUrls: ['modal-calendario.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalCalendarioPage {

  br: any = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  dias: string[];

  value: Date;
  minDateValue: Date;
  maxDateValue: Date;
  invalidDates: Date[];

  constructor(
    //private navCtrl: NavController,
    // private viewCtrl: ViewController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    this.dias = this.navParams.get('dias');
    // console.log('dias', this.dias);

    this.minDateValue = new Date(this.dias[0] + 'T00:00');
    this.maxDateValue = new Date( this.dias[ this.dias.length - 1 ] + 'T00:00' );
    this.invalidDates = [];

    for (let d = new Date(this.minDateValue), df = new Date(this.maxDateValue); d < df; d = new Date(d.getTime()+ (24*60*60*1000))) {
      // const dia = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);
      const dia = todayDateToString(d);
      if (!this.dias.includes(dia)) {
        this.invalidDates.push(new Date(d));
      }
    }

  }

  ionViewWillEnter() {

  }

  public async onChange($event) {
    // console.log($event);
    const modal = await this.modalCtrl.create({
      component: ModalDiaPage,
      componentProps: { dia: todayDateToString($event) }
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
