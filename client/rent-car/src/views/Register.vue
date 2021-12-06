<template>
  <div class="container">
    <h1>Registration</h1>
    <ui-form type="|" item-margin-bottom="16" action-align="center">
      <template #default="{ actionClass }">
        <ui-form-field>
          <ui-textfield v-model="formData.lastName" required input-type="text">
            <label>Last name</label>
          </ui-textfield>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield v-model="formData.firstName" required input-type="text">
            <label>First name</label>
          </ui-textfield>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.email"
            required
            helper-text-id="email-field-helper-text"
            input-type="email"
          >
            <label>Email address</label>
          </ui-textfield>
          <ui-textfield-helper
            v-if="controls.helperText"
            id="email-field-helper-text"
            :visible="controls.isVisible"
          >
            Must be like me@example.com
          </ui-textfield-helper>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.password"
            input-type="password"
            required
            pattern=".{8,}"
            helper-text-id="pw-validation-msg"
            :attrs="{ autocomplete: 'current-password' }"
            ><label>Choose password</label></ui-textfield
          >
          <ui-textfield-helper id="pw-validation-msg" visible validMsg>
            Must be at least 8 characters long
          </ui-textfield-helper>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.repassword"
            input-type="password"
            required
          >
            <label> Password</label>
          </ui-textfield>
        </ui-form-field>
        <ui-alert v-if="message" state="error">{{ message }}</ui-alert>
        <ui-form-field :class="actionClass">
          <ui-button raised @click="register()">Submit</ui-button>
        </ui-form-field>
      </template>
    </ui-form>
    <div>
      {{ mesaj }}
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";
import { useValidator, helpers } from "balm-ui";

const validations = {
  lastName: {
    label: "Last name",
    validator: "required",
  },
  firstName: {
    label: "First name",
    validator: "required",
  },
  email: {
    label: "Email",
    validator: "required, email",
    email: {
      validate(value) {
        return /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
          value
        );
      },
      message: "Email address should be like me@example.com",
    },
  },
  password: {
    label: "Password",
    validator: "required, password, minRule",
    password: {
      validate(value) {
        return /^\w+$/.test(value);
      },
      message: "%s must be a letter, digit or underline",
    },
    minRule: {
      validate(value) {
        return value.trim().length >= 8;
      },
      message: "%s minLength >= 8",
    },
  },
  repassword: {
    label: "Repeat Password",
    validator: "required, password, repasswordRule",
    password: {
      validate(value) {
        return /^\w+$/.test(value);
      },
      message: "%s must be a letter, digit or underline",
    },
    repasswordRule: {
      validate(value, data) {
        return value === data.password;
      },
      message: "Passwords don't match",
    },
  },
};

export default {
  name: "Register",
  required: {
    validate(value) {
      return !helpers.isEmpty(value);
    },
    message: "%s is required",
  },
  data() {
    return {
      balmUI: useValidator(),
      validations,
      formData: {
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        repassword: "",
      },
      mesaj: "",
      message: "",
      controls: {
        helperText: true,
        isVisible: true,
      },
    };
  },
  methods: {
    register() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      console.log(`Vrei sa te inregistrezi cu email: ${this.formData.email}`);
      console.log(utils.url);

      if (valid) {
        let data = {
          lastName: this.formData.lastName,
          firstName: this.formData.firstName,
          email: this.formData.email,
          password: this.formData.password,
          isAdmin: false,
        };

        let requestParameters = utils.globalRequestParameters;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "user", requestParameters).then((res) => {
          res.text().then((res) => (this.mesaj = res));
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 120px;
  height: 96.7vh;
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
</style>
