const config = {
  LoginMensaje: 'Powered by DLabs',
  LoginLogoTamanio: '48px',
  ApiKey: '9E50EEF7-531F-4425-A803-25FEAE88057D',

  // ** Desarrollo
  UrlLoginServer: 'http://dlabsdbdev:2622/',
  UrlApiProject: 'http://localhost:5000/',

  // ** Kraken Desarrollo
  KrakenService: 'http://dlabsdbdev:2022/KrakenServices',

  // Debugging mode
  DebuggingMode: true,
};

function GetToken() {
  return sessionStorage.getItem('Token');
}

export { config, GetToken };
