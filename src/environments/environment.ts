// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApiSatelliteCore : 'http://localhost:56659',
  // urlApiSatelliteCore : 'http://localhost:8080/Satelite',
  //  urlApiSatelliteCore : 'http://172.168.10.22:8080/SatelliteCore',
  secretKeyEncryption: 'NY@vkxvME8xB*%5v1j84QxCVHNeDKcnuo$j84*T',
  secretKeyHMAC: 'hV#RobuI6fsHRv&^!VJxdO1sa4ZhCdhsnHlR@lm'
};

/*ng 
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
