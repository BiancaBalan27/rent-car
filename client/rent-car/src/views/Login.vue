<template>
  <div class="container">
    <h1>Login</h1>
    <ui-form type="|" item-margin-bottom="16" action-align="center">
      <template #default="{ actionClass }">
        <ui-form-field>
          <ui-textfield v-model="formData.email" required input-type="email">
            <label>Email address</label>
          </ui-textfield>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.password"
            input-type="password"
            required
            pattern=".{8,}"
            :attrs="{ autocomplete: 'current-password' }"
            ><label>Password</label></ui-textfield
          >
        </ui-form-field>
        <ui-form-field>
          <ui-checkbox v-model="checked" input-id="checkbox"></ui-checkbox>
          <label for="checkbox">Login as admin</label>
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-if="checked"
            v-model="formData.adminCode"
            input-type="password"
            required
            :attrs="{ autocomplete: 'current-password' }"
            ><label>Admin code</label></ui-textfield
          >
        </ui-form-field>
        <ui-alert v-if="message" state="error">{{ message }}</ui-alert>
        <ui-form-field :class="actionClass">
          <ui-button raised @click="login()">Login</ui-button>
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
    validator: "required, password",
    password: {
      validate(value) {
        return /^\w+$/.test(value);
      },
      message: "%s must be a letter, digit or underline",
    },
  },
};

export default {
  name: "Login",
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
        email: "",
        password: "",
        adminCode: "",
        esteAdmin: false,
      },
      mesaj: "",
      message: "",
      controls: {
        helperText: true,
        isVisible: true,
      },
      checked: false,
    };
  },
  methods: {
    login() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;
      console.log(`Vrei sa te autentifici cu email: ${this.formData.email}`);
      console.log(utils.url);

      //get admin code from db
      let code = {
        firstCode: "",
        secondCode: "",
        thirdCode: "",
      };
      let globalRequestParameters = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      };

      fetch(utils.url + "adminCodes", globalRequestParameters).then((resp) => {
        resp.json().then((resp) => {
          code.firstCode = resp.firstCode;
          code.secondCode = resp.secondCode;
          code.thirdCode = resp.thirdCode;
        });
      });

      if (valid) {
        let data = {
          email: this.formData.email,
          password: this.formData.password,
        };

        let requestParameters = utils.globalRequestParameters;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "login", requestParameters).then((res) => {
          res.json().then((res) => {
            this.mesaj = res.message;
            this.esteAdmin = res.admin;
            if (res.token) {
              if (this.checked) {
                if (this.esteAdmin) {
                  //if ok then login, else show message not ok
                  if (code.firstCode === this.formData.adminCode) {
                    localStorage.setItem("token", res.token);
                    this.$store.dispatch("login", true);
                    //dispatch admin
                    this.$store.dispatch("admin", true);
                    this.$router.push("/");
                  } else {
                    this.mesaj = "Incorect code";
                  }
                } else {
                  this.mesaj = "Not an admin!";
                }
              } else {
                localStorage.setItem("token", res.token);
                this.$store.dispatch("login", true);
                this.$store.dispatch("user", res.id);
                this.$router.push("/");
              }
            }
          });
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

h1 {
  font-family: "Raleway", sans-serif;
  padding-bottom: 10px;
}

.mdc-form--vertical .mdc-form__item {
  align-items: center;
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

label {
  color: #ffa900;
  font-family: "Raleway", sans-serif;
}
</style>
