import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CalibrePruebaModel } from '@data/interface/Response/DatosFormatoCalibrePrueba.interface';
import { ProtocoloMetodologiaModel } from '@data/interface/Response/DatosFormatoMetodologiaProtocolo.interfaces';
import { TablaPruebasModel } from '@data/interface/Response/DatosFormatoTablaPruebas.interfaces';
import { AgrupadorHebrasModel } from '@data/interface/Response/DatosFormularioAgrupadorHebra.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeAdvertenciaComponent } from '@shared/components/mensaje-advertencia/mensaje-advertencia.component';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { PruebaNuevoEditComponent } from './prueba-nuevo-edit/prueba-nuevo-edit.component';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {
  Listarmetodologia:ProtocoloMetodologiaModel[]=[];
  ListarAgrupadorHebras:AgrupadorHebrasModel[]=[]
  ListarTablaPrueba:TablaPruebasModel[]=[];
  ListarCalibrePrueba:CalibrePruebaModel[]=[];
  FiltrarPruebas:FormGroup;
  constructor(private _GenericoService:GenericoService,
              private _ControlcalidadService: ControlcalidadService,
              private modalService: NgbModal,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearformulario();
    this.ListarMetodologia();
    this.ListarAgrupadoHebra();
    this.CalibrePrueba()
  }

  crearformulario(){
    this.FiltrarPruebas = new FormGroup({
      Metodologia:new FormControl(1)
    })
  }
  ListarMetodologia(){
    this._GenericoService.ListarMetodologia().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.Listarmetodologia=resp["content"];
        }else{
          this.Listarmetodologia=[];
        }
      }
    )
  }

  ListarAgrupadoHebra(){
    this._GenericoService.ListarAgrupadorHebras().subscribe(
        (resp)=>{
        if(resp["success"]){
          this.ListarAgrupadorHebras=resp["content"];
        }else{
          this.ListarAgrupadorHebras=[];
        }
        }
    )
  }

  CalibrePrueba(){
     this._GenericoService.ListarCalibrePrueba().subscribe(
        (resp:any)=>{
          if(resp["success"]){
            this.ListarCalibrePrueba=resp["content"];
          }else{
            this.ListarCalibrePrueba=[];
          }
        }
     )
  }

  Filtrar(){
    this._ControlcalidadService.ListarTablaPrueba(this.FiltrarPruebas.controls.Metodologia.value).subscribe(
        (resp:any)=>{
              this.ListarTablaPrueba=resp
        }
    )
  }


  AbrirModal(filaPrueba,Tipo){
   
    const modalDescripcion = this.modalService.open(PruebaNuevoEditComponent, {
			// ariaLabelledBy: 'modal-basic-title',
			// backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});
    

		modalDescripcion.componentInstance.ListarAgrupadorHebras = this.ListarAgrupadorHebras;
    modalDescripcion.componentInstance.ListarCalibrePrueba = this.ListarCalibrePrueba;
    modalDescripcion.componentInstance.Listarmetodologia = this.Listarmetodologia;
    modalDescripcion.componentInstance.formulario = filaPrueba;
    modalDescripcion.componentInstance.Tipo = Tipo;
		modalDescripcion.result.then((result) => {
        if(result){
          this.Filtrar();
        }
		}, (reason) => {
      
		});
  }


  EliminaModal(fila:TablaPruebasModel,index:number){
    const modalAdvertencia = this.modalService.open(MensajeAdvertenciaComponent, {
      centered:true,
			backdrop: 'static',
			size: 'sm',
			scrollable: true,
			keyboard: false
		});
    
    modalAdvertencia.componentInstance.fromParent= `¿Desea Eliminar la Prueba N°${fila.iD_PRUEBA}?`
    modalAdvertencia.result.then((result) => {
        if(result){
            this.Eliminar(fila,index);
        }
    }, (reason) => {
      
    });
  }

  Eliminar(filaPrueba:TablaPruebasModel,index:number){
    this._ControlcalidadService.EliminarPueba(filaPrueba.iD_PRUEBA).subscribe(
        (resp:any)=>{
          if (resp["success"]){
            this.toastr.success(resp["content"]);
            this.ListarTablaPrueba.splice(index,1)
          }else{
            this.toastr.info(resp["content"]);
          } 
        }
    );
  }

}
