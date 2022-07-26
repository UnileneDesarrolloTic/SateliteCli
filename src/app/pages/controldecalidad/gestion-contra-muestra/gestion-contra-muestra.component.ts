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

@Component({
  selector: 'app-gestion-contra-muestra',
  templateUrl: './gestion-contra-muestra.component.html',
  styleUrls: ['./gestion-contra-muestra.component.css']
})
export class GestionContraMuestraComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  CodloteFabricacion: string = '';
  ListarOrdenFabricacion:DatosFormatoOrdenFabricacionModel[]=[];
  ObjectOrdenFabricacion:DatosFormatoOrdenFabricacionModel;
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
    if(this.CodloteFabricacion=='' || this.CodloteFabricacion==null){
      return this.toastr.warning("Debe colocar el lote de fabricación");
    }
      this._ServiceControlCalidad.ObtenerOrdenFabricacion(this.CodloteFabricacion).subscribe(
          (resp)=>{
              resp["success"] ? this.ObjectOrdenFabricacion = resp["content"]: {};
              this.MuestraArray(this.ObjectOrdenFabricacion);
          }
      );
  }

  BuscarTransaccion(){
    if(this.CodloteFabricacion=='' || this.CodloteFabricacion==null){
        return this.toastr.warning("Debe colocar el lote de fabricación");
    }

    this._ServiceControlCalidad.ObtenerTransaccion(this.CodloteFabricacion,this.codAlmacen.value).subscribe(
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

  MuestraArray(item:DatosFormatoOrdenFabricacionModel){
    const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
    ArrayItem.controls = [];

    const ItemFilaForm = this._fb.group({
      fechaProduccion: [item.fechaProduccion],
      item: [item.item],
      numeroParte: [item.numeroParte],
      marca: [item.marca],
      descripcionLocal:[item.descripcionLocal],
      cliente: [item.cliente],
      lote: [item.lote],
      contraMuestra: [item.contraMuestra],
      numeroCaja: [item.numeroCaja],
    });
    
    this.Muestreo.push(ItemFilaForm);

  }

  get Muestreo(){
    return this.ListadoOrdenFabricacion.controls['Muestras'] as FormArray;
  }


  GuardarOrdenFabricacion(){
      this._ServiceControlCalidad.RegistrarOrdenFabricacionCaja(this.ListadoOrdenFabricacion.controls['Muestras'].value).subscribe(
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
          this.servicebase64.file(resp.content,`ListaLicitaciones-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }

  

 

}
