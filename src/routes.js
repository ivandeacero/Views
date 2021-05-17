import FormularioCaptura from './views/FormularioCaptura/FormularioCaptura.js';
import GridFiltros from './views/TablaFiltros/TablaFiltros.js';
// import Tickets from "./views/Tickets/Tickets.js";
import Tickets from './views/TicketsSimple/TicketsSimple.js';
import Personajes from './views/Personajes/Personajes';
import Favoritos from './views/Personajes/Favoritos';

const routes = [
  {
    path: '/Pedidos',
    name: 'Pedidos',
    icon: 'ni ni-shop text-primary',
    component: FormularioCaptura,
    layout: '/layout',
  },
  {
    path: '/Filtros',
    name: 'Filtros',
    icon: 'ni ni-shop text-primary',
    component: GridFiltros,
    layout: '/layout',
  },
  {
    path: '/Tickets',
    name: 'Tickets',
    icon: 'ni ni-shop text-primary',
    component: Tickets,
    layout: '/layout',
  },
  {
    path: '/Personajes',
    name: 'Personajes',
    icon: 'ni ni-shop text-primary',
    component: Personajes,
    layout: '/layout',
  },
  {
    path: '/Favoritos',
    name: 'Personajes favoritos',
    icon: 'ni ni-shop text-primary',
    component: Favoritos,
    layout: '/layout',
  },
];

export default routes;
