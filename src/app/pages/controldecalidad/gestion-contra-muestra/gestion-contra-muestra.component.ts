import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoOrdenFabricacionModel } from '@data/interface/Response/DatosFormatoOrdenFabricacion.interface';
import { TransaccionModel } from '@data/interface/Response/DatoTransaccion.interface';
import { MaestroAlmacenModel } from '@data/interface/Response/MaestroAlmacen.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { ModalKardexInternoComponent } from './modal-kardex-interno/modal-kardex-interno.component';

@Component({
  selector: 'app-gestion-contra-muestra',
  templateUrl: './gestion-contra-muestra.component.html',
  styleUrls: ['./gestion-contra-muestra.component.css']
})
export class GestionContraMuestraComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  Codlote: string = '20112641';
  ListarOrdenFabricacion:DatosFormatoOrdenFabricacionModel[]=[];
  ListInformacionLote:DatosFormatoOrdenFabricacionModel[]=[];
  ListarAlmancen:MaestroAlmacenModel[]=[];
  ListarTransaccion: TransaccionModel[]=[];
  ListadoOrdenFabricacion:FormGroup;
  
  Form:FormGroup;

  codAlmacen = new FormControl('ALMCMPT');
  constructor(private modalService: NgbModal,
              private _fb: FormBuilder,
              private toastr: ToastrService,
              private servicebase64:Cargarbase64Service,
              private _ServiceControlCalidad:ControlcalidadService,
              private _ServiceGenericoService:GenericoService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.ListarMaestroAlmacen();

    
  }

  ListarMaestroAlmacen(){
    this._ServiceGenericoService.ListarMaestroAlmacen().subscribe(
      (resp:any)=>{
        resp["success"] ? this.ListarAlmancen=resp["content"] :  this.ListarAlmancen=[];
      }
    );
  }

  Buscar(){
    this.BuscarProducto();
    this.BuscarTransaccion();
    this.instanciarObservadoresMaestroAlmacen();
  }

  BuscarProducto(){
    if(this.Codlote=='' || this.Codlote==null){
      return this.toastr.warning("Debe colocar el numero de lote");
    }
    this._ServiceControlCalidad.ObtenerInformacionLote(this.Codlote).subscribe(
        (resp)=>{
            this.ListInformacionLote = resp;
            this.MuestraArray(this.ListInformacionLote);
        }
    );
  }

  BuscarTransaccion(){
    if(this.Codlote=='' || this.Codlote==null){
        return this.toastr.warning("Debe colocar el numero de lote");
    }

    this._ServiceControlCalidad.ObtenerTransaccion(this.Codlote,this.codAlmacen.value).subscribe(
      (resp)=>{
          this.ListarTransaccion = resp;
      }
    );
  }
  
  instanciarObservadoresMaestroAlmacen(){
        this.codAlmacen.valueChanges.subscribe( almacen => {
          this.BuscarTransaccion();
    })
  }
  


  crearFormulario(){
    this.ListadoOrdenFabricacion = this._fb.group({
      Muestras: this._fb.array([]),
    });
  }

  MuestraArray(formArrayResp:DatosFormatoOrdenFabricacionModel[]){
    const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
    ArrayItem.controls = [];


    formArrayResp.forEach((itemRow:DatosFormatoOrdenFabricacionModel)=>{
        const ItemFilaForm = this._fb.group({
          fechaProduccion: [itemRow.fechaProduccion],
          item: [itemRow.item],
          numeroParte: [itemRow.numeroParte],
          marca: [itemRow.marca],
          descripcionLocal:[itemRow.descripcionLocal],
          ordenFabricacion:[itemRow.ordenFabricacion],
          lote:[itemRow.lote],
          cliente:[itemRow.cliente],
          auditableFlag:[itemRow.auditableFlag],
          contraMuestra:[itemRow.contraMuestra],
          numeroCaja: [itemRow.numeroCaja],
        });
        this.Muestreo.push(ItemFilaForm);
    })
  }

  get Muestreo(){
    return this.ListadoOrdenFabricacion.controls['Muestras'] as FormArray;
  }


  GuardarOrdenFabricacion(FilaLote){
      this._ServiceControlCalidad.RegistrarLoteNumeroCaja(FilaLote).subscribe(
        (resp)=>{
           resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
        }
      );
  }

  ExportarExcel(){
    
    const ModalCarga = this.modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._ServiceControlCalidad.ExportarOrdenFabricacionCaja().subscribe(
      (resp)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`ContraMuestra-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }

  get CantodadTotal():number{
    let totalAcumulado=0;
     this.ListarTransaccion.forEach(element=>totalAcumulado=totalAcumulado+element.cantidad)

     return totalAcumulado
  }

  ModalKardexInterno(fila){
    const modalRefKardexInterno = this.modalService.open(ModalKardexInternoComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});

		modalRefKardexInterno.componentInstance.fromParent = fila;
		modalRefKardexInterno.result.then((result) => {
		
		}, (reason) => {
		
		});
  }

 

}
