import { RolData } from '@data/interface/Response/RolData.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioData } from '@data/interface/Request/Usuario.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { TipoDocumentoIdentidad } from '@data/interface/Request/TipoDocumentoIdentidad.interface';
import { Pais } from '@data/interface/Request/Pais.interface';
import { DatePipe } from '@angular/common';
import { CryptoService } from '@shared/services/comunes/crypto.service';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html'
})
export class ListarUsuarioComponent implements OnInit {

  formulario: FormGroup
  formularioUsuario: FormGroup
  formulariosPassword: FormGroup
  listaUsuarios: UsuarioData[] = []

  //Variables de paginación
  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  }

  pagina: Number = 1
  pageSize: Number = 10;
  page: Number =1;

  //Valiables de combos
  listaTipoDocumentos: TipoDocumentoIdentidad[]
  listaPaises: Pais[]

  //multiselect oficial
  listaRoles: RolData[]
  dropdownSettings = {};
  mostrarTextValidPass: boolean = false

  constructor(private _usuarioService: UsuarioService, private _fb: FormBuilder, private modalService: NgbModal,
      private genericoServices: GenericoService, private datePipe: DatePipe, private _cryptoService: CryptoService,)
  {
    this.crearFormulario();
  }

  ngOnInit(): void {

    this.filtrarUsuario()
    this.obtenerRoles()

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'codigo',
      textField: 'titulo',
      enableCheckAll: false,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar Rol'
    };
  }

  cargarCombos(){
    this.genericoServices.listarPaises().subscribe( resp => {
      this.listaPaises = resp
    })

    this.genericoServices.listarTipoDocumentoIdentidad().subscribe( resp => {
      this.listaTipoDocumentos =  resp
    })
  }

  crearFormulario(){

    this.formulario = this._fb.group({
      nombre : [''],
      documento: ['']
      //registroPorPagina: ['', Validators.required]
    })

    this.formularioUsuario = this._fb.group({
      codigoUsuario: [{value: '', disabled: true}],
      nombreUsuario: [{value: '', disabled: true}],
      apellidoPaterno: [{value: '', disabled: true}],
      apellidoMaterno: [{value: '', disabled: true}],
      tipoDocumento: [{value: '', disabled: true}],
      nroDocumento: [{value: '', disabled: true}],
      estado: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      genero: [{value: '', disabled: true}],
      pais: [{value: '', disabled: true}],
      celular: [{value: '', disabled: true}],
      fechaNacimiento: [{value: '', disabled: true}]
    })

    this.formulariosPassword =  this._fb.group({
      newPassword: ['', Validators.required],
      repeatPassword: ['', [Validators.required]],
      exigirCambioClave: false
    }
    )

  }

  cambioPagina(paginaCambiada: Number){
    this.pagina = paginaCambiada
    this.filtrarUsuario()
  }

  nuevoUsuario(){
  }

  obtenerRoles(){
    this.genericoServices.listarRoles('A').subscribe(resp => {
      this.listaRoles = resp;
    });
  }

  filtrarUsuario(){

    const body = {
      Nombre: this.formulario.get('nombre').value,
      Documento: this.formulario.get('documento').value,
      Pagina : this.pagina,
      RegistrosPorPagina: 10
    }

    this._usuarioService.ListarUsuarios(body).subscribe( resp => {
      this.listaUsuarios = resp['contenido']
      this.paginador = resp['paginado'];
    });
  }

  changePassword(){

    if(this.formulariosPassword.valid){

      if(this.passwordIguales()){
        console.log(this.formulariosPassword)

        const body = {
          IdUsuario: this.formularioUsuario.get('codigoUsuario').value,
          NroDocumento: this.formularioUsuario.get('nroDocumento').value,
          Clave: this._cryptoService.encriptarHmacSha512(this.formulariosPassword.get('newPassword').value),
          SolicitarCambio: this.formulariosPassword.get('exigirCambioClave').value
        }

        console.log(body)
        //this._usuarioService.cambiarClave(body);
      }
    }
  }

  passwordIguales(){
   var passUno = this.formulariosPassword.get('newPassword').value
   var passDos = this.formulariosPassword.get('repeatPassword')
   this.mostrarTextValidPass = false;

   if(passUno === passDos.value){
     return true
   }
   else{
    this.mostrarTextValidPass = true;
    passDos.setErrors({'passNoIguales':true});
    return false
   }
  }

  abrirModal(modal: NgbModal, usuario: UsuarioData | null){

    if(!this.listaPaises || !this.listaTipoDocumentos)
      this.cargarCombos()

    if(usuario != null)
      this.formularioUsuario.reset({
        codigoUsuario: usuario.codUsuario,
        nombreUsuario: usuario.nombres,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        tipoDocumento: usuario.tipoDocumento,
        nroDocumento: usuario.nroDocumento,
        estado: usuario.estado,
        correo: usuario.correo,
        genero: usuario.sexo,
        pais: usuario.nacionalidad,
        celular: usuario.telefono,
        fechaNacimiento: this.datePipe.transform(new Date(usuario.fechaNacimiento), 'yyyy-MM-dd')
      })

    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });

  }

  abrirModalContrania(modal: NgbModal){
    this.formulariosPassword.reset()
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
  }
}
