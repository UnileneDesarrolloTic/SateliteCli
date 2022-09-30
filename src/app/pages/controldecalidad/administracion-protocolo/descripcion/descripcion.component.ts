import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaDescripcionModel } from '@data/interface/Response/DatosFormatoTablaDescripcion.interfaces';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeAdvertenciaComponent } from '@shared/components/mensaje-advertencia/mensaje-advertencia.component';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { DescripcionNuevoEditarComponent } from './descripcion-nuevo-editar/descripcion-nuevo-editar.component';

@Component({
  selector: 'app-descripcion',
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.css']
})
export class DescripcionComponent implements OnInit {
  @Input() Listarmarcaprotocolo:ProtocoloDescripcionModel[]=[];
  @Input() Listarhebraprotocolo:ProtocoloDescripcionModel[]=[];
  ListarTablaDescripcion:TablaDescripcionModel[]=[];
  FiltrarDescripcion:FormGroup;
  constructor(private _GenericoService:GenericoService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private _ControlcalidadService: ControlcalidadService) { }

  ngOnInit(): void {
    this.crearFormulario();

  }

  crearFormulario(){
    this.FiltrarDescripcion= new FormGroup({
        Marca: new FormControl('%'),
        Hebra: new FormControl('%'),
    });
  }

  Filtrar(){
    this._ControlcalidadService.ListarTablaDescripcion(this.FiltrarDescripcion.controls.Marca.value,this.FiltrarDescripcion.controls.Hebra.value).subscribe(
      (resp:any)=>{
           this.ListarTablaDescripcion=resp;
      }
    )
  }

 

  ModalAbrir(filaDescripcion,Tipo:boolean){
    const modalDescripcion = this.modalService.open(DescripcionNuevoEditarComponent, {
			// ariaLabelledBy: 'modal-basic-title',
			// backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});
    

		modalDescripcion.componentInstance.ListarMarca = this.Listarmarcaprotocolo;
    modalDescripcion.componentInstance.ListarHebra = this.Listarhebraprotocolo;
    modalDescripcion.componentInstance.formulario = filaDescripcion;
    modalDescripcion.componentInstance.Tipo = Tipo;
		modalDescripcion.result.then((result) => {
        if(result){
          this.Filtrar();
        }
		}, (reason) => {
      
		});
  }

  ModalEliminar(filaDescripcion:TablaDescripcionModel,index:number){
    const modalAdvertencia = this.modalService.open(MensajeAdvertenciaComponent, {
      centered:true,
			backdrop: 'static',
			size: 'sm',
			scrollable: true,
			keyboard: false
		});
    
    modalAdvertencia.componentInstance.fromParent= `¿Desea Eliminar la Descripción N°${filaDescripcion.iD_DESCRIPCION}?`
    modalAdvertencia.result.then((result) => {
        if(result){
            this.Eliminar(filaDescripcion,index);
        }
    }, (reason) => {
      
    });

  }


  Eliminar(Descripcion:TablaDescripcionModel,index:number){
    this._ControlcalidadService.EliminarDescripcionDT(Descripcion.iD_DESCRIPCION).subscribe(
      (resp:any)=>{
        if (resp["success"]){
          this.toastr.success(resp["content"]);
          this.ListarTablaDescripcion.splice(index,1)
        }else{
          this.toastr.info(resp["content"]);
        } 
      }
    )
  }
  

}
