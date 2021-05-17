import React from 'react';
import { Card, CardText, CardHeader, CardBody, CardTitle, Button } from 'reactstrap';

const Personaje = ({ personaje, handleAddToFavorites, fromPersonaje }) => {
  return (
    <Card key={personaje.id} style={{ margin: '10px 5px' }}>
      <CardHeader>
        <CardTitle>{personaje.name}</CardTitle>
      </CardHeader>
      <CardBody className="p-2">
        <CardText className="mb-2 text-center">
          <img style={{ width: '60%' }} src={personaje.image} alt={personaje.name} />
        </CardText>
        <CardText className="mb-0 text-center">
          <span className="kar-label">{personaje.status}</span>
        </CardText>
        <CardText className="mb-0 text-center">
          <span className="kar-label">{personaje.species}</span>
        </CardText>
        <CardText className="mb-0 text-center">
          <span className="kar-label">{personaje.gender}</span>
        </CardText>
        {fromPersonaje ? (
          <div className="text-center mt-2">
            <Button
              className="animation-on-hover btn-sm"
              color="success"
              onClick={() => handleAddToFavorites(personaje)}
            >
              Favorito
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </CardBody>
    </Card>
  );
};

export default Personaje;
