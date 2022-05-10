import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-imprimir-analisis',
  templateUrl: './imprimir-analisis.component.html'
})
export class ImprimirAnalisisComponent implements OnInit {

  listarAnalisisAguja: object[] = []
  paginaAnalisisAguja: number = 1
  filroAnalisisAguja: FormGroup;

  constructor( private _esterilizacionService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService,)
  {
    this.InicializarFormulario();
  }

  ngOnInit(): void {
    this.ListarAnalisisAgujas({}, this.paginaAnalisisAguja)
  }

  InicializarFormulario(){

    this.filroAnalisisAguja = this._fb.group({
      ordenCompra: [""],
      lote: [""],
      item:[""]
    });

    this.filroAnalisisAguja.valueChanges.pipe( debounceTime(750) ).subscribe(
      filtro => {
        this.paginaAnalisisAguja = 1;
        this.ListarAnalisisAgujas(filtro, this.paginaAnalisisAguja)
      }
    );
  }

  ListarAnalisisAgujas(filtros : object, pagina: number) {

    if (filtros['ordenCompra'] == undefined)
      filtros['ordenCompra'] = ""

    if (filtros['lote'] == undefined)
      filtros['lote'] = ""

    if (filtros['item'] == undefined)
      filtros['item'] = ""

    this._esterilizacionService.ListarAnalisis(filtros['ordenCompra'], filtros['lote'], filtros['item'], pagina).subscribe(
      (data: any) => {
          this.listarAnalisisAguja = data;
          if(this.listarAnalisisAguja.length < 1)
            this._toastr.warning("No se encontraron registros", "Adventencia !!",{timeOut: 2000, closeButton: true});
        }
      )
  }

  PaginaCambiadaListaAnalisis(pagina:number){
    let filtro = this.filroAnalisisAguja.value

    this.ListarAnalisisAgujas(filtro, pagina)
  }

}
