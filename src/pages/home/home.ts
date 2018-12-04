import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController, IonicPage/*, ActionSheetController*/ } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/Operators';
import 'rxjs/add/observable/of';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DiaProvider } from '../../providers/dia.provider';
import { FraseProvider } from '../../providers/frase.provider';
import { LocalNotificationProvider } from '../../providers/local-notification.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public dia:Dia;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private diaProvider: DiaProvider,
    private fraseProvider: FraseProvider,
    private alertCtrl: AlertController,
    // public actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private localNotificationProvider: LocalNotificationProvider
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
    this.navCtrl.setRoot('RoteiroPage');
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
		if (!(<any>window).cordova) {
			this.afAuth.auth.signInWithPopup(provider)
		} else {
			this.afAuth.auth.signInWithRedirect(provider);
		}
	}

  public setFraseDoDia(excluidos:number[]) {
    this.fraseProvider.getFrase(excluidos).pipe(first()).subscribe(frase => {
      this.diaProvider.setFraseDoDia(frase);
    });
  }

  public async abrirModalCalendario() {
    const dias = await this.diaProvider.getListaDiasRegistrados();
    this.modalCtrl.create('ModalCalendarioPage', {dias:dias}).present();
    // let modalCalendario = this.modalCtrl.create('ModalCalendarioPage', {dias:dias});
    // modalCalendario.onDidDismiss(data => {
    //   console.log(data);
    //  });
    // modalCalendario.present();
  }

  public abrirMenu(myEvent) {
    if (this.dia) {
      const popover = this.popoverCtrl.create('MenuPage');
      popover.present({
        ev: myEvent
      });
      popover.onDidDismiss(op => {
        if (op && op == 'sair') {
          const confirm = this.alertCtrl.create({
            title: 'Deslogar?',
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
          confirm.present();
        }
      });
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
      this.socialSharing.share(null, 'Minha Terapia', canvas.toDataURL());
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
