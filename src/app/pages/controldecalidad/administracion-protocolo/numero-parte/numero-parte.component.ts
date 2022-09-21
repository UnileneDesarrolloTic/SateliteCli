import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { TablaModel } from '@data/interface/Response/DatosFormatoTabla.interface';
import { TablaNumeroParteModel } from '@data/interface/Response/DatosFormatoTablaNumerodeParte.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-numero-parte',
  templateUrl: './numero-parte.component.html',
  styleUrls: ['./numero-parte.component.css']
})
export class NumeroParteComponent implements OnInit {
  @Input() ListarGrupo:ItemVentasModel[]=[];
  ListarTabla:TablaModel[]=[];
  ListarTablaNumeroParte:TablaNumeroParteModel[]=[];
  TempListarTablaNumeroParte:TablaNumeroParteModel[]=[];
  FiltrarNumeroParte:FormGroup;
  flagLoading:boolean=false;
  textFilterResumen = new FormControl('');

  constructor(private _GenericoService:GenericoService,
              private _ControlcalidadService:ControlcalidadService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.observableGrupo();
    this.instanciarObservadoresFilter();
  }

  crearFormulario(){
    this.FiltrarNumeroParte = new FormGroup({
          Grupo: new FormControl(null,Validators.required),
          Tabla: new FormControl(null,Validators.required)
    })
  }
  observableGrupo(){
      this.FiltrarNumeroParte.controls.Grupo.valueChanges.subscribe(valor=>{
          this.listarTabla(valor);
      })
  }

  instanciarObservadoresFilter(){
    this.textFilterResumen.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    })
  }

  filtroItem(){
    if (this.textFilterResumen.value != '') {
      const TextFiltro = this.textFilterResumen.value.toLowerCase().trim();
      this.ListarTablaNumeroParte = this.TempListarTablaNumeroParte.filter(element => element.nombreGrupo.toLowerCase().indexOf(TextFiltro) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(TextFiltro) !== -1 || element.nombreTabla?.toLowerCase().indexOf(TextFiltro) !== -1);
    } else {
      this.ListarTablaNumeroParte = this.TempListarTablaNumeroParte;
    }
  }

  listarTabla(valor){
    this._GenericoService.ListarTabla(valor).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ListarTabla=resp["content"];
        }else{
          this.ListarTabla=[];
        }
      }
    );
  }

  Filtrar(){
    this.flagLoading=true;
      this._ControlcalidadService.ListarTablaNumeroParte(this.FiltrarNumeroParte.controls.Grupo.value,this.FiltrarNumeroParte.controls.Tabla.value).subscribe(
        (resp:any)=>{
            this.ListarTablaNumeroParte=resp;
            this.TempListarTablaNumeroParte=resp;
            this.flagLoading=false;
            console.log(this.ListarTablaNumeroParte);
        }
      )
  }

  
}
