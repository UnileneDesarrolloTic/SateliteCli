import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { ReclamosQuejas, ReclamosQuejasPaginado } from '@data/interface/Response/GestionCalidad.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  formFilter: FormGroup;
  registrosPagina: number = 20
  private fechaActual: Date = new Date(Date.now());
  private primerDiaMes: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
  listarcliente:object[]=[];
  nombreCliente:string = ''
  pagina: number = 1
  listaReclamosQuejas: ReclamosQuejas[]
  paginacion: Paginado  = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  };
  
  constructor(private _toastr: ToastrService, private _gestionCalidaService: GestionCalidadService,
    private _comercialService: ComercialService, private _modalService: NgbModal, private _router: Router) 
  { 
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.obtenerReclamosFiltrados();
    this.listarCliente();
  }

  inicializarFormulario()
  {
    this.formFilter = new FormGroup({
      fechaInicio: new FormControl(formatDate(this.primerDiaMes, 'yyyy-MM-dd', 'en'), Validators.required),
      fechaFin: new FormControl(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en'),  Validators.required),
      cliente: new FormControl(0),
      codReclamo: new FormControl(''),
      territorio: new FormControl(''),
      nombreCliente: new FormControl({value:'', disabled: true})
    })
  }

  obtenerReclamosFiltrados()
  {
    if(this.formFilter.invalid)
    {
      this.formFilter.markAllAsTouched()
      this._toastr.warning('Los filtros seleccionados no son válidos.','Advertencia !!', {progressBar: true, timeOut: 3000, closeButton: true})
      return
    }

    const inicio = this.formFilter.get('fechaInicio').value
    const fin = this.formFilter.get('fechaFin').value

    if(inicio > fin)
    {
      this._toastr.warning('La fecha inicio no puede ser mayor a la fecha fin','Advertencia !!', {progressBar: true, timeOut: 3000, closeButton: true})
      return
    }

    this.listaReclamosQuejas = []
    this.paginacion = {
      paginaActual: 1,
      totalPaginas: 1,
      registroPorPagina: 10,
      totalRegistros: 1,
      siguiente:true,
      anterior: false,
      primeraPagina: true,
      ultimaPagina: false
    };

    const body = {
      ...this.formFilter.value,
      registrosPorPagina: +this.registrosPagina,
      pagina: +this.pagina
    }

    this._gestionCalidaService.listaReclamosQuejas(body).subscribe(
      (resp: ReclamosQuejasPaginado) => 
      {
        this.paginacion = resp.paginado
        this.listaReclamosQuejas = resp.contenido
      }
    )
  }

  cambioRegistrosPorPagina()
  {
    this.obtenerReclamosFiltrados()
  }

  cambioPagina(event: number)
  {
    this.obtenerReclamosFiltrados()
  }

  listarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe(
      (resp) => {
        resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[]       
      }
    );
  }

  redireccionarDetalleReclamo(codReclamo : string)
  {

    if (codReclamo == undefined || codReclamo == '' || codReclamo == null)
    {
      this._toastr.error('El código del reclamo no es válido.','Error !!', {progressBar: true, timeOut: 3000, closeButton: true})
      return
    }

    this._router.navigate(['GestionCalidad/ReclamosQuejas/Detalle/', codReclamo]);
  }

  openModalConsultaClientes()
  {
    this.formFilter.patchValue({
      cliente: 0,
      nombreCliente: ''
    })

    this.nombreCliente = ''

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
        if(result!=undefined){
          this.formFilter.patchValue({
            cliente: Number.parseInt(result.persona),
            nombreCliente: result.nombreCompleto
          })
        }
		});     
  }

}
