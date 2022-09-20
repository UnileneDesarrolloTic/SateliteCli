import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { DetalleControlLotes } from '@data/interface/Response/FormatoDetalleControlLotes.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-control-lotes',
  templateUrl: './control-lotes.component.html',
  styleUrls: ['./control-lotes.component.css']
})
export class ControlLotesComponent implements OnInit {

  FormControlLotes:FormGroup;
  ListarControlLotes:FormGroup;
  ControlLotesArray:DetalleControlLotes[]=[];
  TempControlLotesArray:DetalleControlLotes[]=[];

  CantidadVisualizar:number[]=[5,10,15,20]
  RegistrosPaginas:number=10;
  disabledFecha:boolean=true;

  pagina: Number = 1
	pageSize: Number = 10;
	page: Number = 1;
	dropdownSettings = {};

  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  }

  
 
  constructor(private _fb: FormBuilder,
              private  _ControlcalidadService:ControlcalidadService,
              private toastr: ToastrService,
              private modalService: NgbModal,) { 
              }

  ngOnInit(): void {
    this.paginador = {
			paginaActual: 1,
			totalPaginas: 1919,
			registroPorPagina: this.RegistrosPaginas,
			totalRegistros: 19185,
			siguiente: true,
			anterior: false,
			primeraPagina: false,
			ultimaPagina: true
		};

    this.CreacionFormulario();
    this.observableVisualizarlacantidadFilas();
  }

  cambioPagina(paginaCambiada: Number) {
		this.pagina = paginaCambiada
		this.Filtrar();
	}

  CreacionFormulario(){
      this.FormControlLotes = new FormGroup({
        FechaInicio: new FormControl(null),
        FechaFinal: new FormControl(null),
        Lote: new FormControl(''),
        NumeroFilas: new FormControl(this.RegistrosPaginas)
      });
      this.ListarControlLotes=new FormGroup({
        DetalleControlLotes:this._fb.array([])
      })

      this.FormControlLotes.controls.FechaInicio.disable();
      this.FormControlLotes.controls.FechaFinal.disable();
  }

  observableVisualizarlacantidadFilas(){
      this.FormControlLotes.controls.NumeroFilas.valueChanges.subscribe(valor=>{
          this.RegistrosPaginas=parseInt(valor);
         // this.Filtrar();
      })
  }


  Filtrar(){
    
    if(this.FormControlLotes.controls.FechaInicio.value>this.FormControlLotes.controls.FechaFinal.value && this.disabledFecha==false){
        return this.toastr.warning("La fecha de inicio no debe de ser mayor a la fecha final");
    }

    const ModalCarga = this.modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Obteniendo Información";

    const DatosCabecera={
      FechaInicio:this.FormControlLotes.controls.FechaInicio.value,
      FechaFinal:this.FormControlLotes.controls.FechaFinal.value,
      Lote:this.FormControlLotes.controls.Lote.value,
      Pagina: this.pagina,
			RegistrosPorPagina: this.RegistrosPaginas,
    }

    console.log(DatosCabecera);
    this._ControlcalidadService.ListarControlLotes(DatosCabecera).subscribe(
      resp=>{
          this.ControlLotesArray=resp["contenido"];
          this.TempControlLotesArray=resp["contenido"];
          this.ConstruirTabla(this.ControlLotesArray);
          ModalCarga.close();
      },
      error=>{
          ModalCarga.close();
          this.toastr.info("Comuniquese con sistemas");
      }
    )
  }


  ConstruirTabla(formArrayResp:DetalleControlLotes[]){
    const ArrayItem = this.ListarControlLotes.controls.DetalleControlLotes as FormArray;
    ArrayItem.controls = [];

    formArrayResp.forEach((itemRow:DetalleControlLotes)=>{

        let separarFecha= itemRow.fechaEntrega!='0001-01-01T00:00:00' ? itemRow.fechaEntrega.split("T")[0] : null;
        const ItemFilaForm = this._fb.group({
          fechaEntrega: [separarFecha ],
          aprobado: [itemRow.aprobado ],
          companiaSocio: [itemRow.companiaSocio],
          ordenFabricacion: [itemRow.ordenFabricacion],
          lote: [itemRow.lote],
          fechaRegistro:[itemRow.fechaRegistro],
          fechaProduccion:[itemRow.fechaProduccion],
          periodoProduccion: [itemRow.periodoProduccion],
          item: [itemRow.item],
          cantidadProgramada:[itemRow.cantidadProgramada],
          cantidadPedida:[itemRow.cantidadPedida],
          cantidadProducida: [itemRow.cantidadProducida],
          estado: [itemRow.estado],
          ultimaFechaModif:[itemRow.ultimaFechaModif],
          diaProduccion:[itemRow.diaProduccion],
          descripcionLocal: [itemRow.descripcionLocal],
          itemTipo: [itemRow.itemTipo],
          unidadCodigo:[itemRow.unidadCodigo],
          seccionPlanta:[itemRow.seccionPlanta],
          referenciaTipo: [itemRow.referenciaTipo],
          referenciaNumero: [itemRow.referenciaNumero],
          auditableFlag: [itemRow.auditableFlag],
          cantidadMuestra: [itemRow.cantidadMuestra],
          cliente: [itemRow.cliente],
          transferidoFlag: [itemRow.transferidoFlag],
          comentarios: [itemRow.comentarios],
          fechaRequerida: [itemRow.fechaRequerida],
          pedidoNumero: [itemRow.pedidoNumero],
          numerodeParte: [itemRow.numerodeParte],
          busqueda: [itemRow.busqueda],
          fechaExpiracion: [itemRow.fechaExpiracion],
          protocoloFlag: [itemRow.protocoloFlag],
        });
        this.ListControlLotes.push(ItemFilaForm);
    })
  }


  get ListControlLotes(){
    return this.ListarControlLotes.controls['DetalleControlLotes'] as FormArray;
  }

  ActualizarFechaEntrega(row){
      this._ControlcalidadService.ActualizarControlLotes(row).subscribe(
          resp=>{
                resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
          },
          error=>{
            this.toastr.warning(error["menssage"]);
          }
      )
  }

  ActivarFecha(){
    this.disabledFecha=!this.disabledFecha;
     if(this.disabledFecha){
      this.FormControlLotes.get("FechaInicio").patchValue(null);
      this.FormControlLotes.get("FechaFinal").patchValue(null);
      this.FormControlLotes.controls.FechaInicio.disable();
      this.FormControlLotes.controls.FechaFinal.disable();
      
     }else{
      this.FormControlLotes.get("FechaInicio").patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
      this.FormControlLotes.get("FechaFinal").patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
      this.FormControlLotes.controls.FechaInicio.enable();
      this.FormControlLotes.controls.FechaFinal.enable();
    }
  }

}
