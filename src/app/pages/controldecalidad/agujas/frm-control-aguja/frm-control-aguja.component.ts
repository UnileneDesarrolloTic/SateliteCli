import { debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';

@Component({
  selector: 'app-frm-control-aguja',
  templateUrl: './frm-control-aguja.component.html'
})
export class FrmControlAgujaComponent implements OnInit {

  listarAnalisisAguja: object[] = []
  paginaAnalisisAguja: number = 1
  // txtCantidadPruebas: number = 0;
  // txtFechaVencimiento: Date;
  // txtNumeroOrden: string = '';
  // txtNombreProveedor: string = '';
  listaOrdenesCompra: Object[] = [];
  paginaOrdenCompra: number = 1
  // listaCiclos: object[] = [];
  // datosMatricula: object[] = [];
  // //---------------------------------------
  //  tablas=[];
  // txtNumeroAnalisis: string = 'AG-1318-22';
  // txtCntPruebas: string = '';
  // txtCiclos: string = '';
  // txtDescripcion: string = '';
  // txtFechaAnalisis: Date;
  // date: any;

  public filroAnalisisAguja: FormGroup;
  public filtroOrdenCompra: FormGroup;

  constructor(
    private _esterilizacionService: AnalisisAgujaService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    // private sesion: SesionService,
  ) {
    this.InicializarFormulario();
  }

  ngOnInit(): void {
    this.ListarAnalisisAgujas({}, this.paginaAnalisisAguja);
    // this.ListarOrdenCompra({}, this.paginaOrdenCompra);
  }

  InicializarFormulario(){

    this.filroAnalisisAguja = this._fb.group({
      ordenCompra: [""],
      lote: [""]
    });

    this.filtroOrdenCompra = this._fb.group({
      for: ['']
    });

    this.filroAnalisisAguja.valueChanges.pipe( debounceTime(750) ).subscribe(
      filtro => {
        this.paginaAnalisisAguja = 1;
        this.ListarAnalisisAgujas(filtro, this.paginaAnalisisAguja)
      }
    );

    this.filtroOrdenCompra.valueChanges.pipe(debounceTime(500)).subscribe(
      filtro => {
        this.paginaOrdenCompra = 1;
        console.log("Orden de compra change");
        this.ListarOrdenCompra(filtro);
      }
    );
  }

  ListarAnalisisAgujas(filtros : object, pagina: number) {

    if (filtros['ordenCompra'] == undefined)
      filtros['ordenCompra'] = ""

    if (filtros['lote'] == undefined)
      filtros['lote'] = ""

    this._esterilizacionService.ListarAnalisis(filtros['ordenCompra'], filtros['lote'], "", pagina).subscribe(
      (data: any) => {
          this.listarAnalisisAguja = data;
          if(this.listarAnalisisAguja.length < 1)
            this._toastr.warning("No se encontraron registros", "Adventencia !!",{timeOut: 2000, closeButton: true});
        }
      )
  }

  ListarOrdenCompra(filtro: object) {

    if(filtro['for'] == undefined)
      filtro['for'] = ''

    this._esterilizacionService.ListarOrdenesCompra(filtro['for'])
      .subscribe((data: any) => {

        this.listaOrdenesCompra = data;

        if (this.listaOrdenesCompra.length == 0)
          this._toastr.warning("No se encontraron registros", "Adventencia !!", { timeOut: 2000, closeButton: true })

        // else {
        //   this.txtNumeroOrden = data[1]?.numeroOrden.trim();
        //   this.txtNombreProveedor = data[0]?.proveedor.trim();
        // }
      }
      );
  }

  PaginaCambiadaListaAnalisis(pagina:number){
    let filtro = this.filroAnalisisAguja.value

    this.ListarAnalisisAgujas(filtro, pagina)
  }

  PaginaCambiadaOrdenCompra(pagina:number){
    let filtro = this.filtroOrdenCompra.value

    this.ListarOrdenCompra(filtro);
  }

  // GenerarListaPruebas(filas): void {
  //   var ciclos=Math.trunc((filas/10));
  //   for(let i=1;i<=ciclos;i++){
  //     this.tablas.push(i);
  //   }
  // }

  // guardar() {
  //   console.log(this.listaCiclos);
  //    var ArrayNumero=[];
  //     for(let i=1; i<=this.tablas.length;i++ ){
  //          var bodytable= document.getElementById(`table${i}`)

  //         for (let index = 1; index < bodytable.child  des.length; index++) {
  //           var inputnumber= parseInt((<HTMLInputElement>document.getElementById(`input${i}${index}`))?.value) == NaN ?  0 : parseInt((<HTMLInputElement>document.getElementById(`input${i}${index}`))?.value);
  //           ArrayNumero.push(inputnumber);

  //         }
  //     }


  //     this.CalculoCiclos(ArrayNumero);
  // }

  // CalculoCiclos(ArrayNumero){
  //     this.listaCiclos.forEach((itemsciclos:any)=>{
  //           let detalleciclo=document.getElementById(itemsciclos.detalle);
  //           console.log((<HTMLInputElement>detalleciclo.childNodes[1]).value);
  //           console.log((<HTMLInputElement>detalleciclo.childNodes[2]).value);
  //     })
  // }

  // ListarCiclos(identificador) {
  //   this.servListaAnalisis.ListarCiclos(identificador)
  //     .subscribe((data: any) => {//aca se puede llenar el modelo
  //       this.listaCiclos = data;//el nombre se usa para llamarlo desde el html con el ngfor
  //     }
  //     )
  // }

  // ListarNumeroAnalisisAgujas() {
  //   this.servListaAnalisis.ListarAnalisis(this.txtNumeroAnalisis)
  //     .subscribe((data: any) => {//aca se puede llenar el modelo
  //       this.txtCntPruebas = data[0]?.canT_PRUEBAS;
  //       this.txtCiclos = data[0]?.ciclos;
  //       this.txtDescripcion = data[0]?.descripcioN_ITEM;

  //       this.GenerarListaPruebas(data[0]?.canT_PRUEBAS);
  //       this.ListarCiclos(data[0]?.coD_PROVEEDOR);
  //     }
  //     )
  // }

  // MatricularLote(secuencia, cantidadRecibida, codProveedor, controlNumero) {
  //   var usuarioSesion = this.sesion.datosPersonales();

  //   const datajson = {
  //     cantidad: this.txtCantidadPruebas,
  //     fechaVencimiento: this.txtFechaVencimiento,
  //     ordenCompra: this.txtNumeroOrden,
  //     secuencia: secuencia,
  //     proveedor: codProveedor,
  //     controlNumero: controlNumero,
  //     usuarioSesion: usuarioSesion.nombres,
  //     codigoUsuario: usuarioSesion.codUsuario
  //   }

  //   if (this.txtCantidadPruebas == 0) {
  //     this.toastr.warning('La Cantidad De Pruebas no puede ser 0', 'Advertencia')
  //   } else {
  //     this.servListaAnalisis.RegistrarControlAgujas(datajson).subscribe(
  //       response => {

  //         if (response != 0) {
  //           this.toastr.warning('No se registro correctamente', 'Advertencia')
  //         } else {
  //           this.toastr.success('Los datos se registraron correctamente', 'Exíto')
  //           //this.toastr.warning('You are being warned.', 'Alert!');

  //           this.txtCantidadPruebas = 0;
  //           this.ListarOrdenCompra();
  //         }

  //       })
  //   }
  // }

}
