import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  loteAnalisis: string = ""
  reporteSeleccionado: string = ""
  flagDescargandoReporte: boolean = false

  constructor( private _analisisAgujaService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService, private _modalService: NgbModal)
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

  ObtenerReporteAnalisis(modal: NgbModal, loteAnalisis: string){

    this.loteAnalisis = loteAnalisis;

    this.abrirModalReporte(modal);

  }

  descargarReporte(){

      if(this.flagDescargandoReporte)
      {
        this._toastr.warning("Se esta generando el reporte en este momento", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar: true, tapToDismiss: true})
        return
      }

      if(this.reporteSeleccionado != "f" && this.reporteSeleccionado != "a")
      {
        this._toastr.warning("Seleccione un reporte, para la descarga", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar:true, tapToDismiss:true})
        return
      }

      if(this.reporteSeleccionado == "f")
      {
        this.flagDescargandoReporte = true

        this._analisisAgujaService.ObtenerReporteFlexionAguja(this.loteAnalisis).subscribe(
          response => {

            if(response['success'] == false)
            {
              this._toastr.warning(response['message'], "Adventencia !!",{timeOut: 5000, closeButton: true});
              this.flagDescargandoReporte = false
              return
            }

            this.downloadPDF(response['content'], this.loteAnalisis + " - Reporte Flexión")

            setTimeout( () => this.flagDescargandoReporte = false, 1500)

          },
          err => {
            this.flagDescargandoReporte = false
          }
        );
      }

      if(this.reporteSeleccionado == "a")
      {
        this.flagDescargandoReporte = true

        this._analisisAgujaService.ObtenerReporteAnalisisAguja(this.loteAnalisis).subscribe(
          response => {

            if(response['success'] == false)
            {
              this._toastr.warning(response['content'], "Adventencia !!",{timeOut: 5000, closeButton: true, tapToDismiss:true});
              this.flagDescargandoReporte = false
              return
            }

            this.downloadPDF(response['content'], this.loteAnalisis + " - Reporte de análisis de aguja")

            setTimeout( () => this.flagDescargandoReporte = false, 1500)

          },
          err => this.flagDescargandoReporte = false
        )
      }

  }

  downloadPDF(pdf:string, nameFile: string)
  {
    const downloadLink = document.createElement("a")
    downloadLink.href = `data:application/pdf;base64,${pdf}`
    downloadLink.download = `${nameFile}.pdf`
    downloadLink.click()
    downloadLink.remove()
  }

  cerrarModal() {
    this._modalService.dismissAll();
  }

  abrirModalReporte(modal:NgbModal)
  {
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
  }

}
