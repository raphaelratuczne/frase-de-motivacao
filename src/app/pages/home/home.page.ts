import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/Operators';

import { DiaProvider } from '../../services/dia.provider';
import { FraseProvider } from '../../services/frase.provider';
import { LocalNotificationProvider } from '../../services/local-notification.provider';

import { Dia } from '../../models/dia';

import { ModalCalendarioPage } from './modal-calendario/modal-calendario';
import { MenuPage } from './menu/menu';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit, OnDestroy {

  public dia:Dia;

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private diaProvider: DiaProvider,
    private fraseProvider: FraseProvider,
    private alertCtrl: AlertController,
    // public actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private localNotificationProvider: LocalNotificationProvider,
    private googlePlus: GooglePlus
  ) { }

  ngOnInit() {
    const d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(d$)).subscribe(async dia => {
      if (dia) {
        this.localNotificationProvider.setAlertasUsarApp();
        this.dia = dia;
        if (!dia.frase) {
          // carrega lista de frasesIndex
          const indexFrasesUsadas = await this.diaProvider.getListaIndexFrasesRegistrados();
          this.setFraseDoDia(indexFrasesUsadas);
        } else {
          d$.next();
          d$.complete();
        }
      }
    });
  }

  ngOnDestroy() {

  }

  comecar() {
    this.router.navigateByUrl('roteiro');
  }

  login(tipo) {
    if (tipo == 'g') {
      // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
      this.oauthSignIn(new auth.GoogleAuthProvider());
    } else {
      this.oauthSignIn(new auth.FacebookAuthProvider());
    }
  }

  logout() {
    this.afAuth.auth.signOut().then(() => window.location.reload());
  }

  private oauthSignIn(provider) {
    if (provider) {}
		// if (!(<any>window).cordova) {
		// 	this.afAuth.auth.signInWithPopup(provider);
		// } else {
    // console.log('provider', provider);
		// 	this.afAuth.auth.signInWithRedirect(provider).then(() => {
    //     return this.afAuth.auth.getRedirectResult()
    //   }).then(result => {
    //     console.log('result', result);
    //   }).catch(error => {
    //     console.log('error', error);
    //   });
		// }
    this.googlePlus.login({
      scopes: 'EMAIL PLUS_LOGIN',
      webClientId: '24026962670-b53aovibaseqno9v1g2m9pd5gjduq69s.apps.googleusercontent.com',
      offline: true
    })
      .then(res => console.log('logou', res))
      .catch(err => console.error('deu merda', err));
	}

  public setFraseDoDia(excluidos:number[]) {
    this.fraseProvider.getFrase(excluidos).pipe(first()).subscribe(frase => {
      this.diaProvider.setFraseDoDia(frase);
    });
  }

  public async abrirModalCalendario() {
    const dias = await this.diaProvider.getListaDiasRegistrados();
    const modal = await this.modalCtrl.create({
      component: ModalCalendarioPage,
      componentProps: { dias:dias }
    });
    return await modal.present();
    // let modalCalendario = this.modalCtrl.create('ModalCalendarioPage', {dias:dias});
    // modalCalendario.onDidDismiss(data => {
    //   console.log(data);
    //  });
    // modalCalendario.present();
  }

  public async abrirMenu(ev) {
    if (this.dia) {
      const popover = await this.popoverCtrl.create({
        component: MenuPage,
        event: ev,
        translucent: false
      });
      popover.onDidDismiss().then(async op => {
        if (op && op.data == 'sair') {
          const confirm = await this.alertCtrl.create({
            header: 'Deslogar?',
            message: 'Tem certeza que deseja deslogar do Minha Terapia?',
            buttons: [
              {
                text: 'Cancelar'
              },
              {
                text: 'Ok',
                handler: () => this.logout()
              }
            ]
          });
          await confirm.present();
        }
      });
      return await popover.present();
    }
  }

  share() {
    let txt = this.dia.frase;
    let canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    let c = canvas.getContext('2d');
    c.fillStyle = '#424143';
    c.textAlign = 'center';
    let imageObj = new Image();
    imageObj.onload = () => {
      c.drawImage(imageObj, 0, 0, 800, 800);
      c.font = '50px rodona';
      c.fillText('Minha Terapia', 400, 130);
      c.font = '34px rodona';
      printAtWordWrap(c, txt, 400, 250, 38, 600);
      this.socialSharing.share('http://bit.ly/2QkvyDN', 'Minha Terapia', canvas.toDataURL());
    }
    imageObj.src = 'assets/imgs/amor-em-estampa-padrao-instagram.png';
  }

}

const printAtWordWrap = (context , text, x, y, lineHeight, fitWidth) => {
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText( text, x, y );
    return;
  }
  let words = text.split(' '),
  currentLine = 0,
  idx = 1;
  while (words.length > 0 && idx <= words.length) {
    let str = words.slice(0, idx).join(' ');
    let w = context.measureText(str).width;
    if ( w > fitWidth ) {
      if (idx == 1) {
        idx = 2;
      }
      context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
      currentLine++;
      words = words.splice(idx-1);
      idx = 1;
    }
    else {
      idx++;
    }
  }
  if (idx > 0) context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
}
