<template>
  <div class="gridRow">
    <ui-grid>
      <ui-grid-cell class="gridCell">{{ reservation.vehicle }} {{reservation.color}}</ui-grid-cell>
      <ui-grid-cell>{{ reservation.fuel }}</ui-grid-cell>
      <ui-grid-cell>{{ reservation.price }} lei/day</ui-grid-cell>
      <ui-grid-cell>From {{ reservation.dateFrom }} for {{reservation.days}} days</ui-grid-cell>
      <ui-grid-cell>Return date {{ reservation.returnDate }}</ui-grid-cell>
      <ui-grid-cell>{{ reservation.lastName }} {{reservation.firstName}}</ui-grid-cell>
      <ui-grid-cell>{{ reservation.email }}</ui-grid-cell>
      <ui-grid-cell>Total price {{reservation.days*reservation.price}} lei</ui-grid-cell>
      <ui-grid-cell
        ><ui-button raised v-if="isAuthentif && !isAdmin" @click="edit"
          >Edit</ui-button
        ></ui-grid-cell
      >
      <ui-grid-cell
        ><ui-button raised v-if="isAuthentif && !isAdmin" @click="deleteReservation"
          >Delete</ui-button
        ></ui-grid-cell
      >
    </ui-grid>
  </div>
</template>

<script>
import utils from "../utils.js";
export default {
  name: "Reservation",
  props: {
    reservation: Object,
  },
  computed: {
    isAuthentif() {
      return this.$store.state.isAuthentif;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.reservation);
      this.$router.push({
        path: "/reservation",
        query: {
          formAction: true,
          id: this.reservation.id,
          carId: this.reservation.carId,
          vehicle: this.reservation.vehicle,
          color: this.reservation.color,
          fuel: this.reservation.fuel,
          price: this.reservation.price,
          days: this.reservation.days,
          dateFrom: this.reservation.dateFrom,
          email: this.reservation.email,
          firstName: this.reservation.firstName,
          lastName: this.reservation.lastName,
          returnDate: this.reservation.returnDate,
          userId: this.reservation.userId
        },
      });
    },
    deleteReservation() {
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "DELETE";
      requestParameters.body = JSON.stringify(this.reservation);

      fetch(utils.url + "reservations/" + this.reservation.id, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            this.$store.dispatch("deleteReservation", this.reservation);

            let requestParameters = { ...utils.globalRequestParameters };
              let token = window.localStorage.getItem("token");
              requestParameters.headers.Authorization = "Bearer " + token;
              requestParameters.method = "PUT";

              let carData = {
                vehicle: this.reservation.vehicle,
                color: this.reservation.color,
                fuel: this.reservation.fuel,
                status: true,
                price: this.reservation.price,
                returnDate: this.reservation.returnDate,
              };
              requestParameters.body = JSON.stringify(carData);
              fetch(
                utils.url + "cars/" + this.reservation.carId,
                requestParameters
              )
                .then((res) => res.json())
                .then((res) => {
                  console.log(res.message);
                  if (
                    res.message === "Decoding error!" ||
                    res.message === "Your token expired!"
                  ) {
                    console.log("nu ai voie!");
                  } else {
                    let newData = {
                      id: this.reservation.carId,
                      vehicle: carData.vehicle,
                      color: carData.color,
                      fuel: carData.fuel,
                      status: carData.status,
                      price: carData.price,
                      returnDate: carData.returnDate,
                    };
                    this.$store.dispatch("editCar", newData);
                  }
                });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.gridRow {
  border: 2px solid;
  border-radius: 25px;
  transition: all 0.5s ease;
  margin: 50px 100px;
  background-color: #000;
  color: #fff;
  font-family: "Raleway", sans-serif;
}

.gridRow:hover {
  background-color: #fff;
  color: #000;
}

.mdc-button--raised.mdc-ripple-upgraded {
  background-color: #ffa900;
  font-size: 15px;
  border: 1px solid #fff;
  box-shadow: 0 12px 16px 0 rgba(255, 255, 255, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

@media (max-width: 750px) {
  .gridRow {
    display: flex;
    grid-template-columns: 2fr 2fr 2fr;
    grid-gap: 5%;
    width: 80%;
    margin: 0 auto;
  }
}
</style>