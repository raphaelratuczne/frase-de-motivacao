import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { Frase, FraseId } from '../../models/frase';
import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private frasesCollection: AngularFirestoreCollection<Frase>;
  public frases: Observable<FraseId[]>;
  private diaDoc: AngularFirestoreDocument<Dia>;
  public dia: Observable<Dia>;
  public frase = '';
  private user;

  private hoje: string;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private modalCtrl: ModalController) {

    const data = new Date();
    this.hoje = data.getFullYear() + '-' + ('0' + (data.getMonth() + 1)).substr(-2) + '-' + ('0' + data.getDate()).substr(-2);
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        console.log('user', user);
        this.getFrase();
        this.frasesCollection = this.afs.collection<Frase>('frases');
        this.frases = this.frasesCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            // console.log(a);
            const data = a.payload.doc.data() as Frase;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );

        this.frases.subscribe(f => console.log('frases', f));

        this.diaDoc = this.afs.doc<Dia>(user.uid+'/'+this.hoje);
        this.dia = this.diaDoc.valueChanges();

        this.dia.subscribe(d => console.log('dia', d));
        // this.diaDoc.update(diaTeste);
        this.diaDoc.valueChanges().pipe(first()).subscribe(d => {
          console.log('inicio dia', d);
          if (!d) {
            const hj = new Dia(new Date());
            this.diaDoc.set(hj.toJson());
          }
        });
      }
    });
  }

  comecar() {
    this.navCtrl.setRoot('RoteiroPage');
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  public getFrase() {
    if (this.user) {
      this.afs.collection<Frase>('frases', ref => ref.orderBy('index', 'desc').limit(1))
        .snapshotChanges()
        .pipe(first())
        .subscribe(act => act.map(a => {
          const data = a.payload.doc.data() as Frase;
          const aleatorio = Math.floor(Math.random() * data.index);
          console.log('aleatorio',aleatorio);
          this.afs.collection<Frase>('frases', ref => ref.where('index', '==', aleatorio))
          .snapshotChanges()
          .pipe(first())
          .subscribe(act => act.map(a => {
            const data = a.payload.doc.data() as Frase;
            const id = a.payload.doc.id;
            const obj = {id, ...data};
            console.log('frase selecionada', obj);
            this.frase = obj.frase;
          }));
        }));


    }
  }

  public abrirModalCalendario(): void {
    let modalCalendario = this.modalCtrl.create('ModalCalendarioPage', {dados:'teste'});
    modalCalendario.onDidDismiss(data => {
      console.log(data);
     });
    modalCalendario.present();
  }
}
