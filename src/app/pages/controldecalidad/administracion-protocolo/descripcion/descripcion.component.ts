import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaDescripcionModel } from '@data/interface/Response/DatosFormatoTablaDescripcion.interfaces copy';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
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

 

  ModalActualizar(filaDescripcion){
    const modalDescripcion = this.modalService.open(DescripcionNuevoEditarComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});
    

		modalDescripcion.componentInstance.Marca = this.Listarmarcaprotocolo;
    modalDescripcion.componentInstance.Hebra = this.Listarhebraprotocolo;
    modalDescripcion.componentInstance.formulario = filaDescripcion;
		modalDescripcion.result.then((result) => {
   
		}, (reason) => {
      
		});
  }
  

}
