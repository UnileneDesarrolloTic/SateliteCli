import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-avance',
  templateUrl: './transferencia-pt.component.html'
})
export class TransferenciaPTComponent implements OnInit {
  
  etapaEncajado: number = 1
  listaArmadoCaja: any[] = []
  formArmadoCaja: FormGroup

  constructor(private _modalService: NgbModal, private _toatsr: ToastrService) { }

  ngOnInit(): void {
    this.inicializarLista()
  }

  abrirModalReporte(modal: NgbModal) {
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  cambiarEtapa(etapa: number){
    this.etapaEncajado = etapa
  }

  inicializarLista(){
    this.listaArmadoCaja = [{
      codigo: 18834,
      usuario: 'Eddie Christian Gomez Ochante',
      fecha: '20/07/2023',
      cantidad: 500,
      editable: 0
    }]
  }

  asignarRegistro(){
    
    if(this.listaArmadoCaja.findIndex(x => x.codigo == 0) != -1)
      return this._toatsr.warning('Debe de ingresar el registro.', 'Aviso !!', {closeButton: true, progressBar: true, timeOut: 3000})
    
    this.formArmadoCaja = new FormGroup({
      codigo: new FormControl(null, Validators.required),
      usuario: new FormControl({value: null, disabled: true}, Validators.required),
      fecha: new FormControl(formatDate(new Date, 'yyyy-MM-dd hh:mm', 'en'), Validators.required),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.listaArmadoCaja.push({
      codigo: 0,
      usuario: '',
      fecha: '',
      cantidad: 0,
      editable: 1
    })
  }

  registrarItem(){

    if(this.formArmadoCaja.invalid)
      return this._toatsr.warning('Los datos ingresados no son válidos.', 'Aviso !!', {closeButton: true, progressBar: true, timeOut: 3000})

    const item = this.formArmadoCaja.value
    item.usuario='Andy Ancajima'

    this.eliminarFormNuevoRegistro()
    this.listaArmadoCaja.push(item)

    this.formArmadoCaja = new FormGroup({})
    
  }

  eliminarItem(){
    var r = confirm("¿ Seguro de eliminar el item ?");
  }

  eliminarFormNuevoRegistro(){
    const indexForm = this.listaArmadoCaja.findIndex(x => x.codigo == 0)    
    this.listaArmadoCaja.splice(indexForm, 1)   
  }

}
