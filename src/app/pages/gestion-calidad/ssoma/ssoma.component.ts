import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstadoSsoma } from '@data/interface/Response/DatosFormatosEstadosSoma.interfaces';
import { TipoDocumentoSsoma } from '@data/interface/Response/DatosFormatosTipoDocumentosSoma.interfaces';
import { SsomaDTO } from '@data/interface/Response/GestionCalidad.interface';
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
  tipoDocumentoSsoma:TipoDocumentoSsoma[] = [];
  tipoDocumentoSsomaAux:TipoDocumentoSsoma[] = [];
  listaSsoma: SsomaDTO[] = [];
  estadoSsoma: EstadoSsoma[] = [];
  flagBusqueda: boolean = false;

  flagLoading: boolean = false;
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado registros',
    'totalMessage': 'registros'
  }

  constructor(
    private _modalService: NgbModal,
    private _toastrService: ToastrService,
    private  _GestionCalidadService: GestionCalidadService,
    private _GenericoService: GenericoService
  ) { }

  ngOnInit(): void 
  {
    this.crearFormulario();
    this.tipoDocumento();
    this.listarEstadoSsoma();
  }

  crearFormulario(){
    this.formFormularioFiltros = new FormGroup({
      tipoDocumento: new FormControl(0),
      codigo: new FormControl(''),
      estado: new FormControl(0)
    })
  }

  
  filtrarLote()
  {
    const tipoDocumento = this.formFormularioFiltros.controls.tipoDocumento.value;
    const codigo = this.formFormularioFiltros.controls.codigo.value;
    const estado = this.formFormularioFiltros.controls.estado.value;
    this.flagBusqueda = true;
    this._GestionCalidadService.ListarSsoma(tipoDocumento, codigo, estado).subscribe(
      (resp: SsomaDTO[]) => this.listaSsoma = resp
    )
  }

  tipoDocumento(){
    this._GenericoService.ListarTipoDocumentoSsoma().subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.tipoDocumentoSsoma=resp["content"];
          }
      }
    )
  }

  listarEstadoSsoma(){
    this._GenericoService.ListarEstadoSsoma().subscribe(
      (resp: SsomaDTO[])=>{
        if(resp["success"]){
            this.estadoSsoma=resp["content"];
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


  EliminarSsoma(row:SsomaDTO,index){
    this._GestionCalidadService.EliminarSsoma(row.idSsoma).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.listaSsoma.splice(index,1);
          this._toastrService.success(resp["content"]);
        }
      }
    )
  }

}
