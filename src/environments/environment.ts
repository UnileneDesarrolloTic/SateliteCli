// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApiSatelliteCore : 'http://localhost:56659',//'http://172.168.10.22:81/SatelliteCore', 
  secretKeyEncryption: 'NY@vkxvME8xB*%5v1j84QxCVHNeDKcnuo$j84*T',
  secretKeyHMAC: 'hV#RobuI6fsHRv&^!VJxdO1sa4ZhCdhsnHlR@lm',
  urlApiSisDoc : 'http://172.168.10.22:8081/SisDoc', //'http://localhost:25939'
  urlRespositorioDocumentos: 'http://172.168.10.22:8081/SisDoc/Documentos', // 'http://localhost:25939'
  keyCifradoBack: 'BNjI0k7NFNrOZrLi',
  IvCifradoBack: '2osKzp4MUaBF5Guv'
};
