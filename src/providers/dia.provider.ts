import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first } from 'rxjs/operators';

import { Dia } from '../models/dia';

@Injectable()
export class DiaProvider {

  private diaDoc: AngularFirestoreDocument<Dia>;
  private _dia$: Observable<Dia>;
  public dia$: BehaviorSubject<Dia> = new BehaviorSubject(undefined);
  private hoje: string;
  // private user;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    const data = new Date();
    this.hoje = data.getFullYear() + '-' + ('0' + (data.getMonth() + 1)).substr(-2) + '-' + ('0' + data.getDate()).substr(-2);
  }

  public getDia(): Observable<Dia> {
    if (this.dia$) {
      return this.dia$.share();
    }
    else {
      this.dia$ = Observable.create(sub =>{
        this.afAuth.authState.subscribe(user => {
          if (user) {
            // this.user = user;
            // console.log('user', user);
            this.diaDoc = this.afs.doc<Dia>(user.uid+'/'+this.hoje);
            this._dia$ = this.diaDoc.valueChanges();

            this._dia$.subscribe(d => sub.next(d));
            // this.diaDoc.update(diaTeste);
            this.diaDoc.valueChanges().pipe(first()).subscribe(dia => {
              console.log('inicio dia', dia);
              if (!dia) {
                const hj = new Dia(new Date());
                this.diaDoc.set(hj.toJson());
              }
            });
          }
        });
      });
      return this.dia$.share();
    }
  }

}
