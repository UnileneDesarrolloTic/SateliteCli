import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoFiltrarAreaPersona } from '@data/interface/Response/DatosFormatoFiltrarAreaPersona.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListarPersonaComponent } from './listar-persona/listar-persona.component';

@Component({
  selector: 'app-horasextras',
  templateUrl: './horasextras.component.html',
  styleUrls: ['./horasextras.component.css']
})
export class HorasextrasComponent implements OnInit {
  hoy = new Date()
  constructor(private _UsuarioService:UsuarioService,
              private _fb:FormBuilder,
              private modalService: NgbModal,) { }
  ListarArea:Object[]=[];

  CrearFormulario: FormGroup;
  activarCampo:boolean=true;
  ListarAreaPersona:DatosFormatoFiltrarAreaPersona[]=[];

  ngOnInit(): void {
    this.cargarInformacionArea();
    this.creacionFormulario();
    this.isObservableArea();
  }


  creacionFormulario(){
      this.CrearFormulario =  new FormGroup({
        Area:new FormControl(null),
        FechaRegistro: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        Persona: new FormControl(null),
        Justificacion: new FormControl(''),
        ListaPersona: this._fb.array([])
      })
  }

  isObservableArea(){
    this.CrearFormulario.get('Area').valueChanges.subscribe((valorArea)=>{
          this.filtrarAreaPersonal(valorArea)
    })
  }

  cargarInformacionArea(){
    this._UsuarioService.ListarPersonalArea().subscribe(
      (resp:any)=>{
        this.ListarArea=resp;
      }
    );
  }

  filtrarAreaPersonal(valorArea:number){
    this._UsuarioService.FiltrarAreaPersona(valorArea,'').subscribe(
      (resp:any)=>{
          this.tablaListarPersonal(resp);
      }
    );
  }

  tablaListarPersonal(Listar:DatosFormatoFiltrarAreaPersona[]){
    const ArrayArea = this.CrearFormulario.controls.ListaPersona as FormArray;
    ArrayArea.controls=[];

    Listar.forEach((elementArea:DatosFormatoFiltrarAreaPersona)=>{
        const PersonaFormArray= this._fb.group({
          idAsignacion:elementArea.idAsignacion,
          nombreCompleto:elementArea.nombreCompleto,
        })

        this.listadoPersonal.push(PersonaFormArray);
    })
  }

  get listadoPersonal() {
    return this.CrearFormulario.controls['ListaPersona'] as FormArray;
  }

  formarrayPersonal() {
    return this.CrearFormulario.controls.ListaPersona as FormArray;
  }

  eliminarPersonal(index:number){
    this.formarrayPersonal().removeAt(index);
  }
 

  activaDesactiva(){
      this.activarCampo=!this.activarCampo;
  }


  AgregarPersona(){
    const modalRefAgregarPersona = this.modalService.open(ListarPersonaComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});

    modalRefAgregarPersona.result.then((result) => {
		
			
		}, (reason) => {
			
			// console.log("salir Generar Cotizacion", reason)
		});

  }
}
