<template>
  <div class="gridRow">
    <ui-grid>
      <ui-grid-cell class="gridCell"
        >{{ car.vehicle }} {{ car.color }}</ui-grid-cell
      >
      <ui-grid-cell>{{ car.fuel }}</ui-grid-cell>
      <ui-grid-cell>{{ car.price }} lei/day</ui-grid-cell>
      <ui-grid-cell v-if="car.status">Available</ui-grid-cell>
      <ui-grid-cell v-if="!car.status"
        >Unavailable until {{ car.returnDate }}</ui-grid-cell
      >
      <ui-grid-cell
        ><ui-button
          raised
          v-if="isAuthentif && isAdmin && car.status"
          @click="edit"
          >Edit</ui-button
        ></ui-grid-cell
      >
      <ui-grid-cell
        ><ui-button
          raised
          v-if="isAuthentif && isAdmin && car.status"
          @click="deleteCar"
          >Delete</ui-button
        ></ui-grid-cell
      >
      <div class="rentButton">
        <ui-grid-cell
          ><ui-button
            raised
            v-if="isAuthentif && !isAdmin && car.status"
            @click="rentCar"
            >Rent</ui-button
          ></ui-grid-cell
        >
      </div>
    </ui-grid>
  </div>
</template>

<script>
import utils from "../utils.js";
export default {
  name: "Car",
  props: {
    car: Object,
  },
  data() {
    return {
      message: "",
    };
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
      this.$emit("edit", this.car);
      this.$router.push({
        path: "addEditCar",
        query: {
          formAction: true,
          id: this.car.id,
          vehicle: this.car.vehicle,
          color: this.car.color,
          fuel: this.car.fuel,
          status: this.car.status,
          price: this.car.price,
        },
      });
    },
    deleteCar() {
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "DELETE";
      requestParameters.body = JSON.stringify(this.car);

      fetch(utils.url + "cars/" + this.car.id, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            this.$store.dispatch("deleteCar", this.car);
          }
        });
    },
    rentCar() {
      console.log("vrei sa inchiriezi masina " + this.car.vehicle);
      this.$router.push({
        path: "/reservation",
        query: {
          carId: this.car.id,
          vehicle: this.car.vehicle,
          color: this.car.color,
          fuel: this.car.fuel,
          price: this.car.price,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  padding-bottom: 1px;
}

.gridRow {
  border: 2px solid;
  border-radius: 25px;
  transition: all 0.5s ease;
  margin-top: 15px;
  padding: 5px;
  background-color: #000;
  color: #fff;
  font-family: "Raleway", sans-serif;
  display: flex;
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
  }
  .rentButton {
    position: relative;
    left: 120px;
    // left: 270px;
  }
}

@media (min-width: 751px) {
    .rentButton {
    position: relative;
    left: 480px;
    // left: 270px;
  }
}
</style>