<template>
  <div class="container">
    <h1>Change admin code</h1>
    <ui-form type="|" item-margin-bottom="16" action-align="center">
      <template #default="{ actionClass }">
        <ui-form-field>
          <ui-textfield
            v-model="formData.firstCode"
            input-type="password"
            required
            :attrs="{ autocomplete: 'current-password' }"
            ><label>Current admin code</label></ui-textfield
          >
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.newCode"
            input-type="password"
            required
            :attrs="{ autocomplete: 'current-password' }"
            ><label>New admin code</label></ui-textfield
          >
        </ui-form-field>
        <ui-form-field>
          <ui-textfield
            v-model="formData.newCodeAgain"
            input-type="password"
            required
            :attrs="{ autocomplete: 'current-password' }"
            ><label>New admin code again</label></ui-textfield
          >
        </ui-form-field>
        <ui-alert v-if="message" state="error">{{ message }}</ui-alert>
        <ui-form-field :class="actionClass">
          <ui-button raised @click="change">Change</ui-button>
        </ui-form-field>
      </template>
    </ui-form>
    <div>{{ message }}</div>
  </div>
</template>

<script>
import utils from "../utils.js";
import { useValidator } from "balm-ui";

const validations = {
  newCodeAgain: {
    label: "New admin code again",
    validator: "required, repasswordRule",
    repasswordRule: {
      validate(value, data) {
        return value === data.newCode;
      },
      message: "Codes don't match",
    },
  },
};

export default {
  name: "ChangeAdminCode",
  data() {
    return {
      balmUI: useValidator(),
      validations,
      formData: {
        firstCode: "",
        newCode: "",
        newCodeAgain: "",
      },
      message: "",
    };
  },
  methods: {
    change() {
      let result = this.balmUI.validate(this.formData);
      let { valid, message } = result;
      this.message = message;

      if (valid) {
        let code = {
          id: "",
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
        fetch(utils.url + "adminCodes", globalRequestParameters).then(
          (resp) => {
            resp.json().then((resp) => {
              code.id = resp.id;
              code.firstCode = resp.firstCode;
              code.secondCode = resp.secondCode;
              code.thirdCode = resp.thirdCode;

              if (this.formData.firstCode === code.firstCode) {
                if (
                  this.formData.newCode !== code.secondCode &&
                  this.formData.newCode !== code.thirdCode
                ) {
                  let newCodes = {
                    firstCode: this.formData.newCode,
                    secondCode: code.firstCode,
                    thirdCode: code.secondCode,
                  };

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
                  globalRequestParameters.body = JSON.stringify(newCodes);
                  fetch(
                    utils.url + "adminCodes/" + code.id,
                    globalRequestParameters
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      if (
                        res.message === "Decoding error!" ||
                        res.message === "Your token expired!"
                      ) {
                        console.log("nu ai voie!");
                      } else {
                        this.$router.push("/");
                      }
                    });
                } else {
                  this.message = "Code already used"
                }
              } else {
                this.message = "Incorect code";
              }
            });
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 120px;
  height: 96.8vh;
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