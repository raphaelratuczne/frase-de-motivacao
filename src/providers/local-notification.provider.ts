import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var cordova;

@Injectable()
export class LocalNotificationProvider {

  constructor(private platform: Platform) { }

  // seta lembretes para os proximos 7 dias
  public setAlertasUsarApp() {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.isPresent(99, (present) => {
        if (!present) {
          cordova.plugins.notification.local.schedule(this.criarAlertaUsarApp());
        }
      });
    }
  }

  private criarAlertaUsarApp() {
    let hj = new Date();
    hj.setHours(6);
    hj.setMinutes(0);
    hj.setSeconds(0);

    return {
      id: 99,
      title: 'Minha Terapia',
      text: 'Bom dia, não esqueça de fazer sua terapia hoje.',
      firstAt: new Date( hj.getTime() + (1000 * 60 * 60 * 24) ),
      every: 'day'
    };
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
          agenda.push(this.criarAlertaUsarApp());
          cordova.plugins.notification.local.schedule(agenda);
        }
      });
    }
  }

}
