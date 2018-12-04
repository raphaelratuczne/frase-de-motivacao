import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var cordova;

@Injectable()
export class LocalNotificationProvider {

  constructor(private platform: Platform) { }

  // seta lembretes para os proximos 7 dias
  public setAlertasUsarApp() {
    if (this.platform.is('cordova')) {
      let hj = new Date();
      hj.setHours(6);
      hj.setMinutes(0);
      hj.setSeconds(0);
      const amanha = new Date( hj.getTime() + (1000 * 60 * 60 * 24) );

      cordova.plugins.notification.local.schedule({
        id: 99,
        title: 'Minha Terapia',
        text: 'Bom dia, não esqueça de fazer sua terapia hoje.',
        firstAt: amanha,
        every: 'day'
      });
    }
  }

  public setAlertasPalavra(palavra: string, lembretes:boolean, repetir:string): void {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.cancelAll(() => {
        this.setAlertasUsarApp();
        if (lembretes) {
          let agenda = [], r = parseInt(repetir);
          // loop para setar todos os lembretes
          for (let i = r; i <= 16; i+=r) {
            agenda.push({
              id: i,
              title: 'Minha Terapia',
              text: 'Lembrete da sua palavra: ' + palavra,
              at: new Date( new Date().getTime() + (i * 1000 * 60 * 60) ),
              data: { lembrete:'lembrete' }
            });
          }
          cordova.plugins.notification.local.schedule(agenda);
        }
      });
    }
  }

}
