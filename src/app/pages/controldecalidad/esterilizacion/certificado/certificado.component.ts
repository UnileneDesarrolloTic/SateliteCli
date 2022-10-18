import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CertificadoData } from "@data/interface/Request/Certificado.interface";
import { LoteData } from "@data/interface/Request/Lote.interface";
import { EsterilizacionService } from "@data/services/backEnd/pages/esterilizacion.service";
import { Component, OnInit } from "@angular/core";
import { Paginado } from "@data/interface/Comodin/Paginado.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericoService } from "@shared/services/comunes/generico.service";
import { DatePipe } from "@angular/common";
import { CryptoService } from "@shared/services/comunes/crypto.service";
import { saveAs } from "file-saver";
import { SesionService } from "@shared/services/comunes/sesion.service";
import { UsuarioSesionData } from "@data/interface/Response/UsuarioSesionDara.interface";

@Component({
  selector: "app-certificado",
  templateUrl: "./certificado.component.html"
})
export class CertificadoComponent implements OnInit {
  modalLote: any;
  modalCertificado: any;

  formulario: FormGroup;
  formularioCertificado: FormGroup;
  formularioLote: FormGroup;
  formularioLoteDetalle: FormGroup;
  listaCertificados: CertificadoData[] = [];
  listaLotes: LoteData[] = [];
  loteMaestro: boolean = true;
  OpcionesEquipo: boolean = false;
  OpcionB300: boolean = true;

