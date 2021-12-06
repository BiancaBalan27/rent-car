<template>
  <div class="container">
    <h1 v-if="!this.$route.query.formAction">Reservation</h1>
    <h1 v-if="this.$route.query.formAction">Edit mode reservation</h1>
    <div>
      <ui-grid class="gridRow">
        <ui-grid-cell class="gridCell"
          >{{ this.formData.vehicle }} {{ this.formData.color }}</ui-grid-cell
        >
        <ui-grid-cell>{{ this.formData.fuel }}</ui-grid-cell>
        <ui-grid-cell>{{ this.formData.price }} lei/day</ui-grid-cell>
      </ui-grid>
    </div>
    <ui-form type="|" item-margin-bottom="16" action-align="center">
      <template #default="{ actionClass }">
        <ui-form-field>
          <ui-textfield
            v-model="formData.days"
            input-type="number"
            required
            min="1"
            ><label>Number of days</label></ui-textfield
          >
        </ui-form-field>
        <h1>Total price: {{ formData.days * formData.price }} lei</h1>
        <ui-alert v-if="message" state="error">{{ message }}</ui-alert>
        <ui-form-field :class="actionClass">
          <ui-button
            v-if="!this.$route.query.formAction"
            raised
            @click="reserve"
            >Reserve</ui-button
          >
        </ui-form-field>
      </template>
    </ui-form>
    <ui-button v-if="this.$route.query.formAction" raised @click="edit"
      >Edit</ui-button
    >
    <div>{{ mesaj }}</div>
  </div>
</template>

<script>
import utils from "../utils.js";
import { useValidator, helpers } from "balm-ui";

const validations = {
  days: {
    label: "Days",
    validator: "required",
  },
};

