import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { EsterilizacionService } from '@data/services/backEnd/pages/esterilizacion.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-frm-control-aguja',
  templateUrl: './frm-control-aguja.component.html'
})
export class FrmControlAgujaComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  txtOrden: string = '';
  txtCantidadPruebas: number = 0;
  txtFechaVencimiento: Date;
  txtNumeroOrden: string = '';
  txtNombreProveedor: string = '';
  listaOrdenesCompra: Object[] = [];
  listarAnalisisAguja: object[] = [];
  listaCiclos: object[] = [];
  datosMatricula: object[] = [];
  //---------------------------------------
tablas=[];
  //Campos form 3 - registro de pruebas
  txtNumeroAnalisis: string = 'AG-1318-22';
  txtCntPruebas: string = '';
  txtCiclos: string = '';
  txtDescripcion: string = '';
  txtFechaAnalisis: Date;
  date: any;

  constructor(
    private http: HttpClient,
    private servListaOrdenes: EsterilizacionService,
    private servListaAnalisis: EsterilizacionService,

    private sesion: SesionService,
    private toastr: ToastrService,
  ) {
    //let now2 = moment().format("YYYY-MM-DD");
    // this.txtFechaVencimiento = now2;
    // this.txtFechaAnalisis = now2;
    //console.log(sesion.datosPersonales().codUsuario)
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };

    this.ListarAnalisisAgujas();
  }



  GenerarListaPruebas(filas): void {
    var ciclos=Math.trunc((filas/10));
    for(let i=1;i<=ciclos;i++){
      this.tablas.push(i);
    }
  }

  guardar() {
    console.log(this.listaCiclos);
     var ArrayNumero=[];
      for(let i=1; i<=this.tablas.length;i++ ){
           var bodytable= document.getElementById(`table${i}`)

          for (let index = 1; index < bodytable.childNodes.length; index++) {
            var inputnumber= parseInt((<HTMLInputElement>document.getElementById(`input${i}${index}`))?.value) == NaN ?  0 : parseInt((<HTMLInputElement>document.getElementById(`input${i}${index}`))?.value);
            ArrayNumero.push(inputnumber);
            
          }
      }

      
      this.CalculoCiclos(ArrayNumero);
  }

  CalculoCiclos(ArrayNumero){
      this.listaCiclos.forEach((itemsciclos:any)=>{
            let detalleciclo=document.getElementById(itemsciclos.detalle);
             
            console.log((<HTMLInputElement>detalleciclo.childNodes[1]).value);
            console.log((<HTMLInputElement>detalleciclo.childNodes[2]).value);
            // let valormaximo = (<HTMLInputElement>document.getElementById("valormaximo")).value;
            // let valorminimo = (<HTMLInputElement>document.getElementById("valorminimo")).value;

            // console.log(valormaximo,valorminimo);
      })
  }

  ListarCiclos(identificador) {
    this.servListaAnalisis.ListarCiclos(identificador)
      .subscribe((data: any) => {//aca se puede llenar el modelo
        this.listaCiclos = data;//el nombre se usa para llamarlo desde el html con el ngfor
      }
      )
  }


  ListarAnalisisAgujas() {
    this.servListaAnalisis.ListarAnalisis("")
      .subscribe((data: any) => {//aca se puede llenar el modelo
        this.listarAnalisisAguja = data;//el nombre se usa para llamarlo desde el html con el ngfor
      }
      )
  }

  ListarNumeroAnalisisAgujas() {
    this.servListaAnalisis.ListarAnalisis(this.txtNumeroAnalisis)
      .subscribe((data: any) => {//aca se puede llenar el modelo
        this.txtCntPruebas = data[0]?.canT_PRUEBAS;
        this.txtCiclos = data[0]?.ciclos;
        this.txtDescripcion = data[0]?.descripcioN_ITEM;

        this.GenerarListaPruebas(data[0]?.canT_PRUEBAS);
        this.ListarCiclos(data[0]?.coD_PROVEEDOR);
      }
      )
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ListarOrdenCompra() {
    this.servListaOrdenes.ListarOrdenesCompra(this.txtOrden)
      .subscribe((data: any) => {//aca se puede llenar el modelo
        this.listaOrdenesCompra = data;
        if (this.listaOrdenesCompra.length == 0) {
          this.toastr.warning('No se encontraron datos', 'Advertencia')
        } else {
          this.txtNumeroOrden = data[1]?.numeroOrden.trim();
          this.txtNombreProveedor = data[0]?.proveedor.trim();
        }
      }
      );
  }

  MatricularLote(secuencia, cantidadRecibida, codProveedor, controlNumero) {
    var usuarioSesion = this.sesion.datosPersonales();

    const datajson = {
      cantidad: this.txtCantidadPruebas,
      fechaVencimiento: this.txtFechaVencimiento,
      ordenCompra: this.txtNumeroOrden,
      secuencia: secuencia,
      proveedor: codProveedor,
      controlNumero: controlNumero,
      usuarioSesion: usuarioSesion.nombres,
      codigoUsuario: usuarioSesion.codUsuario
    }

    if (this.txtCantidadPruebas == 0) {
      this.toastr.warning('La Cantidad De Pruebas no puede ser 0', 'Advertencia')
    } else {
      this.servListaAnalisis.RegistrarControlAgujas(datajson).subscribe(
        response => {

          if (response != 0) {
            this.toastr.warning('No se registro correctamente', 'Advertencia')
          } else {
            this.toastr.success('Los datos se registraron correctamente', 'Exíto')
            //this.toastr.warning('You are being warned.', 'Alert!');

            this.txtCantidadPruebas = 0;
            this.ListarOrdenCompra();
          }

        })
    }
  }


}