  //Variables de paginación
  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente: true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false,
  };

  pagina: Number = 1;
  pageSize: Number = 10;
  page: Number = 1;
  dropdownSettings = {};
  mostrarTextValidPass: boolean = false;

  constructor(
    private _esterilizacionService: EsterilizacionService,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private genericoServices: GenericoService,
    private _cryptoService: CryptoService,
    private _sesionService: SesionService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.FiltrarLotes();
    this.filtrarCertificados();
  }
  crearFormulario() {
    this.formulario = this._fb.group({
      ordenServicio: [""],
    });

    this.formularioCertificado = this._fb.group({
      codigoCertificado: [{ value: "", disabled: true }],
      fechaEmision: ["", [Validators.required]],
      ordenServicio: ["", [Validators.required]],
      cliente: ["", [Validators.required]],
      lote: ["", [Validators.required]],
      producto: ["", [Validators.required]],
      marca: ["", [Validators.required]],
      cantidad: ["", [Validators.required]],
      renombrarBio300: [""],
      fechaInicio: ["", [Validators.required]],
      fechaTermino: ["", [Validators.required]],
      metodoEsterilizacion: ["", [Validators.required]],
      temperaturaProceso: ["", [Validators.required]],
      tiempoAireacion: ["", [Validators.required]],
      tiempoExposicion: ["", [Validators.required]],
      hrProceso: ["", [Validators.required]],

      descripcion_21: ["", [Validators.required]],
      lote_21: ["", [Validators.required]],
      expira_21: ["", [Validators.required]],
      resultado_21: ["", [Validators.required]],
      loteId_21: [""],

      descripcion_22: ["", [Validators.required]],
      lote_22: ["", [Validators.required]],
      expira_22: ["", [Validators.required]],
      resultado_22: ["", [Validators.required]],
      loteId_22: [""],

      modelo_23: ["", [Validators.required]],
      codigo_23: ["", [Validators.required]],
      resultado_23: ["", [Validators.required]],

      tipo_24: ["", [Validators.required]],
      iaCodigo_24: ["", [Validators.required]],
      descripcion_24: ["", [Validators.required]],
      lote_24: ["", [Validators.required]],
      expira_24: ["", [Validators.required]],
      loteId_24: [""],
      ibExpuestos_24: ["", [Validators.required]],
      ibExpuestosResultado_24: ["", [Validators.required]],
      ibNoExpuestos_24: ["", [Validators.required]],
      ibNoExpuestosResultado_24: ["", [Validators.required]],
      conclusion_24: ["", [Validators.required]],
      opcion: [""],
      observacion: ["", [Validators.required]],

      motivo: [""],
    });

    this.formularioLote = this._fb.group({
      descripcion: ["", Validators.required],
      identificador: [0],
    });

    this.formularioLoteDetalle = this._fb.group({
      descripcionDetalleLote: [""],
      loteDetalleLote: [""],
      expiraDetalleLote: [""],
    });
  }

  cambioPagina(paginaCambiada: Number) {
    this.pagina = paginaCambiada;
    this.filtrarCertificados();
  }

  CambioEquipo() {
    var equipo = <HTMLSelectElement>document.getElementById("equipo");
    var equipoSelected = equipo.value;
    var tiempoAireacion = <HTMLInputElement>(
      document.getElementById("tiempoAireacion")
    );
    var taUnidadMedida = <HTMLSelectElement>(
      document.getElementById("taUnidadMedida")
    );
    var tiempoExposicion = <HTMLInputElement>(
      document.getElementById("tiempoExposicion")
    );
    var teUnidadMedida = <HTMLSelectElement>(
      document.getElementById("teUnidadMedida")
    );

    //BIO 300 --> 1
    //HMQ-0.5 --> 2
    //ARH-750 --> 3
    if (equipoSelected == "1") {
      this.OpcionesEquipo = false;
      this.OpcionB300 = true;
      this.formularioCertificado.patchValue({
        tiempoAireacion: 4,
        tiempoExposicion: 12,
        renombrarBio300: "BIO 300",
      });

      tiempoAireacion.readOnly = true;

      tiempoExposicion.readOnly = true;

      taUnidadMedida.value = "horas";
      taUnidadMedida.disabled = true;

      teUnidadMedida.value = "horas";
      teUnidadMedida.disabled = true;
    } else if (equipoSelected == "2") {
      this.OpcionB300 = false;
      this.OpcionesEquipo = true;
      this.formularioCertificado.patchValue({
        renombrarBio300: "",
        tiempoAireacion: 50,
        tiempoExposicion: 180,
        temperaturaProceso: "54 °C ± 6 °C",
        hrProceso: "",
      });

      tiempoAireacion.readOnly = true;
      tiempoExposicion.readOnly = true;
      taUnidadMedida.value = "remociones";
      taUnidadMedida.disabled = true;
      teUnidadMedida.value = "minutos";
      teUnidadMedida.disabled = true;
      setTimeout(function () {
        (<HTMLInputElement>document.getElementById("opcion1")).checked = true;
      }, 100);
    } else {
      this.OpcionesEquipo = false;
      this.OpcionB300 = false;
      this.formularioCertificado.patchValue({
        tiempoAireacion: 30,
        tiempoExposicion: 180,
        renombrarBio300: "",
        temperaturaProceso: "54 °C ± 6 °C",
        hrProceso: 55,
      });

      tiempoAireacion.readOnly = true;

      tiempoExposicion.readOnly = true;

      taUnidadMedida.value = "remociones";
      taUnidadMedida.disabled = true;

      teUnidadMedida.value = "minutos";
      teUnidadMedida.disabled = true;
    }
  }

  IniciarModal() {
    var tiempoAireacion = <HTMLInputElement>(
      document.getElementById("tiempoAireacion")
    );
    var taUnidadMedida = <HTMLSelectElement>(
      document.getElementById("taUnidadMedida")
    );
    var tiempoExposicion = <HTMLInputElement>(
      document.getElementById("tiempoExposicion")
    );
    var teUnidadMedida = <HTMLSelectElement>(
      document.getElementById("teUnidadMedida")
    );

    tiempoAireacion.value = "4";
    tiempoAireacion.readOnly = true;

    tiempoExposicion.value = "12";
    tiempoExposicion.readOnly = true;

    taUnidadMedida.value = "horas";
    taUnidadMedida.disabled = true;

    teUnidadMedida.value = "horas";
    teUnidadMedida.disabled = true;
  }

  nuevoCertificado() {
    
    var taUnidadMedida = <HTMLSelectElement>(
      document.getElementById("taUnidadMedida")
    );
    var teUnidadMedida = <HTMLSelectElement>(
      document.getElementById("teUnidadMedida")
    );
    var cantidadUnidadMedida = <HTMLSelectElement>(
      document.getElementById("cantidadUnidadMedida")
    );

    var DropdownList = document.getElementById("equipo") as HTMLSelectElement;
    var textoEquipo = DropdownList.options[DropdownList.selectedIndex].text;
    if (textoEquipo == "BIO 300") {
      textoEquipo = this.formularioCertificado.get("renombrarBio300").value;
    }
    const datosUsuario: UsuarioSesionData =
      this._sesionService.datosPersonales();
    const body = {
      Id: 0,
      CodigoCertificado: "",
      FechaEmision: this.formularioCertificado.get("fechaEmision").value,
      OrdenServicio: this.formularioCertificado.get("ordenServicio").value,
      Cliente: this.formularioCertificado.get("cliente").value,
      Lote: this.formularioCertificado.get("lote").value,
      Producto: this.formularioCertificado.get("producto").value,
      Marca: this.formularioCertificado.get("marca").value,
      Cantidad: this.formularioCertificado.get("cantidad").value,
      Equipo: textoEquipo,
      CantidadUnidadMedida: cantidadUnidadMedida.value,
      Estado: "A",
      FechaInicio: this.formularioCertificado.get("fechaInicio").value,
      FechaTermino: this.formularioCertificado.get("fechaTermino").value,
      Metodo: this.formularioCertificado.get("metodoEsterilizacion").value,
      Temperatura: this.formularioCertificado.get("temperaturaProceso").value,
      TiempoAireacion: this.formularioCertificado.get("tiempoAireacion").value,
      TiempoAireacionUnidadMedida: taUnidadMedida.value,
      TiempoExposicion:
        this.formularioCertificado.get("tiempoExposicion").value,
      TiempoExposicionUnidadMedida: teUnidadMedida.value,
      HRProceso: this.formularioCertificado.get("hrProceso").value,
      Observaciones: this.formularioCertificado.get("observacion").value,
      Conclusion:
        "Los resultados obtenidos tras el proceso de esterilización son CONFORMES   , por tanto, se concluye que el material se encuentra ESTÉRIL.",
      Usuario: datosUsuario.codUsuario.toString(),
      IDLoteCintaTestigo: parseInt(
        this.formularioCertificado.get("loteId_21").value
      ),
      IDLoteIndicadorQuimico: parseInt(
        this.formularioCertificado.get("loteId_22").value
      ),
      ConformeCintaTestigo:
        this.formularioCertificado.get("resultado_21").value == "C"
          ? true
          : false,
      ConformeIndicadorQuimico:
        this.formularioCertificado.get("resultado_22").value == "C"
          ? true
          : false,
      ModeloTrazasOE: this.formularioCertificado.get("modelo_23").value,
      CodigoTrazasOE: this.formularioCertificado.get("codigo_23").value,
      ConformeTrazasOE:
        this.formularioCertificado.get("resultado_23").value == "C"
          ? true
          : false,
      TipoIB: this.formularioCertificado.get("tipo_24").value,
      CodigoIB: this.formularioCertificado.get("iaCodigo_24").value,
      IDLoteIB: parseInt(this.formularioCertificado.get("loteId_24").value),
      // DescripcionIB: this.formularioCertificado.get('descripcion_24').value,
      // LoteIB: this.formularioCertificado.get('lote_24').value,
      // ExpiraIB: this.formularioCertificado.get('expira_24').value,

      IBExpuestos: this.formularioCertificado.get("ibExpuestos_24").value,
      IBExpuestosResultado:
        this.formularioCertificado.get("ibExpuestosResultado_24").value == "N"
          ? false
          : true,
      IBNoExpuestos: this.formularioCertificado.get("ibNoExpuestos_24").value,
      IBNoExpuestosResultado:
        this.formularioCertificado.get("ibNoExpuestosResultado_24").value == "N"
          ? false
          : true,
      ConformeIB:
        this.formularioCertificado.get("conclusion_24").value == "C"
          ? true
          : false,
    };
    this._esterilizacionService.RegistrarCertificado(body).subscribe((resp) => {
      this.modalCertificado.close();
      this.filtrarCertificados();
    });

    //}
  }

  filtrarCertificados() 
  {
    const body = {
      OrdenServicio: this.formulario.get("ordenServicio").value,
      Codigo: null,
      Pagina: this.pagina,
      RegistrosPorPagina: 10,
    };

    this._esterilizacionService.ListarCertificados(body).subscribe(
      (resp) => {
        this.listaCertificados = resp["contenido"];
        this.paginador = resp["paginado"];
      }
    );
  }

  GenerarReporte(id) {
    const body = {
      Id: id,
    };
    var base64 = "";
    this._esterilizacionService.GenerarReporte(body).subscribe((resp) => {
      base64 = resp["content"];
      this.downloadFile(base64, "certificado.pdf");
    });
  }

  base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  downloadFile(b64encodedString: string, name: string) {
    if (b64encodedString) {
      var blob = this.base64ToBlob(b64encodedString, "text/plain");
      saveAs(blob, name);
    }
  }

  abrirModalLote(modal: NgbModal, identificador) 
  {
    this.formularioLote.reset();

    this.formularioLote.patchValue({
      identificador: identificador,
      descripcion: "",
    });

    this.modalLote = this.modalService.open(modal, {
      centered: true,
      backdrop: "static",
      size: "lg",
      scrollable: true,
    });

    this.FiltrarLotes();
  }

  CambioIB(e) {
    if (e.value == "C") {
      this.formularioCertificado.patchValue({
        iaCodigo_24: "CCIC-08",
      });
    }
    if (e.value == "L") {
      this.formularioCertificado.patchValue({
        iaCodigo_24: "CCIC-09",
      });
    }
  }

  CambioOP(e) {
    var tiempoAireacion = <HTMLInputElement>(
      document.getElementById("tiempoAireacion")
    );
    var taUnidadMedida = <HTMLSelectElement>(
      document.getElementById("taUnidadMedida")
    );
    var tiempoExposicion = <HTMLInputElement>(
      document.getElementById("tiempoExposicion")
    );
    var teUnidadMedida = <HTMLSelectElement>(
      document.getElementById("teUnidadMedida")
    );
    if (e.value == "op1") {
      this.formularioCertificado.patchValue({
        tiempoAireacion: 50,
        tiempoExposicion: 180,
        temperaturaProceso: "54 °C ± 6 °C",
      });

      tiempoAireacion.readOnly = true;
      tiempoExposicion.readOnly = true;
      taUnidadMedida.value = "remociones";
      taUnidadMedida.disabled = true;
      teUnidadMedida.value = "minutos";
      teUnidadMedida.disabled = true;
    }
    if (e.value == "op2") {
      this.formularioCertificado.patchValue({
        tiempoAireacion: 8,
        tiempoExposicion: 240,
        temperaturaProceso: "52 °C ± 6 °C",
        hrProceso: 55,
      });

      tiempoAireacion.readOnly = true;
      tiempoExposicion.readOnly = true;
      taUnidadMedida.value = "horas";
      taUnidadMedida.disabled = true;
      teUnidadMedida.value = "minutos";
      teUnidadMedida.disabled = true;
    }
  }

  FiltrarLotes() 
  {
    const body = {
      Descripcion: this.formularioLote.get("descripcion").value,
      Identificador: this.formularioLote.get("identificador").value,
      Pagina: this.pagina,
      RegistrosPorPagina: 10,
    };

    this._esterilizacionService.ListarLotes(body).subscribe(
      (resp) => 
      {
        this.listaLotes = resp["contenido"];
        this.paginador = resp["paginado"];
      }
    );
  }

  NuevoLote() {
    this.loteMaestro = false;
    this.formularioLoteDetalle.reset();
  }

  RegistrarLote() {
    const body = {
      Descripcion: this.formularioLoteDetalle.get("descripcionDetalleLote")
        .value,
      Lote: this.formularioLoteDetalle.get("loteDetalleLote").value,
      Expira: this.formularioLoteDetalle.get("expiraDetalleLote").value,
      Identificador: this.formularioLote.get("identificador").value,
    };

    this._esterilizacionService.RegistrarLote(body).subscribe((resp) => {
      this.CerrarDetalle();
      this.FiltrarLotes();
    });
  }

  CerrarDetalle() {
    this.loteMaestro = true;
  }

  ObtenerLote(modal: NgbModal, lote) {
    var identificador = this.formularioLote.get("identificador").value;
    if (identificador == 1) {
      this.formularioCertificado.patchValue({
        descripcion_21: lote.descripcion,
        lote_21: lote.lote,
        expira_21: lote.expira,
        loteId_21: lote.id,
      });
    }

    if (identificador == 2) {
      this.formularioCertificado.patchValue({
        descripcion_22: lote.descripcion,
        lote_22: lote.lote,
        expira_22: lote.expira,
        loteId_22: lote.id,
      });
    }

    if (identificador == 3) {
      this.formularioCertificado.patchValue({
        descripcion_24: lote.descripcion,
        lote_24: lote.lote,
        expira_24: lote.expira,
        loteId_24: lote.id,
      });
    }
    this.modalLote.close();
  }

  abrirModal(modal: NgbModal) 
  {
    this.OpcionesEquipo = false;
    this.OpcionB300 = true;
    this.formularioCertificado.reset();

    var ultimoCertificado = this.listaCertificados[this.listaCertificados.length - 1];

    if (ultimoCertificado == null || ultimoCertificado == undefined) 
    {
      var descripcion21 = "";
      var lote21 = "";
      var expira21 = "";

      var descripcion22 = "";
      var lote22 = "";
      var expira22 = "";

      var lote24 = "";
      var expira24 = "";
    } 
    else {
      
      var descripcion21 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteCintaTestigo
        )?.descripcion;

      var lote21 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteCintaTestigo
        )?.lote;

      var expira21 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteCintaTestigo
        )?.expira;

      var id21 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteCintaTestigo
        )?.id;

      var descripcion22 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteIndicadorQuimico
        )?.descripcion;

      var lote22 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteIndicadorQuimico
        )?.lote;

      var expira22 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteIndicadorQuimico
        )?.expira;

      var id22 = this.listaLotes.find(
          (x) => x.id == ultimoCertificado.idLoteIndicadorQuimico
        )?.id;

      var lote24 = this.listaLotes.find(
        (x) => x.id == ultimoCertificado.idLoteIB
      )?.lote;
      var expira24 = this.listaLotes.find(
        (x) => x.id == ultimoCertificado.idLoteIB
      )?.expira;
      var id24 = this.listaLotes.find(
        (x) => x.id == ultimoCertificado.idLoteIB
      )?.id;
    }

    this.formularioCertificado.patchValue({
      resultado_21: "C",
      resultado_22: "C",
      resultado_23: "C",
      conclusion_24: "C",
      ibExpuestosResultado_24: "N",
      ibNoExpuestosResultado_24: "P",
      descripcion_21: descripcion21,
      lote_21: lote21,
      expira_21: expira21,
      descripcion_22: descripcion22,  
      lote_22: lote22,
      expira_22: expira22,
      descripcion_24: '',
      lote_24: lote24,
      expira_24: expira24,
      loteId_21: id21,
      loteId_22: id22,
      loteId_24: id24,
      tiempoAireacion: 4,
      tiempoExposicion: 12,
      metodoEsterilizacion: "EXPOSICIÓN AL ÓXIDO DE ETILENO (ETO) A BAJA TEMPERATURA",
      producto: "Material Médico Diverso",
      modelo_23: "GAXT-E-DL",
      codigo_23: "DE-003",
      renombrarBio300: "BIO 300",
    });

    this.modalCertificado = this.modalService.open(modal, {
      centered: true,
      backdrop: "static",
      size: "xl",
      scrollable: true,
    });
    this.IniciarModal();
  }
}
