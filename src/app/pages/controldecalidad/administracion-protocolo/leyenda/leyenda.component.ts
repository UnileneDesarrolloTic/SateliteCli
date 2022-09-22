import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaLeyendaModel } from '@data/interface/Response/DatosFormatoTablaLeyenda.interfaces';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { GenericoService } from '@shared/services/comunes/generico.service';

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
    private _ControlcalidadService: ControlcalidadService) { }

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
  ModalActualizar(){
    
  }

}
