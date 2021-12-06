<template>
  <div class="container">
    <h1 v-if="!this.$route.query.formAction">Add a car</h1>
    <h1 v-if="this.$route.query.formAction">Edit mode</h1>
    <ui-form type="|" item-margin-bottom="16" action-align="center">
      <template #default="{ actionClass }">
        <ui-form-field>
          <ui-textfield v-model="formData.vehicle" required input-type="text">
            <label>Vehicle</label>
          </ui-textfield>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield v-model="formData.color" input-type="text" required
            ><label>Color</label></ui-textfield
          >
        </ui-form-field>
        <ui-form-field>
          <ui-select
            v-model="formData.fuel"
            required
            :options="fuelOptions"
            @selected="onSelectedFuel($event)"
            ><label>Fuel</label></ui-select
          >
        </ui-form-field>
        <ui-form-field>
          <ui-select
            v-model="formData.status"
            required
            :options="statusOptions"
            @selected="onSelectedStatus($event)"
            ><label>Status</label></ui-select
          >
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.price"
            input-type="text"
            required
            @keypress="onlyForCurrency"
            ><label>Price (lei)</label></ui-textfield
          >
        </ui-form-field>
        <ui-alert v-if="message" state="error">{{ message }}</ui-alert>
        <ui-form-field :class="actionClass">
          <ui-button
            v-if="!this.$route.query.formAction"
            raised
            @click="addCar()"
            >Add</ui-button
          >
        </ui-form-field>
      </template>
    </ui-form>
    <ui-button v-if="this.$route.query.formAction" raised @click="editCar()"
      >Edit</ui-button
    >
  </div>
</template>

<script>
import utils from "../utils.js";
import { useValidator, helpers } from "balm-ui";

const statusOptions = [
  {
    label: "Available",
    value: true,
  },
  {
    label: "Unavailable",
    value: false,
  },
];

const fuelOptions = [
  {
    label: "Diesel",
    value: "Diesel",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Hybrid",
    value: "Hybrid",
  },
  {
    label: "Gasoline",
    value: "Gasoline",
  },
];

export default {
  name: "AddCar",
  required: {
    validate(value) {
      return !helpers.isEmpty(value);
    },
    message: "%s is required",
  },
  data() {
    return {
      balmUI: useValidator(),
      formData: {
        id: this.$route.query.id,
        vehicle: this.$route.query.vehicle,
        color: this.$route.query.color,
        fuel: this.$route.query.fuel,
        status: this.$route.query.status,
        price: this.$route.query.price,
      },
      mesaj: "",
      message: "",
      controls: {
        helperText: true,
        isVisible: true,
      },
      statusOptions,
      fuelOptions,
      selectedStatus: true,
      selectedFuel: "Diesel",
    };
  },
  props: {
    action: {
      type: String,
      default: "Add",
    },
    car: Object,
  },
  updated() {
    this.formData = this.car;
  },
  methods: {
    addCar() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      console.log(`Vrei sa adaugi masina: ${this.formData.vehicle}`);
      console.log(utils.url);

      if (valid) {
        let data = {
          vehicle: this.formData.vehicle,
          color: this.formData.color,
          fuel: this.formData.fuel,
          status: this.formData.status,
          price: this.formData.price,
        };

        let requestParameters = { ...utils.globalRequestParameters };
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "cars", requestParameters)
          .then((res) => res.json())
          .then((res) => {
            console.log(res.message);
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            ) {
              console.log("nu ai voie!");
            } else {
              data.id = res.id;
              this.$store.dispatch("addCar", data);
              this.$router.push("/");
            }
          });
      }
    },
    editCar() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      console.log(`Vrei sa editezi masina: ${this.formData.vehicle}`);
      console.log(utils.url);

      if (valid) {
        let data = {
          vehicle: this.formData.vehicle,
          color: this.formData.color,
          fuel: this.formData.fuel,
          status: this.formData.status,
          price: this.formData.price,
        };

        let requestParameters = { ...utils.globalRequestParameters };
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "PUT";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "cars/" + this.formData.id, requestParameters)
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
                id: this.formData.id,
                vehicle: data.vehicle,
                color: data.color,
                fuel: data.fuel,
                status: data.status,
                price: data.price,
              };
              this.$store.dispatch("editCar", newData);
              this.$router.push("/");
            }
          });
      }
    },
    onlyForCurrency($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.formData.price.indexOf(".") != -1)
      ) {
        // 46 is dot
        $event.preventDefault();
      }
      // restrict to 2 decimal places
      if (
        this.formData.price != null &&
        this.formData.price.indexOf(".") > -1 &&
        this.formData.price.split(".")[1].length > 1
      ) {
        $event.preventDefault();
      }
    },
    onSelectedStatus(selectedStatus) {
      this.selectedStatus = selectedStatus.value;
    },
    onSelectedFuel(selectedFuel) {
      this.selectedFuel = selectedFuel.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 120px;
  height: 96.7vh;
}

.mdc-button--raised.mdc-ripple-upgraded {
  background-color: #ffa900;
  font-size: 15px;
  border: 1px solid #fff;
  box-shadow: 0 12px 16px 0 rgba(255, 255, 255, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.mdc-text-field {
  min-width: 300px;
  --mdc-theme-primary: #ffa900;
}

.mdc-form--vertical .mdc-form__item {
  align-items: center;
}

label {
  color: #ffa900;
  font-family: "Raleway", sans-serif;
}

h1 {
  font-family: "Raleway", sans-serif;
  padding-bottom: 10px;
}

.mdc-select {
  color: #ffa900;
  --mdc-theme-primary: #ffa900;
  fill: #ffa900;
}
</style>