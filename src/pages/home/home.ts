import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController, IonicPage, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/Operators';
import 'rxjs/add/observable/of';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DiaProvider } from '../../providers/dia.provider';
import { FraseProvider } from '../../providers/frase.provider';

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
    private socialSharing: SocialSharing,
    public actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    const d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(d$)).subscribe(async dia => {
      if (dia) {
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

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Compartilhar sua frase do dia',
      buttons: [
        {
          text: 'Facebook',
          // role: 'destructive',
          handler: () => {
            console.log('facebook');
          }
        },{
          text: 'Messenger',
          handler: () => {
            console.log('messenger');
          }
        },{
          text: 'Twitter',
          handler: () => {
            console.log('twitter');
          }
        },{
          text: 'Instagram',
          handler: () => {
            console.log('instagram');
          }
        },{
          text: 'Watsapp',
          handler: () => {
            console.log('watsapp');
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelou');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
