import React, { useState, useEffect, useContext } from 'react';
import { callApi } from '../../utils/utils';
import Personaje from './Personaje';
import AppContext from '../../context/AppContext';

const Personajes = () => {
  const { addToFavorites } = useContext(AppContext);
  const [personajes, setPersonajes] = useState([]);
  const API = 'https://rickandmortyapi.com/api/character/';

  const handleAddToFavorites = (personaje) => {
    addToFavorites(personaje);
  };

  // const handleAddToFavorites = (personaje) => () => {
  //   addToFavorites(personaje);
  // };

  useEffect(() => {
    callApi(API, 'GET', null, (res) => {
      setPersonajes(res.results);
    });
  }, []);

  return (
    <div className="row">
      {personajes.map((personaje) => (
        <div className="col-12 col-sm-6 col-md-3" key={`per-${personaje.id}`}>
          <Personaje
            personaje={personaje}
            handleAddToFavorites={handleAddToFavorites}
            fromPersonaje={true}
          />
        </div>
      ))}
    </div>
  );
};

export default Personajes;
