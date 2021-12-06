<template>
  <div class="container">
    <h1>Users</h1>
    <User :user="elem" v-for="elem in users" :key="elem.id"></User>
    <div class="pages">
      <ui-button
        outlined
        v-for="elem in this.$store.state.pages"
        :key="elem"
        @click="changePage(elem)"
      >
        {{ elem }}
      </ui-button>
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";
import User from "@/components/User.vue";

export default {
  name: "Users",
  components: {
    User,
  },
  data() {
    return {
      pageIndex: this.$store.state.pageIndex,
      noOfPages: 0,
      pages: this.$store.state.pages,
    };
  },
  created() {
    let url = utils.url;
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
    if (!this.users.length) {
      fetch(url + "users", globalRequestParameters).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchUsers", res);
        })
      );
    }
  },
  computed: {
    users() {
      let users = [];
      this.$store.state.users.forEach(element => {
          if(element.isAdmin == false) {
              users.push(element)
          }
      });
      this.$store.dispatch("setNoOfPages", users.length / 5);
      return users.slice(
        (this.$store.state.pageIndex - 1) * 5,
        this.$store.state.pageIndex * 5
      );
    },
  },
  methods: {
    changePage(elem) {
      this.$store.dispatch("setPageIndex", elem);
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 100px;
  // padding-top: 120px;
  height: 97vh;
}

h1 {
  font-family: "Raleway", sans-serif;
  padding-bottom: 10px;
}

.pages {
  margin-top: 25px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
}

.mdc-button--outlined.mdc-ripple-upgraded {
  color: #ffa900;
  font-size: 15px;
  border: 1px solid #ffa900;
  box-shadow: 0 12px 16px 0 rgba(255, 255, 255, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.mdc-button--outlined.mdc-ripple-upgraded--background-focused {
  color: #fff;
  font-size: 15px;
  background-color:  #ffa900;
  border: 1px solid #ffa900;
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