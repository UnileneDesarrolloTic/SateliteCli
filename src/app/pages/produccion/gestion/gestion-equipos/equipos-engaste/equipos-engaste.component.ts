import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EquipoEngaste } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoEquipoEngaste.interface';
import { Empleado } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoEmpleado.interface';
import { ListadoDados } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoListadoDado.interface';
import { GestionEquipoEngasteService } from '@data/services/backEnd/pages/gestion-equipo-engaste.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEmpleadorComponent } from '@shared/components/modal-empleador/modal-empleador.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-equipos-engaste',
  templateUrl: './equipos-engaste.component.html',
  styleUrls: ['./equipos-engaste.component.css']
})
export class EquiposEngasteComponent implements OnInit {
  @Input() interface:string;
  @Input() equipo:EquipoEngaste;

  form:FormGroup;
  listarDados: ListadoDados[] = [];
  templistarDatos: ListadoDados[] = [];
  textFilterDado = new FormControl('');
  flagEspera:boolean = false;

  seleccionArrayDatos: any;
  seleccionarTodo: boolean;
  
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private _GestionEquipoEngasteService: GestionEquipoEngasteService, private _ToastrService:ToastrService) { }
  

  ngOnInit(): void {
    this.crearFormulario();

    if (this.interface == 'Nuevo')
    {
      this.listadoDado();
    }
    else
    {
      this.informacionEquipo(this.equipo.idEquipo);
    }
    
    this.isObservableFiltrar();
  }

  crearFormulario (){
    this.form = new FormGroup({
        idEquipo  : new FormControl(0),
        nombre    : new FormControl('',Validators.required),
        tipo      : new FormControl('',Validators.required),
        estado    : new FormControl('A',Validators.required),
        persona   : new FormControl(null,Validators.required),
        idpersona : new FormControl(null,Validators.required)
    })
  }

  informacionEquipo(idEquipo){
      this._GestionEquipoEngasteService.informacionEngaste(idEquipo).subscribe(
        (resp:any)=>{
              this.form.patchValue({
                idEquipo       : resp["cabecera"]["idEquipo"],
                nombre         : resp["cabecera"]["descripcion"],
                tipo           : resp["cabecera"]["tipo"],
                idpersona      : resp["cabecera"]["idPersona"],
                estado         : resp["cabecera"]["estado"],
                persona        : resp["cabecera"]["nombreCompleto"],
              });
              this.listarDados = resp["detalle"];
              this.templistarDatos = resp["detalle"];
              this.seleccionArrayDatos= resp["detalle"].filter((dadosElementos:ListadoDados)=> dadosElementos.seleccionar == true).map((element:ListadoDados)=>  element.id);

        }
      );
  }
  

  openModalConsultaOperador(){
    const modalEmpleado = this.modalService.open(ModalEmpleadorComponent, {
      ariaLabelledBy  : 'modal-basic-title',
      backdrop        : 'static',
      size            : 'xl',
      scrollable      : true,
      keyboard        : false
      
    });
    modalEmpleado.result.then((result:any) => {
          this.form.patchValue({
            idpersona : result.persona,
            persona   : result.nombreCompleto
          })
    }, (reason: any) => {
        console.log(reason);
    });

  }

  listadoDado(){
    this._GestionEquipoEngasteService.listadoDado().subscribe(
      (resp:any)=>{
          this.listarDados = resp;
          this.templistarDatos = resp;
          this.seleccionArrayDatos=[];
      }
    )
  }

  isObservableFiltrar(){
    this.textFilterDado.valueChanges.pipe(debounceTime(900)).subscribe(
      (valor)=>{
        if(valor.trim() == ''){
          this.listarDados = this.templistarDatos;
        }else{
          this.listarDados = this.templistarDatos.filter(x=>x.codigo.indexOf(valor) !== -1);
        }
      }
    )
  }

  
  SeleccionaItem(rowItem:ListadoDados){
    this.seleccionArrayDatos=[];

    for (var i = 0; i < this.templistarDatos.length; i++) {
        if(this.templistarDatos[i].id == rowItem.id){
          this.templistarDatos[i].seleccionar = rowItem.seleccionar;
        }
    }

    for (var i = 0; i < this.templistarDatos.length; i++) {
      if (this.templistarDatos[i].seleccionar){
        this.seleccionArrayDatos.push(this.templistarDatos[i].id);
      }
    }  
  }



  registrarEngastado(){
    
    const dato = {
      ...this.form.value,
      detalle:this.seleccionArrayDatos
    }

    this.flagEspera =  true;

    this._GestionEquipoEngasteService.registrarDadto(dato).subscribe(
      (resp:any)=>
      {
         this._ToastrService.success(resp["message"]);
         this.flagEspera =  false
         this.activeModal.close()
      },
      (_)=> this.flagEspera =  false
    )
  }


}
