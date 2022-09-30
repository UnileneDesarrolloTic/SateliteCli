import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaLeyendaModel } from '@data/interface/Response/DatosFormatoTablaLeyenda.interfaces';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeAdvertenciaComponent } from '@shared/components/mensaje-advertencia/mensaje-advertencia.component';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { LeyendaNuevoEditarComponent } from './leyenda-nuevo-editar/leyenda-nuevo-editar.component';

@Component({
  selector: 'app-leyenda',
  templateUrl: './leyenda.component.html',
  styleUrls: ['./leyenda.component.css']
})
export class LeyendaComponent implements OnInit {
  @Input() Listarmarcaprotocolo:ProtocoloDescripcionModel[]=[];
  @Input() Listarhebraprotocolo:ProtocoloDescripcionModel[]=[];
  ListarTablaLeyenda:TablaLeyendaModel[]=[];
  FiltrarLeyenda:FormGroup;
  constructor(private _GenericoService:GenericoService,
              private _ControlcalidadService: ControlcalidadService,
              private modalService: NgbModal,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.FiltrarLeyenda= new FormGroup({
        Marca: new FormControl('%'),
        Hebra: new FormControl('%'),
    });
  }

  Filtrar(){
    this._ControlcalidadService.ListarTablaLeyenda(this.FiltrarLeyenda.controls.Marca.value,this.FiltrarLeyenda.controls.Hebra.value).subscribe(
      (resp:any)=>{
           this.ListarTablaLeyenda=resp;
      });
  }

  AbrirModal(filaLeyenda,Tipo){
    console.log(filaLeyenda);
    const modalDescripcion = this.modalService.open(LeyendaNuevoEditarComponent, {
			// ariaLabelledBy: 'modal-basic-title',
			// backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});
    

		modalDescripcion.componentInstance.ListarMarca = this.Listarmarcaprotocolo;
    modalDescripcion.componentInstance.ListarHebra = this.Listarhebraprotocolo;
    modalDescripcion.componentInstance.formulario = filaLeyenda;
    modalDescripcion.componentInstance.Tipo = Tipo;
		modalDescripcion.result.then((result) => {
        if(result){
          this.Filtrar();
        }
		}, (reason) => {
      
		});
  }

  EliminarModal(leyenda:TablaLeyendaModel,index){
    const modalAdvertencia = this.modalService.open(MensajeAdvertenciaComponent, {
      centered:true,
			backdrop: 'static',
			size: 'sm',
			scrollable: true,
			keyboard: false
		});
    
    modalAdvertencia.componentInstance.fromParent= `¿Desea Eliminar la leyenda N°${leyenda.iD_LEYENDA}?`
    modalAdvertencia.result.then((result) => {
        if(result){
            this.Eliminar(leyenda,index);
        }
    }, (reason) => {
      
    });
  }


  Eliminar(filaLeyenda:TablaLeyendaModel,index:number){
    this._ControlcalidadService.EliminarLeyendaDT(filaLeyenda.iD_LEYENDA).subscribe(
      (resp:any)=>{
        if (resp["success"]){
          this.toastr.success(resp["content"]);
          this.ListarTablaLeyenda.splice(index,1)
        }else{
          this.toastr.info(resp["content"]);
        } 
      }
    );
  }

}
