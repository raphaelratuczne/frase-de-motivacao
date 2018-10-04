import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map, first } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { Descricao } from '../models/descricao';

@Injectable()
export class DescricaoProvider {

  private descDoc: AngularFirestoreDocument<Descricao>;

  constructor(private afs: AngularFirestore) { }

  public async getDescricoes() {
    if (!this.descDoc)
      this.descDoc = this.afs.doc<Descricao>('descricoes/descricoes');

    return this.descDoc.snapshotChanges().pipe(
      first(),
      map(desc => desc.payload.data() as Descricao)
    ).toPromise();
  }

}
