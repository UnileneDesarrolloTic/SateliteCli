
export interface AuthReturn {
  success:boolean,
  message: string,
  content: {
    codUsuario: number,
    nombres: string,
    apellidoPaterno: string,
    token: string
  }
}
