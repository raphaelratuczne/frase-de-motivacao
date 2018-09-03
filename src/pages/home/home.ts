import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Frase, FraseId } from '../../models/frase';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private frasesCollection: AngularFirestoreCollection<Frase>;
  frases: Observable<FraseId[]>;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user', user);
        this.frasesCollection = this.afs.collection<Frase>('frases');
        this.frases = this.frasesCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            console.log(a);
            const data = a.payload.doc.data() as Frase;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );

        this.frases.subscribe(f => console.log('frases', f));
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
}
