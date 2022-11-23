import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { RegistrarReclamoResp } from '@data/interface/Response/Common.interface';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { DatePipe } from '@angular/common';
import { DatosReclamo, DetalleReclamo } from '@data/interface/Response/GestionCalidad.interface';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  subscriptionRuta: Subscription;
  codReclamo:string = "";
  listaCliente:object[] = [];
  formFiltroLote: FormGroup;
  formDatosGenerales: FormGroup;
  listaDetalleReclamo: DetalleReclamo[] = [];
  flagDetalleReclamo: boolean = true;
  estadoReclamo:string = 'P';
  
  
  constructor(private _activateRoute: ActivatedRoute, private _modalService: NgbModal, 
    private _comercialService: ComercialService, private _toastr: ToastrService, 
    private _genericoService: GenericoService, private _gestionCalidaService: GestionCalidadService, 
    private datePipe: DatePipe, private _router: Router)
  {
    this.inicializarFormularios();
    this.subscriptionRuta = this._activateRoute.params.subscribe(param => this.codReclamo = param['codReclamo']);
  }
  
  ngOnInit(): void 
  {
    this.listarCliente();
  }

  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe();
  }

  inicializarFormularios()
  {
    this.formFiltroLote = new FormGroup({
      codCliente: new FormControl('', Validators.required),
      lote: new FormControl('', Validators.required),
      nombreCliente: new FormControl({value: '', disabled: true}, Validators.required)
    });

    this.formDatosGenerales = new FormGroup({
      codigoReclamo: new FormControl({value: '', disabled: true}),
      fechaReclamo: new FormControl({value: '', disabled: true}),
      codigoCliente: new FormControl({value: '', disabled: true}),
      documentoCliente: new FormControl({value: '', disabled: true}),
      razonSocialCliente: new FormControl({value: '', disabled: true}),
      territorioCliente: new FormControl({value: '', disabled: true}),
      paisCliente: new FormControl({value: '', disabled: true})
    });
  }

  listarCliente()
  {
    if(this.codReclamo == '0')
      this._comercialService.ListarClientes({}).subscribe(
        (resp) => resp["success"]==true ? this.listaCliente = resp["content"] : this.listaCliente = []
      );
    else
    {
      this.obtenerDatosDetalle(this.codReclamo);
      this.formDatosGenerales.patchValue({
        codigoReclamo : this.codReclamo
      })
    }
  }

  get codigoReclamo()
  {
    return this.formDatosGenerales.get('codigoReclamo').value ?? ''
  }

  filtrarLotes()
  {
    if(this.formFiltroLote.invalid)
    {
      this.formFiltroLote.markAllAsTouched();
      this._toastr.warning('Filtros de lote no válidos.','Advertencia !!', {closeButton: true, progressBar: true, timeOut: 3000});
      return;
    }
  }

  abrirModalFiltroCliente()
  {
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });

    this.formDatosGenerales.patchValue(
      {
        codigoCliente: '',
        razonSocialCliente: '',
        documentoCliente: '',
        territorioCliente: '',
        paisCliente: ''
      }
    );

    const data =
    {
        listarclientes: this.listaCliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => 
    {      
        if( result != undefined )
        {          
          this.obtenerDatosCliente(result.persona as number)
          this.registrarReclamo(result.persona as number)

          this.formDatosGenerales.patchValue
          (
            {
              razonSocialCliente: result.nombreCompleto,
              codigoCliente: result.persona
            }
          );
        }
		});
  }

  registrarReclamo(codigoCliente: number)
  {
    this._gestionCalidaService.registrarReclamo(codigoCliente).subscribe(
      (resp: RegistrarReclamoResp) => 
      {
        this._toastr.success('Se registro el reclamo con el código nro ' + resp.codigoReclamo,'Éxito !!', {closeButton: false, timeOut: 3000, progressBar: true});
        this.codReclamo = resp.codigoReclamo;
        this.formDatosGenerales.patchValue(
          {
            codigoReclamo: resp.codigoReclamo,
            fechaReclamo: this.datePipe.transform(resp.fechaRegistro,"dd/MM/yyyy HH:mm")
          });
      }
    );
  }

  obtenerDatosCliente(codigoCliente: number)
  {
    this._genericoService.ObtenerDatosCliente(codigoCliente).subscribe(
      resp => {
        this.formDatosGenerales.patchValue({
          documentoCliente: resp.documento,
          territorioCliente: resp.territorio,
          paisCliente: resp.pais
        })
      }
    )
  }

  abrirModalCargarDocumentos(modal: NgbModal)
  {
    this._modalService.open(modal, 
      {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        scrollable: true,
      }
    );
  }

  obtenerDatosDetalle(codigoReclamo: string)
  {
    if(codigoReclamo == undefined || codigoReclamo == null || codigoReclamo == '')
    {
      this._toastr.error('El código del reclamo no es válido','Error !!',{closeButton: true, timeOut: 3000, progressBar: true})
      return;
    }

    this._gestionCalidaService.obtenerDetalleReclamo(codigoReclamo).subscribe(
      (resp: DatosReclamo) => 
      {
        this.estadoReclamo = resp.cabecera.estado;

        this.formDatosGenerales.patchValue({
          fechaReclamo: this.datePipe.transform(resp.cabecera.fechaRegistro, 'dd/MM/yyyy hh:mm'),
          codigoCliente: resp.cabecera.cliente,
          documentoCliente: resp.cabecera.documento,
          razonSocialCliente: resp.cabecera.razonSocial,
          territorioCliente: resp.cabecera.territorio,
          paisCliente: resp.cabecera.pais
        })

        this.listaDetalleReclamo = resp.detalle

        if(resp.detalle.length < 0)
        {
          this.flagDetalleReclamo = false
        }
        
      }
    )

  }

  nuevoLote()
  {
    const codCliente = this.formDatosGenerales.get('codigoCliente').value
    this._router.navigate(['GestionCalidad/ReclamosQuejas/DetalleLote/', codCliente, this.codReclamo, 0, 'N']);
  }

  mostrarDetalleLote(lote: string, documento: string)
  {
    const codCliente = this.formDatosGenerales.get('codigoCliente').value
    this._router.navigate(['GestionCalidad/ReclamosQuejas/DetalleLote/', codCliente, this.codReclamo, lote, documento]);
  }


}
