import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'paginador-nav',
  templateUrl: './paginador.component.html',
  styles: [
  ]
})
export class PaginadorComponent implements OnInit {

  paginador: any ={
    number: 1,
    totalPages: 50,
    last: false,
    first: true,
  };

  paginas: number[];

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }

  private initPaginator(): void {
    let desde: number = Math.min( Math.max(0, this.paginador.number - 3 ), this.paginador.totalPages - 5);
    let hasta: number = Math.max( Math.min(this.paginador.totalPages - 1, this.paginador.number + 3 ), 6);

    if(this.paginador.totalPages > 5)
      this.paginas = new Array(hasta - desde + 1).fill(0).map((_valor, indice) => indice + desde);
    else
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice );

    console.log('Desde -> ' + desde)
    console.log('Hasta -> ' + hasta)
    console.log('Paginas -> ' + this.paginas)
  }

  cambiarPagina(pagina: number){
    this.paginador.number = pagina
    console.log('Página ->' + this.paginador.number)
  }
}