export default {
  name: "MakeReservation",
  required: {
    validate(value) {
      return !helpers.isEmpty(value);
    },
    message: "%s are required",
  },
  data() {
    return {
      balmUI: useValidator(),
      validations,
      formData: {
        resID: this.$route.query.id,
        carId: this.$route.query.carId,
        vehicle: this.$route.query.vehicle,
        color: this.$route.query.color,
        fuel: this.$route.query.fuel,
        price: this.$route.query.price,
        days: this.$route.query.days,
        dateFrom: this.$route.query.dateFrom,
        email: this.$route.query.email,
        firstName: this.$route.query.firstName,
        lastName: this.$route.query.lastName,
        returnDate: this.$route.query.returnDate,
        userId: this.$route.query.userId,
      },
      message: "",
      mesaj: "",
    };
  },
  methods: {
    getToday() {
      var result = new Date();
      return (
        result.getFullYear() +
        "-" +
        (result.getMonth() + 1) +
        "-" +
        result.getDate()
      );
    },
    calculateDate() {
      var date = this.getToday().split("-");
      let year = date[0];
      let month = date[1];
      let day = date[2];
      var theDate = new Date(year, month - 1, day);
      var result = new Date(
        theDate.getTime() + this.formData.days * 24 * 60 * 60 * 1000
      );
      return (
        result.getFullYear() +
        "-" +
        (result.getMonth() + 1) +
        "-" +
        result.getDate()
      );
    },
    reserve() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      if (valid) {
        console.log("vrei sa rezervi");

        let globalRequestParameters = {
          method: "Get",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        };
        fetch(utils.url + "users/" + this.userId, globalRequestParameters).then(
          (res) => {
            res.json().then((res) => {
              let data = {
                carId: this.formData.carId,
                vehicle: this.formData.vehicle,
                color: this.formData.color,
                fuel: this.formData.fuel,
                price: this.formData.price,
                userId: this.userId,
                email: res.email,
                lastName: res.lastName,
                firstName: res.firstName,
                days: this.formData.days,
                dateFrom: this.getToday(),
                returnDate: this.calculateDate(),
              };

              let requestParameters = utils.globalRequestParameters;
              requestParameters.method = "POST";
              requestParameters.body = JSON.stringify(data);

              fetch(utils.url + "reservations", requestParameters).then(
                (res) => {
                  res.text().then((res) => {
                    this.mesaj = res;
                    let globalRequestParameters = {
                      method: "PUT",
                      mode: "cors",
                      cache: "no-cache",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      redirect: "follow",
                      referrerPolicy: "no-referrer",
                    };
                    let token = window.localStorage.getItem("token");
                    globalRequestParameters.headers.Authorization =
                      "Bearer " + token;
                    let carData = {
                      vehicle: this.formData.vehicle,
                      color: this.formData.color,
                      fuel: this.formData.fuel,
                      status: false,
                      price: this.formData.price,
                      returnDate: data.returnDate,
                    };
                    globalRequestParameters.body = JSON.stringify(carData);
                    fetch(
                      utils.url + "cars/" + this.formData.carId,
                      globalRequestParameters
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
                            id: this.formData.carId,
                            vehicle: carData.vehicle,
                            color: carData.color,
                            fuel: carData.fuel,
                            status: carData.status,
                            price: carData.price,
                            returnDate: carData.returnDate,
                          };
                          this.$store.dispatch("editCar", newData);
                          this.$store.dispatch("addReservation", data);
                          this.$router.push("/");
                        }
                      });
                  });
                }
              );
            });
          }
        );
      }
    },
    edit() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      if (valid) {
        let data = {
          carId: this.formData.carId,
          vehicle: this.formData.vehicle,
          color: this.formData.color,
          fuel: this.formData.fuel,
          price: this.formData.price,
          userId: this.formData.userId,
          email: this.formData.email,
          lastName: this.formData.lastName,
          firstName: this.formData.firstName,
          days: this.formData.days,
          dateFrom: this.formData.dateFrom,
          returnDate: this.calculateDate(),
        };

        let requestParameters = { ...utils.globalRequestParameters };
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "PUT";
        requestParameters.body = JSON.stringify(data);

        fetch(
          utils.url + "reservations/" + this.formData.resID,
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
                id: this.formData.resID,
                carId: data.carId,
                vehicle: data.vehicle,
                color: data.color,
                fuel: data.fuel,
                price: data.price,
                userId: data.userId,
                email: data.email,
                lastName: data.lastName,
                firstName: data.firstName,
                days: data.days,
                dateFrom: data.dateFrom,
                returnDate: this.calculateDate(),
              };
              this.$store.dispatch("editReservation", newData);

              let requestParameters = { ...utils.globalRequestParameters };
              let token = window.localStorage.getItem("token");
              requestParameters.headers.Authorization = "Bearer " + token;
              requestParameters.method = "PUT";
              requestParameters.body = JSON.stringify(data);

              let carData = {
                vehicle: this.formData.vehicle,
                color: this.formData.color,
                fuel: this.formData.fuel,
                status: false,
                price: this.formData.price,
                returnDate: this.calculateDate(),
              };
              requestParameters.body = JSON.stringify(carData);
              fetch(
                utils.url + "cars/" + this.formData.carId,
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
                      id: this.formData.carId,
                      vehicle: carData.vehicle,
                      color: carData.color,
                      fuel: carData.fuel,
                      status: carData.status,
                      price: carData.price,
                      returnDate: this.calculateDate(),
                    };
                    this.$store.dispatch("editCar", newData);
                    this.$router.push("/");
                  }
                });

              this.$router.push("/reservations");
            }
          });
      }
    },
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 120px;
  height: 96vh;
}

.mdc-text-field {
  min-width: 300px;
  --mdc-theme-primary: #ffa900;
}

.mdc-button--raised.mdc-ripple-upgraded {
  background-color: #ffa900;
  font-size: 15px;
  border: 1px solid #fff;
  box-shadow: 0 12px 16px 0 rgba(255, 255, 255, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

h1 {
  font-family: "Raleway", sans-serif;
  padding-bottom: 10px;
}

.mdc-form--vertical .mdc-form__item {
  align-items: center;
}

label {
  color: #ffa900;
  font-family: "Raleway", sans-serif;
}

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
</style>