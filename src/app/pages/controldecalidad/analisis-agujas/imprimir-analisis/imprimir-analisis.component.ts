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

  constructor( private _analisisAgujaService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService,)
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

    this._analisisAgujaService.ListarAnalisis(filtros['ordenCompra'], filtros['lote'], filtros['item'], pagina).subscribe(
      (data: any) => {
          this.listarAnalisisAguja = data;
          if(this.listarAnalisisAguja.length < 1)
            this._toastr.warning("No se encontraron registros", "Adventencia !!",{timeOut: 4000, closeButton: true});
        }
      )
  }

  PaginaCambiadaListaAnalisis(pagina:number){
    let filtro = this.filroAnalisisAguja.value

    this.ListarAnalisisAgujas(filtro, pagina)
  }

  ObtenerReporteAnalisis(loteAnalisis: string){

    this._analisisAgujaService.ObtenerReporteFlexionAguja(loteAnalisis).subscribe(
      response => {
        if(response['success'] == false)
        {
          this._toastr.warning(response['message'], "Adventencia !!",{timeOut: 5000, closeButton: true});
          return
        }

        this.file(response, loteAnalisis)
      }
    );

  }

  file(fileContent, loteAnalisis){
		const fileBlob = new Blob(
		  [this.base64ToUint8Array(fileContent['content'])],
		  { type: "application/pdf" }
		);

		var objectURL = URL.createObjectURL(fileBlob);
		const exportLinkElement = document.createElement('a');

		exportLinkElement.hidden = true;
		exportLinkElement.download = loteAnalisis + ".pdf";
		exportLinkElement.href = objectURL;
		exportLinkElement.text = "downloading...";

		document.body.appendChild(exportLinkElement);
		exportLinkElement.click();

		URL.revokeObjectURL(objectURL);

		exportLinkElement.remove();

	};

  base64ToUint8Array(string) {
		var raw = atob(string);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));
		for (var i = 0; i < rawLength; i += 1) {
		  array[i] = raw.charCodeAt(i);
		}
		return array;
	}

}
