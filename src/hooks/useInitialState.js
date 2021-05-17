import { useState } from 'react';
import initialState from '../context/initialState';

const useInitialState = () => {
  const [state, setState] = useState(initialState);

  const addToFavorites = (payload) => {
    setState({
      ...state,
      favoritos: [...state.favoritos, payload],
    });
  };

  return {
    addToFavorites,
    state,
  };
};

export default useInitialState;
