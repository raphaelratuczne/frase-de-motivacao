import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { Palavra } from '../models/palavra';

@Injectable()
export class PalavraProvider {

  constructor(private afs: AngularFirestore) { }

  getPalavras(): Observable<Palavra[]> {
    const palavrasCollection: AngularFirestoreCollection<Palavra> = this.afs.collection<Palavra>('palavras');

    return palavrasCollection.snapshotChanges().pipe(
      first(),
      map(actions => actions.map(a => {
        return a.payload.doc.data() as Palavra;
      }))
    );
  }

}
