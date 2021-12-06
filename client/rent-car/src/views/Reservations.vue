<template>
  <div class="container">
    <h1>Reservations</h1>
    <Reservation
      :reservation="elem"
      v-for="elem in reservations"
      :key="elem.id"
    ></Reservation>
    <div v-show="!mobile" class="pages">
      <ui-button
        outlined
        v-for="elem in this.$store.state.pages"
        :key="elem"
        @click="changePage(elem)"
      >
        {{ elem }}
      </ui-button>
    </div>
    <div v-show="mobile" class="pages">
      <ui-button
        outlined
        v-show="this.$store.state.pages.length <= 5"
        v-for="elem in this.$store.state.pages"
        :key="elem"
        @click="changePage(elem)"
      >
        {{ elem }}
      </ui-button>
      <div v-for="elemG in groupPages" :key="elemG">
        <ui-button
          outlined
          v-show="this.$store.state.pages.length > 5"
          v-for="elem in this.$store.state.pages.slice(
            (elemG - 1) * 5,
            elemG * 5
          )"
          :key="elem"
          @click="changePage(elem)"
        >
          {{ elem }}
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";
import Reservation from "@/components/Reservation.vue";

export default {
  name: "Reservations",
  components: {
    Reservation,
  },
  data() {
    return {
      isAdmin: this.$store.state.isAdmin,
      isAuthentif: this.$store.state.isAuthentif,
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
    if (!this.reservations.length) {
      fetch(url + "reservations", globalRequestParameters).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchReservations", res);
        })
      );
    }
  },
  computed: {
    reservations() {
      let reservations = [];
      this.$store.state.reservations.forEach(element => {
        if(this.isAdmin == true) {
          reservations = this.$store.state.reservations;
        } else if(this.isAuthentif == true && element.userId == this.$store.state.userId) {
              reservations.push(element)
          }
      });
      this.$store.dispatch("setNoOfPages", reservations.length / 5);
      return reservations.slice(
        (this.$store.state.pageIndex - 1) * 5,
        this.$store.state.pageIndex * 5
      );
    },
    groupPages() {
      if (this.$store.state.pages.length <= 5) {
        let pages = [];
        pages.push(1);
        return pages;
      } else {
        let pages = [];
        for (let i = 0; i < this.$store.state.pages.length / 5 ; i++) {
          pages.push(i + 1);
        }
        return pages;
      }
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
  // height: 96.8vh;
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
  .pages {
    display: inline;
    margin-top: 25px;
    margin: 0 auto;
    justify-content: center;
  }
  .container {
    height: 100hv;
    padding-top: 141px;
  }
}
</style>