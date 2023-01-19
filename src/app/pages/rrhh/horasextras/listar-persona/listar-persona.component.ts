import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoPersonaTecnico } from '@data/interface/Response/DatosFormatoPersonaTecnica.interfaces';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-persona',
  templateUrl: './listar-persona.component.html',
  styleUrls: ['./listar-persona.component.css']
})
export class ListarPersonaComponent implements OnInit {
  BuscarNombrePersona=new FormControl('');
  ListarDatosFormatoPersonaTecnico:DatosFormatoPersonaTecnico[]=[];
  TmpListarDatosFormatoPersonaTecnico:DatosFormatoPersonaTecnico[]=[];
  SeleccionArrayListar:DatosFormatoPersonaTecnico[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _UsuarioService:UsuarioService,
              private _GenericoService:GenericoService,
              private toastr: ToastrService,
                ) { }

  ngOnInit(): void {
    this.listarPersona();
    this.isObservable();
  }

  listarPersona(){
     
      this._UsuarioService.ListarPersonaTecnica().subscribe(
        (resp:any)=>{
              this.ListarDatosFormatoPersonaTecnico=resp;
              this.TmpListarDatosFormatoPersonaTecnico= resp;
        }
      )
  }

  isObservable(){
    this.BuscarNombrePersona.valueChanges.pipe(debounceTime(900)).subscribe((valor)=>{
      if(valor.trim() == ''){
        this.ListarDatosFormatoPersonaTecnico=this.TmpListarDatosFormatoPersonaTecnico;
      }else{
        this.ListarDatosFormatoPersonaTecnico=this.TmpListarDatosFormatoPersonaTecnico.filter(x=>x.nombreCompleto.toLowerCase().indexOf(valor.toLowerCase().trim()) !== -1);
      }
    })
  }


  SeleccionaItem(rowItem:DatosFormatoPersonaTecnico){
    this.SeleccionArrayListar=[];

    for (var i = 0; i < this.TmpListarDatosFormatoPersonaTecnico.length; i++) {
      if(this.TmpListarDatosFormatoPersonaTecnico[i].idEmpleado==rowItem.idEmpleado){
        this.TmpListarDatosFormatoPersonaTecnico[i].isSelected==rowItem.isSelected;
      }
    }

    for (var i = 0; i < this.TmpListarDatosFormatoPersonaTecnico.length; i++) {
      if (this.TmpListarDatosFormatoPersonaTecnico[i].isSelected){
        this.SeleccionArrayListar.push(this.TmpListarDatosFormatoPersonaTecnico[i]);
      }
    }
  }


  agregar(){
    if(this.SeleccionArrayListar.length>0)
      this.activeModal.close(this.SeleccionArrayListar);
    else
      this.toastr.warning("Debe Seleccionar una o mas personas");
  }
  

}
