import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListarSsomaModel } from '@data/interface/Response/DatosFormatoListarSsoma.interface';
import { TipoDocumentoSsoma } from '@data/interface/Response/DatosFormatosTipoDocumentosSoma.interfaces';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { RegistrarEditarComponent } from './registrar-editar/registrar-editar.component';

@Component({
  selector: 'app-ssoma',
  templateUrl: './ssoma.component.html',
  styleUrls: ['./ssoma.component.css']
})
export class SsomaComponent implements OnInit {

  formFormularioFiltros:FormGroup;
  TipoDocumentoSsoma:TipoDocumentoSsoma[]=[];
  listarSsoma: ListarSsomaModel []=[]
  
  constructor(
    private _modalService: NgbModal,
    private _toastrService: ToastrService,
    private  _GestionCalidadService:GestionCalidadService,
    private _GenericoService: GenericoService
  ) { }

  ngOnInit(): void {
   
    this.crearFormulario();
    this.TipoDocumento();
  }

  crearFormulario(){
    this.formFormularioFiltros = new FormGroup({
      tipoDocumento: new FormControl(0),
      Codigo: new FormControl(''),
    })
  }

  filtrarLote(){
    this._GestionCalidadService.ListarSsoma(this.formFormularioFiltros.controls.tipoDocumento.value,this.formFormularioFiltros.controls.Codigo.value).subscribe(
      (resp:any)=>{
          this.listarSsoma=resp;
      }
    )
  }

  TipoDocumento(){
    this._GenericoService.ListarTipoDocumentoSsoma().subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.TipoDocumentoSsoma=resp["content"];
          }
      }
    )
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
        this.filtrarLote();
    }, (reason) => {

    });
  }


  EliminarSsoma(row:ListarSsomaModel,index){
    this._GestionCalidadService.EliminarSsoma(row.idSsoma).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.listarSsoma.splice(index,1);
          this._toastrService.success(resp["content"]);
        }
      }
    )
  }

}
