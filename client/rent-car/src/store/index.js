import { createStore } from 'vuex'

export default createStore({
  state: {
    cars: [],
    isAuthentif: localStorage.getItem("token") ? true : false,
    isAdmin: false,
    userId: "",
    reservations: [],
    users: [],
    pages: [],
    pageIndex: 1,
    noOfPages: 0,
  },
  getters: {
    cars: state => {
      return state.cars
    },
    reservations: state => {
      return state.reservations
    },
    users: state => {
      return state.users
    }
  },
  mutations: {
    SET_AUTH: (state, status) => {
      state.isAuthentif = status
    },
    SET_CARS: (state, cars) => {
      state.cars = cars
    },
    ADD_CAR: (state, car) => {
      state.cars.push(car)
    },
    DELETE_CAR: (state, car) => {
      var index = state.cars.findIndex(c => c.id == car.id)
      state.cars.splice(index, 1);
    },
    EDIT_CAR: (state, car) => {
      Object.assign(state.cars[state.cars.findIndex(c => c.id === car.id)], car);
    },
    ADMIN: (state, status) => {
      state.isAdmin = status
    },
    USER: (state, user) => {
      state.userId = user;
    },
    SET_RESERVATIONS: (state, reservations) => {
      state.reservations = reservations;
    },
    SET_USERS: (state, users) => {
      state.users = users;
    },
    EDIT_RESERVATION: (state, reservation) => {
      Object.assign(state.reservations[state.reservations.findIndex(c => c.id === reservation.id)], reservation);
    },
    DELETE_RESERVATION: (state, reservation) => {
      var index = state.reservations.findIndex(c => c.id == reservation.id)
      state.reservations.splice(index, 1);
    },
    ADD_RESERVATION: (state, reservation) => {
      state.reservations.push(reservation)
    },
    SET_PAGE: (state, pageIndex) => {
      state.pageIndex = pageIndex;
    },
    SET_NO_OF_PAGES: (state, noOfPages) => {
      state.noOfPages = noOfPages;
      if(noOfPages < 1) {
        state.noOfPages = 1;
      }
      if(noOfPages % 1 !== 0) {
        state.noOfPages = noOfPages + 1;
      }
      console.log(state.noOfPages)
      state.pages = [];
      for (let i = 1; i <= state.noOfPages; i++) {
        state.pages.push(i);
      }
    },
  },
  actions: {
    login: ({ commit }, payload) => {
      commit('SET_AUTH', payload)
    },
    fetchCars: ({ commit }, payload) => {
      commit('SET_CARS', payload)
    },
    addCar: ({ commit }, payload) => {
      commit('ADD_CAR', payload)
    },
    deleteCar: ({ commit }, payload) => {
      commit('DELETE_CAR', payload)
    },
    editCar: ({ commit }, payload) => {
      commit('EDIT_CAR', payload)
    },
    admin: ({ commit }, payload) => {
      commit('ADMIN', payload)
    },
    user: ({ commit }, payload) => {
      commit('USER', payload)
    },
    fetchReservations: ({ commit }, payload) => {
      commit('SET_RESERVATIONS', payload)
    },
    fetchUsers: ({ commit }, payload) => {
      commit('SET_USERS', payload)
    },
    editReservation: ({ commit }, payload) => {
      commit('EDIT_RESERVATION', payload)
    },
    deleteReservation: ({ commit }, payload) => {
      commit('DELETE_RESERVATION', payload)
    },
    addReservation: ({ commit }, payload) => {
      commit('ADD_RESERVATION', payload)
    },
    setPageIndex: ({ commit }, payload) => {
      commit("SET_PAGE", payload);
    },
    setNoOfPages: ({ commit }, payload) => {
      commit("SET_NO_OF_PAGES", payload);
    },
  },
  modules: {
  }
})
