import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
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
async function callApi(url, method, data = {}) {
  method = method.toUpperCase();

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.ApiKey,
    'x-access-token': getToken(),
  };

  try {
    const request = await fetch(url, {
      method,
      headers,
      dataType: 'json',
      body: method === 'GET' ? null : JSON.stringify(data),
    });

    const response = await request.json();

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
/**
 * Ejecuta una llamada a la API GetEntityData
 *
 * @param {Number} idEntidad Identificador de la entidad a ejecutar
 * @param {Number} claProducto Identificador del producto al que pertenece la entidad
 * @param {String} columnas Columnas separadas por coma (,) que se consultaran.
 * @param {String} condicion Condicion o filtro para la consulta, debe ser contener al menos una columna mencionada.
 * @param {Number} tipoEstructura Tipo de formato en que se formateara la respuesta.
 */
async function getApiEntityData(idEntidad, claProducto, columnas, condicion, tipoEstructura) {
  const urlService = `${config.KrakenService}/GetEntityData/${claProducto}/${idEntidad}`;

  const data = {
    columnas,
    condicion,
    tipoEstructura,
  };

  return await callApi(urlService, 'POST', data)
    .then((res) => res)
    .catch((err) => {
      console.log('getApiEntityData', err);
      throw err;
    });
}

function showAlert(onConfirm, title, text, icon) {
  return (
    <SweetAlert
      success={icon === 'success'}
      error={icon === 'error'}
      warning={icon === 'warning'}
      style={{ display: 'block', marginTop: '-50px' }}
      title={title}
      onConfirm={onConfirm}
      confirmBtnBsStyle="success highlight"
      confirmBtnText="Aceptar"
    >
      {text}
    </SweetAlert>
  );
}

function showConfirm(onConfirm, onCancel, title, text) {
  return (
    <SweetAlert
      customIcon="fa fa-warning"
      reverseButtons
      warning
      showCancel
      cancelBtnBsStyle="danger"
      style={{ display: 'block', marginTop: '-50px' }}
      title={title}
      text={text}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmBtnBsStyle="success -highlight"
      confirmBtnText="Aceptar"
      cancelBtnText="Cancelar"
    >
      {text}
    </SweetAlert>
  );
}

/**
 * Guarda en el sessionStorage el claCliente y nomCliente
 *
 * @param {Number} ClaCliente
 * @param {String} NomCliente
 */
function setCliente(claCliente, nomCliente) {
  sessionStorage.setItem('ClaCliente', claCliente);
  sessionStorage.setItem('NomCliente', nomCliente);
}

/**
 * Guarda en el sessionStorage el claProducto y nomProducto
 *
 * @param {Number} claProducto Clave del producto a almacenar
 * @param {String} nomProducto Nombre del producto a almacenar
 */
function setProducto(claProducto, nomProducto, verComo) {
  sessionStorage.setItem('ClaProducto', claProducto);
  sessionStorage.setItem('NomProducto', nomProducto);
  sessionStorage.setItem('VerComo', verComo);
}

/**
 * Regresa del sessionStorage el producto
 *
 * @returns {object} Objeto {ClaProducto, NomProducto}
 */
function getProducto() {
  return sessionStorage.getItem('ClaProducto');
}

/**
 * Regresa del sessionStorage el producto
 *
 * @returns {object} Objeto {ClaProducto, NomProducto}
 */
function getNomProducto() {
  return sessionStorage.getItem('NomProducto');
}

/**
 * Regresa del sessionStorage el ClaCliente
 *
 * @returns {Number} ClaCliente
 */
function getCliente() {
  return sessionStorage.getItem('NumUsuario');
}

/**
 * Regresa del sessionStorage el NomCliente
 *
 * @returns {string} NomCliente
 */
function getNomCliente() {
  return sessionStorage.getItem('NomCliente');
}

/**
 * Guarda en el sessionStorage cualquier valor que se mande en un objeto
 *
 * @param {object} params objeto donde cada propiedad se va a guardar
 */
function setSessionData(params) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];

      if (typeof element === 'object') {
        sessionStorage.setItem(key, JSON.stringify(element));
      } else {
        sessionStorage.setItem(key, element);
      }
    }
  }
}

/**
 * Regresa del sessionStorage cualquier valor que se pase como primer parametro,
 * en caso de no encontrarlo, regresa el valor por default del segundo parametro
 *
 * @param {string} key
 * @param {any} def
 */
function getSessionItem(key, def) {
  let value;

  try {
    value = JSON.parse(sessionStorage.getItem(key));
  } catch (error) {
    value = sessionStorage.getItem(key);
  }

  if (!value) {
    return def;
  }
  return value;
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
 * Valida la si existe un token guardado en sessionStorage y en caso de existir
 * se valida su expiracion
 *
 * @returns {boolean} retorna si el token es valido o no
 */
function sessionAlive() {
  const jwtToken = sessionStorage.getItem('Token');

  if (jwtToken) {
    const { exp } = decodeToken(jwtToken);

    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Regresa del sessionStorage las routes
 *
 * @returns {object}
 */
function getRoutes() {
  return sessionStorage.getItem('Routes');
}

/**
 * Regresa del sessionStorage el JWT token
 *
 * @returns {string}
 */
function getToken() {
  return sessionStorage.getItem('Token');
}

/**
 * Regresa del sessionStorage el nombre del usuario
 *
 * @returns {string}
 */
function getNomUsuario() {
  return sessionStorage.getItem('NomUsuario');
}

/**
 * Remueve del sessionStorage el JWT token y el nombre del usuario
 *
 */
function logOut() {
  sessionStorage.clear();
}

export {
  callApi,
  getApiEntityData,
  showAlert,
  showConfirm,
  setSessionData,
  getNomUsuario,
  getCliente,
  getRoutes,
  setCliente,
  setProducto,
  getProducto,
  getNomProducto,
  getNomCliente,
  logOut,
  sessionAlive,
  getSessionItem,
};
