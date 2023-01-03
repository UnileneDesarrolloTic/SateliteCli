import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormtoArea } from '@data/interface/Response/DatosFormatoAreaPersonal.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  @Input() ListarArea: DatosFormtoArea[];
  TablaFormulario:FormGroup;
  //enviar al componente padre
  @Output() enviarRespuesta : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() enviarRespuesta2 : EventEmitter<boolean> = new EventEmitter<boolean>();

  NuevaArea = new FormControl('');

  constructor(private fb:FormBuilder,
              private _UsuarioService: UsuarioService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.CrearFormulario();
    this.TablaListarArea(this.ListarArea);
    
  }

  CrearFormulario(){
    this.TablaFormulario = new FormGroup({
        TablaArea:this.fb.array([])
    })  
  }

  TablaListarArea(ListarArea:DatosFormtoArea[]){
    const ArrayArea = this.TablaFormulario.controls.TablaArea as FormArray;
    ArrayArea.controls=[];

    ListarArea.forEach((elementArea:DatosFormtoArea)=>{
        const AreaFormArray= this.fb.group({
            idArea:elementArea.idArea,
            descripcion:elementArea.descripcion,
        })

        this.ListadoArea.push(AreaFormArray);
    })
  }

  agregarAreaFormArray(filaArea:DatosFormtoArea){
     const AreaFormArray = this.fb.group({
        idArea:filaArea.idArea,
        descripcion:filaArea.descripcion,
      });

      this.ListadoArea.push(AreaFormArray);
  }


  get ListadoArea() {
    return this.TablaFormulario.controls['TablaArea'] as FormArray;
  }

  formarrayArea() {
    return this.TablaFormulario.controls.TablaArea as FormArray;
  }

  agregarArea(){
    if(this.NuevaArea.value.trim()=="")
       return this.toastr.warning("Para registrar una nueva area.Debe colocar un nombre");

      this._UsuarioService.RegistrarEditarArea(0,this.NuevaArea.value.trim()).subscribe(
        (resp:any)=>{
            if (resp["success"]){
                this.toastr.success("Registrado con  existo");
                this.agregarAreaFormArray(resp["content"]);
                this.enviarRespuesta.emit(resp["success"]);
            }
                
                
        },
        (error)=>{
              this.toastr.info("Comunicarse con sistemas");
        }
      );
  }

  editar(filaArea:FormGroup,index:number){
    if(filaArea.value.descripcion.trim()=="")
        return this.toastr.warning("Para registrar una nueva area.Debe colocar un nombre");
        
    this._UsuarioService.RegistrarEditarArea(filaArea.value.idArea,filaArea.value.descripcion).subscribe(
          (resp:any)=>{
            if (resp["success"]){
              this.toastr.success("Actualizado con  existo");
              this.enviarRespuesta.emit(resp["success"]);
            }
          },
          (error)=>{
                this.toastr.info("Comunicarse con sistemas");
          }
    );
  }
  eliminar(filaArea:FormGroup,index:number){
    this._UsuarioService.EliminarArea(filaArea.value.idArea).subscribe(
      (resp:any)=>{
        if (resp["success"]){
          this.toastr.success(resp["content"]);
          this.enviarRespuesta2.emit(resp["success"]);
          this.formarrayArea().removeAt(index);
          
        }
      },
      (error)=>{
          this.toastr.info("Comunicarse con sistemas");
      }
    );
    
  }
  
}
