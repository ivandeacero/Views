import swal from 'sweetalert';
import notify from 'devextreme/ui/notify';
import { config } from './config';

require('./prototypes');

/**
 * Realiza una peticion a una URL especificada.
 *
 * @param {String} url Dirección donde se realizara la peticioón
 * @param {String} method Tipo de peticion a ejecutar (POST, GET, PUT, DELETE)
 * @param {JSON} [data={}] Objeto que se adjuntará al body de la petición
 * @returns
 */
async function callApi(url, method, data = {}, callBack, multipart = false) {
  method = method.toUpperCase();

  const headers = {
    'x-api-key': config.ApiKey,
    'x-access-token': getSessionItem('Token', ''),
    ...(!multipart && {
      'Content-Type': 'application/json',
    }),
  };

  if (config.DebuggingMode) {
    console.log(`Url: ${url}`);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method === 'GET' ? null : !multipart ? JSON.stringify(data) : data,
      dataType: !multipart ? 'json' : null,
    });

    if (response.status === 200) {
      const res = await response.json();
      if (config.DebuggingMode) {
        console.log(`Url: ${url}, Response: `, res);
      }
      callBack(res);
    } else {
      throw Error(`${response.message}`);
    }
  } catch (err) {
    swal('Error', err.message, 'error', {
      buttons: {
        confirm: {
          text: 'Aceptar',
          className: 'animation-on-hover btn btn-success',
        },
      },
    });
  }
}
/**
 * Función para realizar la petición a Kraken por medio de su servicio en Node js
 * @param {Number} claProducto número de el producto, dueño de la entidad
 * @param {Number} idEntidad número de la entidad que se desea consultar
 * @param {Object} paramsSP parametros que necesita la entidad
 * @param {Object} tipoEstructura número
 * @param {Function} callback función de callback para manejo del resultado
 */
async function callKrakenApi(claProducto, idEntidad, paramsSP, tipoEstructura, callback) {
  const method = 'POST';

  const params = {
    parameters: JSON.stringify(paramsSP),
    tipoEstructura,
  };

  const url = `${config.KrakenService}/${claProducto}/${idEntidad}`;

  await callApi(url, method, params, callback);
}

/**
 * Guarda en el localStorage cualquier valor que se mande en un objeto
 *
 * @param {object} params objeto donde cada propiedad se va a guardar
 */
function setSessionData(params) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];

      if (typeof element === 'object') {
        localStorage.setItem(key, JSON.stringify(element));
      } else {
        localStorage.setItem(key, element);
      }
    }
  }
}

/**
 * Regresa del localStorage cualquier valor que se pase como primer parametro,
 * en caso de no encontrarlo, regresa el valor por default del segundo parametro
 *
 * @param {string} key
 * @param {any} def
 */
function getSessionItem(key, def) {
  let value;

  try {
    value = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    value = localStorage.getItem(key);
  }

  if (!value) {
    return def;
  }
  return value;
}

/**
 * Regresa del sessionStorage el NumUsuario
 *
 * @returns {Number} NumUsuario
 */
function getCliente() {
  return localStorage.getItem('NumUsuario');
}

/**
 * Remueve del localStorage el JWT token y el nombre del usuario
 *
 */
function logOut() {
  localStorage.clear();
}

/**
 * Hace el decode del JWT token
 *
 * @param {string} token
 * @returns {object} payload del token
 */
function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

/**
 * Valida la si existe un token guardado en localStorage y en caso de existir
 * se valida su expiracion
 *
 * @returns {boolean} retorna si el token es valido o no
 */
function sessionAlive() {
  const jwtToken = localStorage.getItem('Token');
  let resp = false;

  if (jwtToken) {
    const { exp } = decodeToken(jwtToken);

    if (Date.now() < exp * 1000) {
      resp = true;
    }
  }

  if (!resp) {
    logOut();
  }

  return resp;
}

/**
 * Tipo de la notificacion de DevExtreme
 */
const notifyType = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

/**
 * Posicion la notificacion de DevExtreme
 * 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top'
 */
const notifyPosition = {
  centerBottom: 'center bottom',
  centerTop: 'center top',
  rightBottom: 'right bottom',
  rightTop: 'right top',
};

/**
 * Manda Un mensaje Generico con el Notify de DevExtreme
 *
 * @param {string} message mensaje de la alerta
 * @param {notifyPosition} notifyPosition posicion de la alerta
 * @param {notifyType} notifyType tipo de notificacion
 */
function showNotify(message, notifyPosition, notifyType) {
  notify(
    {
      message,
      position: {
        my: notifyPosition,
        at: notifyPosition,
      },
      width: '400px',
      closeOnSwipe: true,
    },
    notifyType,
    3000
  );
}

function showSweetAlert(title, message, notifyType) {
  swal(title, message, notifyType, {
    buttons: {
      confirm: {
        text: 'Aceptar',
        className: 'animation-on-hover btn btn-success',
      },
    },
  });
}

export {
  callApi,
  callKrakenApi,
  setSessionData,
  getSessionItem,
  getCliente,
  logOut,
  decodeToken,
  sessionAlive,
  notifyType,
  notifyPosition,
  showNotify,
  showSweetAlert,
};
