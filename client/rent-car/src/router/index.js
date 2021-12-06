import { createRouter, createWebHistory } from 'vue-router'
import CarsList from '../views/CarsList.vue'
import Register from '../views/Register'
import Login from '../views/Login'
import AddEditCar from '../views/AddEditCar'
import store from '../store'
import MakeReservation from '../views/MakeReservation'
import ChangeAdminCode from '../views/ChangeAdminCode'
import Reservations from '../views/Reservations'
import Users from '../views/Users'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CarsList
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/addEditCar',
    name: 'AddCar',
    component: AddEditCar
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: MakeReservation
  },
  {
    path: '/changeAdminCode',
    name: 'Change Admin Code',
    component: ChangeAdminCode
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Register' || to.name === 'Login' || to.name === 'Home')
    next()
  else if (to.name !== 'Login' && !store.state.isAuthentif) next({ name: 'Login' })
  else next()
})

export default router
