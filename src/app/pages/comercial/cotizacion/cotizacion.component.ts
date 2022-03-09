import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { CotizacionData } from '@data/interface/Request/Cotizacion.interface';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SesionService } from '@shared/services/comunes/sesion.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  vistaDetalle: Boolean = false;
  FormatoNoEncontrado: Boolean = false;
  IdFormato: Number;
  NroDocumento: String;
  pagina: Number = 1
  pageSize: Number = 10;
  page: Number = 1;
  dropdownSettings = {};

  //para editar
  Formulario: FormGroup;



  listaCotizaciones: CotizacionData[] = [
    {
      "idFormato": 12,
      "numeroDocumento": "0000019372",
      "clienteNombre": "CLINICA ESPECIALIZADA EMANUEL SOCIEDAD ANONIMA CERRADA",
      "clienteRUC": "20601681898",
      "clienteDireccion": "CAL. LAS AZUCENAS 203 (PLAZA JOSE A. QUIÑONES)",
      "contacto": "Logistica"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019371",
      "clienteNombre": "SUTUMED CORPORATION",
      "clienteRUC": "90000000168",
      "clienteDireccion": "9280 COLLEGE PKWAY, UNIT #5, FORT MYERS FL 33919",
      "contacto": "QIHAN ZHAI"
    },
    {
      "idFormato": 5,
      "numeroDocumento": "0000019370",
      "clienteNombre": "SEGURO SOCIAL DE SALUD ESSALUD-RED PRESTACIONAL ALMENARA",
      "clienteRUC": "20131257750",
      "clienteDireccion": "AV. GRAU No. 800",
      "contacto": "Ismael Lopez"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019369",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019368",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019367",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019366",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019365",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019364",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    },
    {
      "idFormato": 12,
      "numeroDocumento": "0000019363",
      "clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
      "clienteRUC": "20162041291",
      "clienteDireccion": "AV.MIGUEL IGLESIAS 968",
      "contacto": "Paddy Pella Jimenez - Programación"
    }
  ]
  
  ListCamposCabecera:Object[]=[{
		"codCampo": 1,
		"etiqueta": "Razón Social",
		"columnaResp": "Prov_RazonSocial",
		"tipoDato": "STRING",
		"requerido": true,
		"valorDefecto": "UNILENE S.A.C."
	}, {
		"codCampo": 2,
		"etiqueta": "RUC",
		"columnaResp": "Prov_Ruc",
		"tipoDato": "STRING",
		"requerido": true,
		"valorDefecto": "20197705249"
	}, {
		"codCampo": 3,
		"etiqueta": "Direccion",
		"columnaResp": "Prov_Direccion",
		"tipoDato": "STRING",
		"requerido": true,
		"valorDefecto": "JR. NAPO N. 450 BREÑA"
	}, {
		"codCampo": 4,
		"etiqueta": "E-Mail",
		"columnaResp": "Prov_Correo",
		"tipoDato": "NUMBER",
		"requerido": true,
		"valorDefecto": "contactenos@unilene.com"
	}, {
		"codCampo": 5,
		"etiqueta": "N° Cotización",
		"columnaResp": "Prov_NroCotizacion",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 6,
		"etiqueta": "Teléfono",
		"columnaResp": "Prov_Telefono",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 7,
		"etiqueta": "Fax",
		"columnaResp": "Prov_Fax",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "748-7006"
	}, {
		"codCampo": 8,
		"etiqueta": "N° Vigencia de oferta",
		"columnaResp": "Prov_Vigencia",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 9,
		"etiqueta": "N° Fecha",
		"columnaResp": "Prov_Fecha",
		"tipoDato": "DATE",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 10,
		"etiqueta": "Datos adicionales",
		"columnaResp": "Prov_DatosAdicionales",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "contactenos@unilene.com"
	}, {
		"codCampo": 11,
		"etiqueta": "Contacto",
		"columnaResp": "Prov_Contacto",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "Dalia Chapoñan"
	}, {
		"codCampo": 12,
		"etiqueta": "Cargo",
		"columnaResp": "Prov_Cargo",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "REPRESENTANTE DE VENTAS"
	}, {
		"codCampo": 13,
		"etiqueta": "Teléfono",
		"columnaResp": "Prov_Celular",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "969713326"
	}, {
		"codCampo": 14,
		"etiqueta": "E-Mail",
		"columnaResp": "Prov_Email",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "sabrinapalomino@unilene.com"
	}, {
		"codCampo": 15,
		"etiqueta": "Área usuario",
		"columnaResp": "Soli_AreaSolicitante",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 16,
		"etiqueta": "Contacto - Programación",
		"columnaResp": "Soli_Contacto",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 17,
		"etiqueta": "E-Mail",
		"columnaResp": "Soli_Correo",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "externo.cbonilla@essalud.gob.pe"
	}, {
		"codCampo": 18,
		"etiqueta": "Teléfono",
		"columnaResp": "Soli_Telefono",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "Av. Grau N° 800, La Victoria"
	}, {
		"codCampo": 19,
		"etiqueta": "Observaciones",
		"columnaResp": "Foot_Observaciones",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "Todos los ítems deberán de remitirse con sus respectivas especificaciones técnicas del producto, dentro de la cotización del proveedor o en hoja adjunta con firma del representante"
	}, {
		"codCampo": 20,
		"etiqueta": "Firma",
		"columnaResp": "Foot_Firma",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "FIRMA DEL REPRESENTANTE LEGAL DE LA EMPRESA"
	}, {
		"codCampo": 21,
		"etiqueta": "Total",
		"columnaResp": "Total",
		"tipoDato": "NUMBER",
		"requerido": false,
		"valorDefecto": null
	}];

  ListCabeceraDetalle:Object[]=[];

  ListDetalle:Object[]=[{
		"codCampo": 1,
		"etiqueta": "N° Item",
		"columnaResp": "NroItem",
		"tipoDato": "NUMBER",
		"requerido": true,
		"valorDefecto": null
	}, {
		"codCampo": 2,
		"etiqueta": "Código SAP",
		"columnaResp": "CodigoSAP",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 3,
		"etiqueta": "Denominación",
		"columnaResp": "Denominacion",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 4,
		"etiqueta": "Unidad de medida",
		"columnaResp": "UndMedida",
		"tipoDato": "STRING",
		"requerido": true,
		"valorDefecto": "Und"
	}, {
		"codCampo": 5,
		"etiqueta": "Cant. Total",
		"columnaResp": "CantidadTotal",
		"tipoDato": "NUMBER",
		"requerido": true,
		"valorDefecto": null
	}, {
		"codCampo": 6,
		"etiqueta": "Marca",
		"columnaResp": "Marca",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 7,
		"etiqueta": "Procedencia",
		"columnaResp": "PaisProcedencia",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "PERÚ"
	}, {
		"codCampo": 8,
		"etiqueta": "Presentación",
		"columnaResp": "Presentacion",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 9,
		"etiqueta": "Modelo",
		"columnaResp": "Modelo",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 10,
		"etiqueta": "RNP VIGENTE",
		"columnaResp": "RnpVigente",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 11,
		"etiqueta": "Vigencia 24 meses",
		"columnaResp": "VigenciaMinima",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI Mayor a  18 meses Garantía 03 años"
	}, {
		"codCampo": 12,
		"etiqueta": "Cumple denominación",
		"columnaResp": "CumpleDenominacionItem",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 13,
		"etiqueta": "Presentación en español",
		"columnaResp": "CartaPresentacion",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 14,
		"etiqueta": "R.S. Vigente",
		"columnaResp": "RegistroSanitario",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 15,
		"etiqueta": "Certificado de Análisis",
		"columnaResp": "CertificadoAnalisis",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 16,
		"etiqueta": "Cumple Esp. Técnicas",
		"columnaResp": "CumpleEspecificacionTec",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 17,
		"etiqueta": "B.P. Almacenamiento",
		"columnaResp": "PracticaAlmacenamiento",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 18,
		"etiqueta": "B.P. Manufactura",
		"columnaResp": "PracticaManufactura",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 19,
		"etiqueta": "Aten. a lo solicitado",
		"columnaResp": "CapacidadAtencion",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": "SI"
	}, {
		"codCampo": 20,
		"etiqueta": "Plazo de entrega",
		"columnaResp": "PlazoEntrega",
		"tipoDato": "STRING",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 21,
		"etiqueta": "Precio unitario",
		"columnaResp": "PrecioUnitario",
		"tipoDato": "NUMBER",
		"requerido": false,
		"valorDefecto": null
	}, {
		"codCampo": 22,
		"etiqueta": "Valor Total",
		"columnaResp": "ValorTotal",
		"tipoDato": "NUMBER",
		"requerido": false,
		"valorDefecto": null
	}]


  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente: true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  }

  constructor(private modalService: NgbModal,
    private _sesionService: SesionService,
    private _cotizacionService: CotizacionService,
    private _fb: FormBuilder) {

      this.Formulario = this._fb.group({
        cabecera: new FormArray([]),
        detalle: new FormArray([]),
      })
  }

  ngOnInit(): void {
    this.paginador = {
      "paginaActual": 1,
      "totalPaginas": 1919,
      "registroPorPagina": 10,
      "totalRegistros": 19185,
      "siguiente": true,
      "anterior": false,
      "primeraPagina": false,
      "ultimaPagina": true
    };


  }


  // Editar Cotizacion 
  Editar(idFormato, numeroDocumento) {
    if (idFormato == 0) {
      this.FormatoNoEncontrado = true;
    }
    else {
      this.FormatoNoEncontrado = false;
      this.vistaDetalle = true;
      this.IdFormato = idFormato;
      this.NroDocumento = numeroDocumento;

      const body = {
        IdFormato: parseInt(idFormato),
        NumeroDocumento: numeroDocumento
      }

      this._cotizacionService.ObtenerEstructuraFormato(body).subscribe(resp => {
        var data = resp;
        this.ConstruirDetalle(data);
      });

    }
  }

  ConstruirDetalle(data) {
    
    // cabecera (informacion)
    this.ListCamposCabecera.forEach(element => {
      let FormularioCabecera = this.Formulario.get('cabecera') as FormArray;
        FormularioCabecera.push(this.CrearCabeceraItem(element));
    });

    //cabeceradetalle
    this.ListCabeceraDetalle= this.ListDetalle.map((items:any)=>({ valorCabecera: items.etiqueta}))
  
	this.FormArrayDetalle(this.ListDetalle);

    console.log(this.Formulario.value);
  }


  //creamos el array de cabecera 
  CrearCabeceraItem(itemCabecera): FormGroup {
    const {codCampo,columnaResp,etiqueta,requerido,tipoDato,valorDefecto} = itemCabecera;

    return this._fb.group({
      codCampo : codCampo,
      columnaResp: columnaResp,
      etiqueta: etiqueta,
      requerido: requerido,
      tipoDato: tipoDato,
      valorDefecto: [valorDefecto, requerido == true ? Validators.required : null]
    });
  }

  //Creamos el array de Detalle
  FormArrayDetalle(ListDetalle){
	let Detalle =<FormArray> this.Formulario.controls["detalle"];
		Detalle.push(this.CrearDetalle(ListDetalle))
  }


  CrearDetalle(ListDetalle) : FormGroup {
	  let variableDetalle:object={};
	//  ListDetalle.forEach(element=>{
	// 	variableDetalle[element.columnaResp]='',
	//  });
	
	 console.log(variableDetalle); 

	return this._fb.group([]);
  }

  GenerarCotizacion(modal: NgbModal) {
      
  }

  CancelEdit() {
    this.vistaDetalle = false;
  }
}
