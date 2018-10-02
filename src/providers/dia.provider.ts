import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { Dia, DiaIndexFrase } from '../models/dia';
import { Usuario } from '../models/usuario';
import { FraseId } from '../models/frase';

import { todayDateToString } from '../functions/today-date-to-string';

@Injectable()
export class DiaProvider {

  private usuarioDoc: AngularFirestoreDocument<Usuario>;
  private dadosDoc: AngularFirestoreDocument<Dia>;
  public dados$: BehaviorSubject<Dia> = new BehaviorSubject(undefined);
  private hoje: string;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.hoje = todayDateToString();

    this.carregamentoInicial();
  }

  /**
   * carrega o doc do usuario assim que o usuario logar
   * @return Observable<void>
   */
  private carregamentoInicial(): Observable<void> {
    return this['subscriptor'] || (this['subscriptor'] = Observable.create(sub => {
      this.afAuth.authState.pipe(takeUntil(this['subscriptor'])).subscribe(user => {
        if (user) {
          this.usuarioDoc = this.afs.doc<Usuario>('usuarios/'+user.uid);
          sub.next();
          sub.complete();
          this['subscriptor'] = undefined;
        }
      });
    }).share());
  }

  /**
   * retorna os dados do dia atual carregado no provider
   * @param  dia data de hoje (yyyy-mm-dd)
   * @return     Observable<Dia>
   */
  public getDocDadosDia(dia:string = this.hoje): Observable<Dia> {
    if (!this.dadosDoc) this.carregarDadosDia(dia);

    return this.dados$.share();
  }

  /**
   * ataualiza dados do dia atual
   * @param  dia Dia
   * @return     Promise<void>
   */
  public async updateDocDadosDia(dia:Dia) {
    if (!this.dadosDoc) await this.carregarDadosDia(this.hoje);

    return this.dadosDoc.update(dia);
  }

  /**
   * carrega os dados do dia no provider
   * @param  dia data de hoje (yyyy-mm-dd)
   * @return     Promise<void>
   */
  public async carregarDadosDia(dia:string) {
    if (!this.usuarioDoc) {
      await this.carregamentoInicial().toPromise();
    }
    this.dadosDoc = this.usuarioDoc.collection('dados').doc(dia);

    this.dadosDoc.valueChanges().subscribe(dadosDia => this.dados$.next(dadosDia));

    this.dadosDoc.valueChanges().pipe(first()).subscribe(async existeDia => {
      if (!existeDia) {
        // cria dados do dia
        const hoje = new Dia(new Date());
        this.dadosDoc.set(hoje.toJson());

        // registra dia na lista
        this.updateDocDias(dia);
      }
    });
  }

  /**
   * carrega dados de um dia
   * @param  dia dia selecionado (yyyy-mm-dd)
   * @return     Promise<Dia>
   */
  public async getDia(dia:string) {
    if (!this.usuarioDoc) {
      await this.carregamentoInicial().toPromise();
    }
    const docDia = this.usuarioDoc.collection('dados').doc<Dia>(dia);

    return docDia.valueChanges().pipe(first()).toPromise();
  }

  /**
   * seta a frase do dia
   * @param  frase FraseId
   * @return       Promise<void>
   */
  public async setFraseDoDia(frase:FraseId) {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();
    if (!this.dadosDoc) await this.carregarDadosDia(this.hoje);

    this.dadosDoc.update({frase:frase.frase});
    this.updateDocDias(this.hoje, frase.index);
  }

  /**
   * retorna documento com lista de dias e o id da frase do dia
   * @return Promise<DiaIndexFrase>
   */
  public async getDocDias(): Promise<DiaIndexFrase> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    return this.usuarioDoc.valueChanges().pipe(
      first(),
      map(objDias => {
        return objDias && objDias['dias'] ? objDias.dias : {};
      })
    ).toPromise();
  }

  /**
   * add/update dia atual e id da frase no DocDias
   * @param  dia        dia de hoje (yyyy-mm-dd)
   * @param  indexFrase index da frase
   * @return            Promise<void>
   */
  public async updateDocDias(dia:string, indexFrase: number = null) {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    let objDias = await this.usuarioDoc.valueChanges().pipe(first()).toPromise();
    if (!objDias || typeof objDias['dias'] == 'undefined') {
      objDias = { dias: { [dia]:indexFrase } };
      this.usuarioDoc.set(objDias);
    } else {
      objDias.dias[dia] = indexFrase;
      this.usuarioDoc.update(objDias);
    }
  }

  /**
   * carrega uma lista com todos os dias registrados
   * @return Promise<string[]>
   */
  public async getListaDiasRegistrados(): Promise<string[]> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    const objDias = await this.getDocDias();
    return Object.keys(objDias);
  }

  /**
   * carrega uma lista com os index das frases ja usadas
   * @return Promise<number[]>
   */
  public async getListaIndexFrasesRegistrados(): Promise<number[]> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    const objDias = await this.getDocDias();
    return Object.keys(objDias).map(dia => objDias[dia]);
  }

}
