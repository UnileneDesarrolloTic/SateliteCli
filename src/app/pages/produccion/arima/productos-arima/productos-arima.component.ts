import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoEnTransito } from '@data/interface/Response/PedidoEnTransito.interface';
import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { PronosticoService } from '@data/services/backEnd/pages/pronostico.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-productos-arima',
  templateUrl: './productos-arima.component.html',
  styles: [
  ]
})
export class ProductosArimaComponent implements OnInit {

  private  _periodoActual =  new Date().toISOString().substring(0,7)
  dataCompleta: SeguimientoCandidato[]
  listaCandidatos: SeguimientoCandidato[]
  pedidosItemTransito : PedidoEnTransito[]
  formularioFiltro: FormGroup
  flagLoading: boolean = false
  estadoCheck: boolean = true

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado candidatos para estos filtro',
    'totalMessage': 'Candidatos'
  }

  constructor(private _pronosticoService: PronosticoService, private _modalService: NgbModal, private _fb: FormBuilder) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.ObtenerListaCandidatos();
  }

  crearFormulario(){
    this.formularioFiltro =  this._fb.group({
      periodo: ['', Validators.required],
      primerFiltro: [{value: false, disable: true}],
      segundoFiltro: [{value: false, disable: true}],
      tercerFiltro: [{value: false, disable: false}],
      regla: [''],
      agrupador: [''],
      textFilter: ['']
    })

    this.formularioFiltro.reset({
      periodo: this._periodoActual,
      primerFiltro: false,
      segundoFiltro: false,
      tercerFiltro: false,
      regla: 'R1',
      agrupador: '',
      textFilter: ''
    })

  }


  ObtenerListaCandidatos (){

    if(this.formularioFiltro.valid)
    {
      this.flagLoading = true
      this.messagerNgxTable.emptyMessage = "No se ha encontrado candidatos seleccione otro periodo"

      console.log(this.formularioFiltro.get('periodo').value)
      console.log(this._periodoActual)
      if (this.formularioFiltro.get('periodo').value != this._periodoActual){
        this.desactivarCheckbox(0)
        this.estadoCheck = false
        console.log(this.estadoCheck)
      }

      let body = {
        'periodo': this.formularioFiltro.get('periodo').value.replace('-', '')
      }

      this.listaCandidatos = []

      this._pronosticoService.ListSeguimientoCandidatos(body).subscribe(
        resp => {
          this.dataCompleta = resp
          this.filtrarFormulario(0)
          this.flagLoading = false
        },
        catchError => {
          this.flagLoading = false
          this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener los candidatos"
        }
      )
    }
  }

  desactivarCheckbox(filtro: number){

    if (filtro == 0){
      this.formularioFiltro.patchValue({
        primerFiltro: false,
        segundoFiltro: false,
        tercerFiltro: false
      })
      return
    }
    if (filtro == 1){
      this.formularioFiltro.patchValue({
        periodo: this._periodoActual,
        segundoFiltro: false,
        tercerFiltro: false
      })
      return
    }

    if (filtro == 2){
      this.formularioFiltro.patchValue({
        periodo: this._periodoActual,
        primerFiltro: false,
        tercerFiltro: false
      })
      return
    }

    if(filtro == 3){
      this.formularioFiltro.patchValue({
        periodo: this._periodoActual,
        primerFiltro: false,
        segundoFiltro: false,
      })
    }
  }

  filtrarFormulario(filtro: number) {

    this.flagLoading = true
    this.listaCandidatos = []


    if (filtro < 9)
      this.desactivarCheckbox(filtro)

    if (this.formularioFiltro.get('regla').value != '')
      this.listaCandidatos = this.dataCompleta.filter(x => x.regla.slice(-2) == this.formularioFiltro.get('regla').value)
    else
      this.listaCandidatos = this.dataCompleta

    if (this.formularioFiltro.get('agrupador').value != ''){

      let cantidadCaracteres = 7

      switch (this.formularioFiltro.get('agrupador').value){
        case 'SU':  cantidadCaracteres = 4
          break;
        case 'XTER':  cantidadCaracteres = 6
          break;
      }

      this.listaCandidatos = this.listaCandidatos.filter(x => x.regla.substring(2, cantidadCaracteres) == this.formularioFiltro.get('agrupador').value)
    }

    if(this.formularioFiltro.get('primerFiltro').value == true)
      this.listaCandidatos = this.listaCandidatos.filter(x => x.alerta > 0 )
    else
      if (this.formularioFiltro.get('segundoFiltro').value == true)
        this.listaCandidatos = this.listaCandidatos.filter(x => x.alerta <= 0 )
      else
        if (this.formularioFiltro.get('tercerFiltro').value == true)
          this.listaCandidatos = this.listaCandidatos.filter(x => x.diferenciaMax > 10 )

    if (this.formularioFiltro.get('textFilter').value != ''){
      let valor = this.formularioFiltro.get('textFilter').value.toLowerCase()

      this.listaCandidatos = this.listaCandidatos.filter(
        x => x.codSut?.toLowerCase().indexOf(valor) !== -1
          || x.item?.toLowerCase().indexOf(valor) !== -1
          || x.descripcion?.toLowerCase().indexOf(valor) !== -1
      );
    }

    this.flagLoading = false
  }

  abrirModalTransito(modal: NgbModal, detalle){
    this.pedidosItemTransito = []
    this.pedidosItemTransito = detalle

    console.log(detalle)
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

}
