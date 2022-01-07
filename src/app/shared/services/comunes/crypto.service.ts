import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = environment.secretKeyEncryption;
  private secretKeyHmac = environment.secretKeyHMAC;

  constructor() { }

  encriptar(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  desencriptar(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  encriptarHmacSha512(texto: string): string{
    return CryptoJS.HmacSHA512(texto, this.secretKeyHmac).toString()
  }

  descodificarBase64(base: string): string {
    var words = CryptoJS.enc.Base64.parse(base);
    return CryptoJS.enc.Utf8.stringify(words);
  }
}
