import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistrarEditarComponent } from './registrar-editar/registrar-editar.component';

@Component({
  selector: 'app-ssoma',
  templateUrl: './ssoma.component.html',
  styleUrls: ['./ssoma.component.css']
})
export class SsomaComponent implements OnInit {

  formFormularioFiltros:FormGroup;
  ListarDocumento=[{
    'Codigo':'DSSM-001',
    'Tipo' :'Documento Interno',
    'Nombre':'Política de Seguridad y Salud en el Trabajo',
    'Aprobacion':'10/08/2022',
    'Revision':'10/08/2022',
    'Publicacion':'10/08/2022',
    'Estado':'Vigente',
  }];
  constructor(
    private _modalService: NgbModal,
    private _toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
   
    this.crearFormulario();
  }

  crearFormulario(){
    this.formFormularioFiltros = new FormGroup({
      TipoDocumento: new FormControl(''),
      Codigo: new FormControl(''),
    })
  }

  filtrarLote(){

  }


  OpenModal(intefaz,data){
    const modalRefDetalleReceta = this._modalService.open(RegistrarEditarComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
      keyboard: false
    });

    modalRefDetalleReceta.componentInstance.Interfaz = intefaz;
    modalRefDetalleReceta.componentInstance.data = data;
    modalRefDetalleReceta.result.then((result) => {

    }, (reason) => {

    });
  }

}
