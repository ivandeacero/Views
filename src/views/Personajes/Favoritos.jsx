import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Personaje from './Personaje';

const Favoritos = () => {
  const { state } = useContext(AppContext);
  const { favoritos } = state;

  return (
    <div className="row">
      {favoritos.map((personaje) => (
        <div className="col-12 col-sm-6 col-md-3" key={`fav-${personaje.id}`}>
          <Personaje personaje={personaje} />
        </div>
      ))}
    </div>
  );
};

export default Favoritos;
