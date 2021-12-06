<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav>
      <div class="branding">
        <img src="@/assets/rent.png" alt="" />
      </div>
      <ul v-show="!mobile" class="navigation">
        <li>
          <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
        </li>
        <li>
          <router-link
            v-show="!isAuthentif"
            class="link"
            :to="{ name: 'Register' }"
            >Register</router-link
          >
        </li>
        <li>
          <router-link v-show="!isAuthentif" class="link" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </li>
        <li>
          <router-link v-show="isAdmin" class="link" :to="{ name: 'AddCar' }"
            >Add a car</router-link
          >
        </li>
        <li>
          <router-link
            v-show="isAdmin"
            class="link"
            :to="{ name: 'Change Admin Code' }"
            >Change admin code</router-link
          >
        </li>
        <li>
          <router-link
            v-show="isAuthentif"
            class="link"
            :to="{ name: 'Reservations' }"
            >Reservations</router-link
          >
        </li>
        <li>
          <router-link v-show="isAdmin" class="link" :to="{ name: 'Users' }"
            >Users</router-link
          >
        </li>
        <li>
          <ui-button raised v-show="isAdmin" @click="addNewCars"
            >Add new cars</ui-button
          >
        </li>
        <li>
          <ui-button raised v-show="isAuthentif" @click="logout()"
            >Logout</ui-button
          >
        </li>
      </ul>
      <div class="icon">
        <i
          @click="toggleMobileNav"
          v-show="mobile"
          class="far fa-bars"
          :class="{ 'icon-active': mobileNav }"
        ></i>
      </div>
      <transition name="mobile-nav">
        <ul v-show="mobileNav" class="dropdown-nav">
          <li>
            <router-link class="link" :to="{ name: 'Home' }" @click="closeNav"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              v-if="!isAuthentif"
              class="link"
              :to="{ name: 'Register' }"
              @click="closeNav"
              >Register</router-link
            >
          </li>
          <li>
            <router-link
              v-if="!isAuthentif"
              class="link"
              :to="{ name: 'Login' }"
              @click="closeNav"
              >Login</router-link
            >
          </li>
          <li>
            <router-link v-if="isAdmin" class="link" :to="{ name: 'AddCar' }" @click="closeNav"
              >Add a car</router-link
            >
          </li>
          <li>
            <router-link
              v-if="isAdmin"
              class="link"
              :to="{ name: 'Change Admin Code' }" @click="closeNav"
              >Change admin code</router-link
            >
          </li>
          <li>
            <router-link
              v-if="isAuthentif"
              class="link"
              :to="{ name: 'Reservations' }" @click="closeNav"
              >Reservations</router-link
            >
          </li>
          <li>
            <router-link v-if="isAdmin" class="link" :to="{ name: 'Users' }" @click="closeNav"
              >Users</router-link
            >
          </li>
          <li>
            <ui-button raised v-if="isAdmin" @click="addNewCars"
              >Add new cars</ui-button
            >
          </li>
          <li>
            <ui-button raised v-if="isAuthentif" @click="logout()"
              >Logout</ui-button
            >
          </li>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script>
import utils from "../utils.js";
export default {
  name: "navigation",
  data() {
    return {
      scrolledNav: null,
      mobile: null,
      mobileNav: null,
      windowWidth: null,
    };
  },
  created() {
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
  },
  computed: {
    isAuthentif() {
      return this.$store.state.isAuthentif;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  },
  methods: {
    logout() {
      this.$store.commit("SET_AUTH", false);
      this.$store.commit("ADMIN", false);
      window.localStorage.removeItem("token");
      if (this.mobileNav == true) {
        this.mobileNav = false;
      }
      this.$router.push("/");
    },
    addNewCars() {
      let requestParameters = utils.globalRequestParameters;
      requestParameters.method = "POST";

      fetch(utils.url + "generateRandomCars", requestParameters).then((res) => {
        res.json().then((res) => {
          res.forEach((data) => {
            this.$store.dispatch("addCar", data);
            this.$store.dispatch("setNoOfPages", (this.$store.state.cars.length ) / 5);
          });
          this.mobileNav = false;
        });
      });
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
    updateScroll() {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        this.scrolledNav = true;
        return;
      }
      this.scrolledNav = false;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750 || this.windowWidth <= 768) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },
    closeNav() {
      this.mobileNav = !this.mobileNav;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: rgba(0, 0, 0, 1);
  z-index: 99;
  width: 100%;
  position: fixed;
  transition: 0.5s ease all;
  color: #fff;

  nav {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 12px 0;
    transition: 0.5s ease all;
    width: 90%;
    margin: 0 auto;
    @media (min-width: 1140px) {
      max-width: 1140px;
    }

    ul,
    .link {
      font-weight: 500;
      color: #fff;
      list-style: none;
      text-decoration: none;
    }

    li {
      text-transform: uppercase;
      padding: 15px;
      margin-left: 11px;
    }

    .mdc-button--raised.mdc-ripple-upgraded {
      background-color: #ffa900;
      font-size: 15px;
      border: 1px solid #fff;
      box-shadow: 0 12px 16px 0 rgba(255, 255, 255, 0.24),
        0 17px 50px 0 rgba(0, 0, 0, 0.19);
    }

    .link {
      font-size: 14px;
      transition: 0.5s ease all;
      padding-bottom: 4px;
      border-bottom: 1px solid transparent;

      &:hover {
        color: #ffa900;
        border-color: #ffa900;
      }
    }

    .branding {
      display: flex;
      align-items: center;

      img {
        width: 50px;
        transition: 0.5s ease all;
      }
    }

    .navigation {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: flex-end;
    }

    .icon {
      display: flex;
      position: absolute;
      top: 0;
      align-items: center;
      right: 24px;
      height: 100%;

      i {
        cursor: pointer;
        font-size: 24px;
        transition: 0.8s ease all;
      }
    }

    .icon-active {
      transform: rotate(180deg);
    }

    .dropdown-nav {
      display: flex;
      flex-direction: column;
      position: fixed;
      width: 100%;
      max-width: 250px;
      height: 100%;
      background-color: #000;
      top: 0;
      left: 0;

      li {
        margin-left: 0;
        .link {
          color: #000;
        }
      }
    }

    .mobile-nav-enter-active,
    .mobile-nav-leave-active {
      transition: 1s ease all;
    }

    .mobile-nav-enter-from,
    .mobile-nav-leave-to {
      transform: translateX(-250px);
    }

    .mobile-nav-enter-to {
      transform: translateX(0);
    }
  }
}

.scrolled-nav {
  background-color: #000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  nav {
    padding: 8px 0;

    .branding {
      img {
        width: 40px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>