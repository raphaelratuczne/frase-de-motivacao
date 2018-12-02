import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var cordova;

@Injectable()
export class LocalNotificationProvider {

  constructor(private platform: Platform) { }

  // seta lembretes para os proximos 7 dias
  public setAlertasUsarApp() {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.cancel([101,102,103,104,105,106,107], () => {
        let agenda = [];
        let hj = new Date();
        hj.setHours(6);
        hj.setMinutes(0);
        hj.setSeconds(0);
        for (let i = 101; i <= 107; i++) {
          agenda.push({
            id: i,
            title: 'Minha Terapia',
            text: 'Bom dia, não esqueça de fazer sua terapia hoje.',
            at: new Date( hj.getTime() + ((i-100) * 1000 * 60 * 60 * 23) )
          });
        }
        cordova.plugins.notification.local.schedule(agenda);
      });
    }
  }

  public setAlertasPalavra(palavra: string, lembretes:boolean, repetir:string): void {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.cancelAll(() => {
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
          this.setAlertasUsarApp();
        }
      });
    }
  }

}
