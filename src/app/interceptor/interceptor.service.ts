import { SesionService } from '@shared/services/comunes/sesion.service';
import { Router } from '@angular/router';
import { AuthService } from '@data/services/backEnd/auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private sesionService: SesionService, private authService: AuthService, private router:Router, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let metodoActual: string = ''
    let finTextServicio = req.url.indexOf('?')

    if(finTextServicio = -1)
      metodoActual = req.url.slice( req.url.indexOf('/api/') + 5 );
    else
      metodoActual = req.url.substring(( req.url.indexOf('/api/') + 5 ), finTextServicio )

      console.log(metodoActual);
    let reqClone:any;

    const metodosAuth = [
      'Common/ListarTipoDocumentoIdentidad',
      'Common/ListarPaises',
      'Common/ObtenerMenuUsuarioSesion',
      'Common/listarRoles',
      'Common/ListarFamiliaMP',
      'usuario/ObtenerUsuario',
      'usuario/ListarUsuarios',
      'ValidacionAccesos/ValidarAccesoRuta',
      'ValidacionAccesos/validarToken',
      'Produccion/ProductosArima',
      'Produccion/SegimientoCandidatosMP',
      'Produccion/ListaPedidosCreadoAuto',
      'Produccion/CompraMateriaPrima',
      'Comercial/ListarCotizaciones',
      'Comercial/GenerarReporteCotizacion',
      'Comercial/ObtenerEstructuraFormato',
      'Comercial/RegistrarRespuestas',
      'Comercial/ListarProtocoloAnalisis',
      'Comercial/ListarClientes',
      'Comercial/GenerarReporteProtocoloAnalisis',
      'ControlCalidad/ListarCertificados',
      'ControlCalidad/RegistrarCertificado',
      'ControlCalidad/ListarLotes',
      'ControlCalidad/GenerarReporte',
      'ControlCalidad/RegistrarLote',
      'ControlCalidad/ListaOrdenesCompra',
      'ControlCalidad/ListarAnalisisAguja',
      'ControlCalidad/ListarCiclos',
      'ControlCalidad/RegistrarControlAgujas',
      'RRHH/GenerarReporteAsistencia'
    ];
    const data = this.sesionService.datosPersonales();

    if(metodosAuth.indexOf(metodoActual)==-1){
      let headers = new HttpHeaders({
        contentType:"application/json; charset=utf-8"
      });
      reqClone = req.clone({headers});
    }else {
      const headers = new HttpHeaders({
        Authorization: 'Bearer '+data['token'],
        contentType:"application/json; charset=utf-8"
      });
      reqClone = req.clone({headers});
    }

    return next.handle(reqClone).pipe(
      finalize( () => {
        if( metodosAuth.indexOf(metodoActual) != -1 )
          if(!data) this.authService.onLogout()
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401){
          if(err.error?.message == 'Correo o contraseña incorrecta.')
            this.toastr.warning('Usuario o contraseña incorrecta.', 'Credencial incorrecta!');
          else
            if(this.authService.isLogin())
              this.toastr.warning('No se ha iniciado sesión', 'Aviso!')
            else
              if(this.authService.isExpiredToken())
                this.toastr.warning('La sesión a expirado', 'Error de Autorización')
              else
                this.toastr.error('Error al validar su identidad', 'Error')

        localStorage.clear();
        this.router.navigate(['authentication/login'])
        }else{
          if(err.status === 403){
            this.toastr.warning('No cuenta con los permisos necesarios.', 'Aviso!')
            this.router.navigate(['/Home']);
            return
          }

        }
        return throwError( err )
      })
    )

  }
}
