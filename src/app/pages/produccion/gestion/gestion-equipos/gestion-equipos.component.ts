import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquiposEngasteComponent } from './equipos-engaste/equipos-engaste.component';
import { GestionEquipoEngasteService } from '@data/services/backEnd/pages/gestion-equipo-engaste.service';
import { EquipoEngaste } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoEquipoEngaste.interface';
import { ModalEmpleadorComponent } from '@shared/components/modal-empleador/modal-empleador.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ListadoDados } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoListadoDado.interface';

@Component({
  selector: 'app-gestion-equipos',
  templateUrl: './gestion-equipos.component.html',
  styleUrls: ['./gestion-equipos.component.css']
})
export class GestionEquiposComponent implements OnInit {
  listadoEquipo: EquipoEngaste[] = [];
  formFiltro:FormGroup;
  listaDadosEquipo: ListadoDados[] = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  constructor(private modalService: NgbModal, private _GestionEquipoEngasteService: GestionEquipoEngasteService) { }
  
  ngOnInit(): void {
    this.creacionFiltro();
    this.listadoEquipoDados();

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'codigo',
      unSelectAllText: 'Todos',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      maxHeight:150 
    };
  }

  creacionFiltro(){
      this.formFiltro = new FormGroup({
        nombrePersona : new FormControl(''),
        persona       : new FormControl(0),
        tipo          : new FormControl(''),
        codigo        : new FormControl('')
      })
  }


  nuevoEquipo(){
    const modalEquipo= this.modalService.open(EquiposEngasteComponent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop      : 'static',
      size          : 'dm',
      scrollable    : true,
      keyboard      : false
      
    });
    modalEquipo.componentInstance.interface = 'Nuevo';
    modalEquipo.componentInstance.equipo = {}
    modalEquipo.result.then((result) => {
      this.busquedaEquipo();
    }, (reason: any) => {
    });

  }


  busquedaEquipo(){
    const dato = 
    {
      persona: this.formFiltro.controls.persona.value,
      tipo: this.formFiltro.controls.tipo.value,
      codigo: this.formFiltro.controls.codigo.value.length > 0 ? this.formFiltro.controls.codigo.value[0]["id"] : 0
    }

    this._GestionEquipoEngasteService.litarEquipoEngaste(dato).subscribe(
      (resp:any)=>{
          this.listadoEquipo =  resp;
      }
    )
  }

  editarEquipo(equipo: EquipoEngaste){
    const modalEditar = this.modalService.open(EquiposEngasteComponent,{
      ariaLabelledBy: 'modal-basic-title',
      backdrop      : 'static',
      size          : 'dm',
      scrollable    : true,
      keyboard      : false
    });
    modalEditar.componentInstance.interface =  'Editar';
    modalEditar.componentInstance.equipo =  equipo;
    modalEditar.result.then((result)=>{
      this.busquedaEquipo();
    },(reason:any)=>{

    });
  }


  openModalOperador(){
    const modalEmpleado = this.modalService.open(ModalEmpleadorComponent, {
      ariaLabelledBy  : 'modal-basic-title',
      backdrop        : 'static',
      size            : 'xl',
      scrollable      : true,
      keyboard        : false
      
    });
    modalEmpleado.result.then((result:any) => {
         this.formFiltro.patchValue({
            persona:result.persona,
            nombrePersona: result.nombreCompleto
         });
    }, (reason: any) => {
      
    });
  }

  refrescarOperador(){
    this.formFiltro.patchValue({
      persona:0,
      nombrePersona: ''
    });
  }

  listadoEquipoDados(){
      this._GestionEquipoEngasteService.listadoDado().subscribe(
        (resp:any)=>{
            this.listaDadosEquipo = resp;
        }
      )
  }


}
