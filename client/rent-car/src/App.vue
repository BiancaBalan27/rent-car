<template>
  <div id="nav">
    <Navigation />
    <router-view />
    <footer class="footer is-primary">
      <div>
        <div class="columns">
          <div class="column">
            <p>©Bianca Bălan 2021</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Navigation from "./components/Navigation";

export default {
  name: "App",
  components: {
    Navigation,
  },
  computed: {
    isAuthentif() {
      return this.$store.state.isAuthentif;
    },
  },
  methods: {
    logout() {
      this.$store.commit("SET_AUTH", false);
      this.$store.commit("ADMIN", false);
      window.localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;500&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  position: relative;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
}

#nav a.router-link-exact-active {
  color:#FFA900;
}

.container {
  padding: 0 20px;
  max-width: 1140px;
  margin: 0 auto;
}

footer {
  background-color: #FFA900;
  color: #fff;
  text-align: left;
  // position: fixed;
  bottom: 0;
  width: 100%;
  font-family: "Raleway", sans-serif;
  // height: 25px;
  padding-left: 150px;
}
</style>
