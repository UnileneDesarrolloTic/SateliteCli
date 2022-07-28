import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatosFormatoListarLoteEstadoModel } from '@data/interface/Response/DatosFormatoListarLoteEstado.interface';
import { DatosFormatoOrdenFabricacionEtiquetasModel } from '@data/interface/Response/DatosFormatoOrdenFabricacionEtiquetas.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent implements OnInit {
  codLote: string = '';
  ObjectOrdenFabricacion: DatosFormatoOrdenFabricacionEtiquetasModel;
  ListarLoteEstado: DatosFormatoListarLoteEstadoModel[] = [];
  ListadoOrdenFabricacion: FormGroup;
  Habilitar: boolean = true;

  constructor(private _fb: FormBuilder,
    private toastr: ToastrService,
    private _ProduccionService: ProduccionService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.ListarLoteEstadoArray();
  }

  Buscar() {
    if (this.codLote == '') {
      return this.toastr.warning("Debe colocar el lote de fabricación");
    }
    this._ProduccionService.LoteFabricacionEtiquetas(this.codLote).subscribe(
      (resp) => {
        resp["success"] ? this.ObjectOrdenFabricacion = resp["content"] : {};
        this.MuestraArray(this.ObjectOrdenFabricacion);
      }
    );
  }

  crearFormulario() {
    this.ListadoOrdenFabricacion = this._fb.group({
      Muestras: this._fb.array([]),
    });
  }

  MuestraArray(item: DatosFormatoOrdenFabricacionEtiquetasModel) {
    this.Habilitar = item.transferidoflag == 'N' ? true : false
    const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
    ArrayItem.controls = [];

    const ItemFilaForm = this._fb.group({
      fechaProduccion: [item.fechaProduccion],
      item: [item.item],
      numeroParte: [item.numeroParte],
      marca: [item.marca],
      descripcionLocal: [item.descripcionLocal],
      cliente: [item.cliente],
      lote: [item.lote],
      ordenFabricacion: [item.ordenFabricacion],
      transferidoflag: [item.transferidoflag],
    });

    this.Fabricacion.push(ItemFilaForm);

  }

  Guardar() {
    this._ProduccionService.RegistrarLoteFabricacionEtiquetas(this.ListadoOrdenFabricacion.controls['Muestras'].value).subscribe(
      (resp) => {
        if (resp["success"]) {
          this.toastr.success(resp["content"])
          const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
          ArrayItem.controls = [];
          this.codLote='';
          this.Habilitar=true;
          this.ListarLoteEstadoArray();
        }else{
          this.toastr.info(resp["content"])
        }

      }
    );
  }

  get Fabricacion() {
    return this.ListadoOrdenFabricacion.controls['Muestras'] as FormArray;
  }

  ListarLoteEstadoArray() {
    this._ProduccionService.ListarLoteEstado().subscribe(
      (resp) => {
        this.ListarLoteEstado = resp;

      }
    );
  }


  Eliminar(row) {
    this._ProduccionService.ModificarLoteEstado(row).subscribe(
      (resp) => {
        if (resp["success"]) {
              this.toastr.success(resp["content"])
              this.ListarLoteEstado=this.ListarLoteEstado.filter(element=> element.id !== row.id)
        }else{
          this.toastr.info(resp["content"])
        }
      }
    );
  }


}
