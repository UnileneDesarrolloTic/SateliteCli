import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListarCotizacionExportacionModel } from '@data/interface/Response/DatosListarCotizacionExportacion.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ExportacionesService } from '@data/services/backEnd/pages/exportaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-cotizacion',
  templateUrl: './listar-cotizacion.component.html',
  styleUrls: ['./listar-cotizacion.component.css']
})
export class ListarCotizacionComponent implements OnInit {

  formFiltros:FormGroup;
  listarcliente:object[]=[];
  listarCotizacionExportacion:ListarCotizacionExportacionModel[]=[];
  private fechaActual: Date = new Date(Date.now());
  private primerDiaMes: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);

  constructor(private _toastrService: ToastrService, 
              private _modalService: NgbModal,
              private _comercialService: ComercialService,
              private _ExportacionesService:ExportacionesService,
              private _router: Router) { }

  ngOnInit(): void {
    this.CrearFormularioFiltro();
    this.listarCliente();
  }

  CrearFormularioFiltro(){
    this.formFiltros = new FormGroup({
        Cliente: new FormControl(0, Validators.required),
        clienteNombre: new FormControl({value:'', disabled: true}, Validators.required),
        NumeroDocumento : new FormControl(''),
        Estado : new FormControl('TD'),
        FechaInicio: new FormControl(formatDate(this.primerDiaMes, 'yyyy-MM-dd', 'en'), Validators.required),
        FechaFin: new FormControl(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en'),  Validators.required),
      });
  }

  filtrar(){
      // console.log(this.formFiltros.value);
      this._ExportacionesService.ListarCotizacionExportaciones(this.formFiltros.value).subscribe(
        (resp:any)=>{
            this.listarCotizacionExportacion=resp;
        }
      )
  }

  listarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe(
      (resp) => resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[]
    );
  }

  openModalConsultaClientes(){
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });

    this.formFiltros.patchValue({           
      Cliente: 0,
      clienteNombre: ''
    })
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => {        
        if(result!=undefined){
          this.formFiltros.patchValue({           
            Cliente: parseInt(result.persona),
            clienteNombre: result.nombreCompleto
          })
        }
		});
     
  }
  Editar(row:ListarCotizacionExportacionModel){
    if (row.estado=='PR')
        this._router.navigate(['Exportaciones', 'Cotizacion',row.numeroDocumento]);
    else
        this._toastrService.warning(`La cotización ${row.numeroDocumento} puede ser editada, ya que esta en estado: ${row.descripcionEstado}`)
  }

  Crear(Nuevo){
    this._router.navigate(['Exportaciones', 'Cotizacion',Nuevo]);
  }
  
}
