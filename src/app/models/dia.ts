export class Dia {
  dia: Date = null;
  frase: string = '';
  grato1: string = '';
  grato2: string = '';
  grato3: string = '';
  paixao1: string = '';
  paixao2: string = '';
  paixao3: string = '';
  plano1: string = '';
  plano2: string = '';
  plano3: string = '';
  objetivo: string = '';
  orgulho: string = '';
  palavra: string = '';

  constructor(dia:Date) {
    this.dia = dia;
  }

  toJson(): Dia {
    return JSON.parse(JSON.stringify(this));
  }
}

export class DiaIndexFrase {
  [dia:string] : number;
}
