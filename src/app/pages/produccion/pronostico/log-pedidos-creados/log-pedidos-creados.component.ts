import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { PronosticoService } from '@data/services/backEnd/pages/pronostico.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-log-pedidos-creados',
  templateUrl: './log-pedidos-creados.component.html'
})
export class LogPedidosCreadosComponent implements OnInit {

  private notifier: NotifierService
  formularioFiltro: FormGroup

  hoy = new Date()
  ayer = new Date(this.hoy.getTime() - 86400000).toISOString().slice(0, 10)
  listaPedidos: [] = []
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado pedidos creados para este filtro',
    'totalMessage': 'Pedidos'
  }

  paginado: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 5,
    totalRegistros: 1,
    siguiente:false,
    anterior: false,
    primeraPagina: false,
    ultimaPagina: false
  };

  reinicio = 0

  pagina: number = 0

  constructor(private _pronosticoService: PronosticoService, notifier: NotifierService, private _fb: FormBuilder) {
    this.notifier = notifier
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.filtrarPedido()
  }

  crearFormulario(){
    this.formularioFiltro = this._fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      item: [''],
      registroPorPagina: ['', [Validators.required]]
    })

    this.formularioFiltro.reset({
      fechaInicio: this.ayer,
      fechaFin : this.hoy.toISOString().slice(0, 10),
      registroPorPagina: 10
    })
  }

  getObtenerLimit () {
    return this.formularioFiltro.get('registroPorPagina').value * 1
  }

  listarPedidos (){

    const body = {
      fechaInicio: this.formularioFiltro.get('fechaInicio').value,
      fechaFin: this.formularioFiltro.get('fechaFin').value,
      item: this.formularioFiltro.get('item').value,
      Pagina: this.pagina + 1,
      registrosPorPagina: this.formularioFiltro.get('registroPorPagina').value * 1
    }

    this._pronosticoService.ListaPedidosCreadosAutomaticoLog(body).subscribe(resp => {
      this.listaPedidos = resp['contenido']
      this.paginado = resp['paginado']

      if(this.listaPedidos.length < 1)
        this.notifier.notify( 'info', 'No se han encontrado pedidos' )

    })
  }

  filtrarPedido(){

    this.notifier.hideAll()

    let inicio = this.formularioFiltro.get('fechaInicio').value == null ? '' : this.formularioFiltro.get('fechaInicio').value
    let fin = this.formularioFiltro.get('fechaFin').value == null ? '' : this.formularioFiltro.get('fechaFin').value
    let itemSpring = this.formularioFiltro.get('item').value == null ? '' : this.formularioFiltro.get('item').value

    if(inicio == "" && fin == "" && itemSpring == "")
      this.notifier.notify( 'warning', 'Ingrese algun filtro' )
    else if( itemSpring == "" && (inicio == "" || fin == "")){
      this.notifier.notify( 'warning', 'Ingrese un rango de fechas' )
    } else if (itemSpring != "" && (inicio == "" || fin == "")) {
      this.notifier.notify( 'warning', 'El rango de fech xas esta incompleta' )
    } else {
      this.listarPedidos()
    }
  }

  cambioRegistroPorPagina (event){

    this.formularioFiltro.reset({
      fechaInicio:  this.formularioFiltro.get('fechaInicio').value,
      fechaFin :  this.formularioFiltro.get('fechaFin').value,
      item: this.formularioFiltro.get('item').value,
      registroPorPagina: event * 1
    })

    this.filtrarPedido();
  }

  dataTableOnChange(event: any){
    this.pagina = event.offset
    this.filtrarPedido()
  }

}
