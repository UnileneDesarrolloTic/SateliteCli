import { PronosticoService } from '@data/services/backEnd/pages/pronostico.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace'
import { PedidoEnTransito } from '@data/interface/Response/PedidoEnTransito.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-seguimiento-candidatos-pro',
  templateUrl: './seguimiento-candidatos-pro.component.html'
})
export class SeguimientoCandidatosProComponent implements OnInit {

  private  _periodoActual =  new Date().toISOString().substring(0,7)
  dataCompleta: SeguimientoCandidato[]
  listaCandidatos: SeguimientoCandidato[]
  pedidosItemTransito : PedidoEnTransito[]
  formularioFiltro: FormGroup
  flagLoading: boolean = false

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado candidatos para estos filtro',
    'totalMessage': 'Candidatos'
  }

  constructor(private _pronosticoService: PronosticoService, private _modalService: NgbModal, private _fb: FormBuilder) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.ObtenerListaCandidatos(0);
  }

  crearFormulario(){
    this.formularioFiltro =  this._fb.group({
      periodo: ['', Validators.required],
      primerFiltro: [false],
      segundoFiltro: [false],
      tercerFiltro: [false],
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

  ObtenerListaCandidatos (filtro: number){

    if(this.formularioFiltro.valid)
    {
      this.messagerNgxTable.emptyMessage = "No se ha encontrado candidatos para estos filtro"
      this.flagLoading = true

      this.desactivarCheckbox(filtro)

      const body = {
        'periodo': this.formularioFiltro.get('periodo').value.replace('-', ''),
        'primerFiltro': this.formularioFiltro.get('primerFiltro').value,
        'segundoFiltro': this.formularioFiltro.get('segundoFiltro').value,
        'tercerFiltro': this.formularioFiltro.get('tercerFiltro').value
      }

      this.listaCandidatos = []

      if(body['primerFiltro'] == true || body['segundoFiltro'] == true || body['tercerFiltro'] == true)
        body.periodo = this._periodoActual

      this._pronosticoService.ListSeguimientoCandidatos(body).subscribe(
        resp => {
          this.dataCompleta = resp
          this.filtrarFormulario()
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

  abrirModalTransito(modal: NgbModal, detalle){
    this.pedidosItemTransito = []
    this.pedidosItemTransito = detalle
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  filtrarFormulario() {
    this.flagLoading = true
    this.listaCandidatos = []

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

    if (this.formularioFiltro.get('textFilter').value != ''){
      let valor =  this.formularioFiltro.get('textFilter').value.toLowerCase()

      this.listaCandidatos = this.listaCandidatos.filter(
        x => x.codSut?.toLowerCase().indexOf(valor) !== -1
          || x.item?.toLowerCase().indexOf(valor) !== -1
          || x.descripcion?.toLowerCase().indexOf(valor) !== -1
      );
    }

    this.flagLoading = false
  }

}
