import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService 
{

  private secretKeyHmac = environment.secretKeyHMAC;

  constructor() { }

  encriptar(value : string, clave: string) : string
  {    
    return CryptoJS.AES.encrypt(value, clave).toString();
  }

  encriptarBack(value : string) : string
  {
    const keyCifrado: string = environment.keyCifradoBack;
    const ivCifrado: string = environment.IvCifradoBack;

    const key = CryptoJS.enc.Utf8.parse(keyCifrado);
    const iv = CryptoJS.enc.Utf8.parse(ivCifrado);
    const valueUtf = CryptoJS.enc.Utf8.parse(value);

    return CryptoJS.AES.encrypt(valueUtf, key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iterations: 990
      }
    ).toString();
  }

  desencriptar(textToDecrypt : string, clave: string){
    return CryptoJS.AES.decrypt(textToDecrypt, clave).toString(CryptoJS.enc.Utf8);
  }

  encriptarHmacSha512(texto: string): string{
    return CryptoJS.HmacSHA512(texto, this.secretKeyHmac).toString()
  }

  descodificarBase64(base: string): string {
    var words = CryptoJS.enc.Base64.parse(base);
    return CryptoJS.enc.Utf8.stringify(words);
  }
}
