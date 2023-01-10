import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { debounceTime } from 'rxjs/operators';
import { ModalOrdenCompraComponent } from './modal-orden-compra/modal-orden-compra.component';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {

  @Input() idProceso:number;
  Cliente: string = '';
  idCliente: number = 0;
  listarcliente:object[]=[];
  ListarProcesoOriginal:DatosListarProceso[]=[];
  ListarProcesoAux:DatosListarProceso[]=[];
  nombreProceso:string;

  flagLoading: boolean = false
  textFilterCtrl = new FormControl('');
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado procesos',
    'totalMessage': 'Procesos'
  }
  constructor(private _router: Router, private _modalService: NgbModal, private _comercialService:ComercialService,private _licitacionesServices:LicitacionesService) 
  { 
  }

  ngOnInit(): void 
  {
    this.ObtenerProcesos()
    this.ListarCliente();
    
    this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( _ => {
      this.filtroClienteySeleccion();
    })
  }

  filtroClienteySeleccion()
  {
    this.flagLoading = true

    this.ListarProcesoAux = this.ListarProcesoOriginal;

    console.log("filtroClienteySeleccion", this.idCliente);
    
    if(this.idCliente && this.idCliente != 0)
      this.ListarProcesoAux = this.ListarProcesoAux.filter(x => x.cliente == this.idCliente)
    

    if(this.textFilterCtrl.value != '')
    {
      const texto = this.textFilterCtrl.value.toLowerCase();

      this.ListarProcesoAux = this.ListarProcesoAux.filter( x => 
            (x.descripcionProceso != null && x.descripcionProceso?.toLowerCase().indexOf(texto) !== -1)
          || (x.descripcionComercial != null && x.descripcionComercial?.toLowerCase().indexOf(texto) !== -1)
          || (x.descripcionComercialDetalle != null &&x.descripcionComercialDetalle?.toLowerCase().indexOf(texto) !== -1)
      );
    }
    this.flagLoading = false
  }

  NuevoProceso()
  {
    this._router.navigate(['Licitaciones','proceso','nuevo-proceso']);
  }

  DetalleProceso()
  {
    this._router.navigate(['Licitaciones','proceso','programacion-proceso']);
  }

  AbrirModuloMuestrayEnsayo(proceso: any)
  {
    this.nombreProceso=proceso.descripcionProceso;
    this._router.navigate(['Licitaciones', 'proceso', 'muestra-ensayo-proceso', proceso.idProceso]);
  }

  AbrirModuloContrato(idproceso: number)
  {  
    this._router.navigate(['Licitaciones', 'proceso', 'contrato', idproceso]);
  }


  AbrirModuloGuias(idproceso:number)
  {
    this._router.navigate(['Licitaciones', 'proceso', 'estado-guia', ':idproceso'],{ state: { idproceso: idproceso } });
  }
  
  AbrirOrdenCompra(proceso:DatosListarProceso)
  {
    const modalRef = this._modalService.open(ModalOrdenCompraComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size:'20%'
    });

    modalRef.componentInstance.fromParent = proceso;
  }

  ListarCliente()
  {
    const body = {};
    this._comercialService.ListarClientes(body).subscribe((resp) => {
      resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[];
    });
  }


  openModalConsultaClientes()
  {
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;

		modalBusquedaCliente.result.then((result) => {
      
      
        if(result!=undefined)
        {
            this.idCliente = +result.persona ?? 0;
            this.Cliente = result.nombreCompleto;
            console.log(result, this.idCliente);
            this.filtroClienteySeleccion()
        }
		});
  }

  ObtenerProcesos()
  {
    this.flagLoading = true

    this._licitacionesServices.ListarProceso(this.idCliente).subscribe(
      resp => {
        this.ListarProcesoOriginal = resp
        this.ListarProcesoAux = resp
        this.flagLoading = false
      }, 
      _ => this.flagLoading = false
    );
  }

  Reset(){
    this.idCliente=0;
    this.Cliente='';
    this.filtroClienteySeleccion();
  }

}
