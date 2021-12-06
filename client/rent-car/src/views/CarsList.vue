<template>
  <div class="container">
    <img alt="Vue logo" src="../assets/rent-car.png" />
    <Car @edit="editCar" :car="elem" v-for="elem in cars" :key="elem.id" />
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
import Car from "@/components/Car.vue";

export default {
  name: "CarList",
  components: {
    Car,
  },
  data() {
    return {
      formData: {
        id: "",
        vehicle: "",
        color: "",
        fuel: "",
        status: "",
        price: "",
      },
      pageIndex: this.$store.state.pageIndex,
      noOfPages: 0,
      pages: this.$store.state.pages,
      mobile: null,
      windowWidth: null,
    };
  },
  created() {
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();

    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    if (!this.cars.length) {
      fetch(url + "cars", requestParam).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchCars", res);
        })
      );
    }
  },
  computed: {
    cars() {
      var result = new Date();
      var today =
        result.getFullYear() +
        "-" +
        (result.getMonth() + 1) +
        "-" +
        result.getDate();
      var date = today.split("-");
      let todayYear = date[0];
      let todayMonth = date[1];
      let todayDay = date[2];

      let cars = [];
      cars = this.$store.state.cars;
      cars.sort(function (a, b) {
        return a.vehicle > b.vehicle
          ? 1
          : a.vehicle < b.vehicle
          ? -1
          : 0 || a.price - b.price;
      });
      cars.forEach((car) => {
        if (car.returnDate != undefined) {
          var date = car.returnDate.split("-");
          let year = date[0];
          let month = date[1];
          let day = date[2];
          if (car.status == false) {
            if (
              (year == todayYear && month == todayMonth && day == todayDay) ||
              year < todayYear ||
              (year == todayYear && month < todayMonth) ||
              (year == todayYear && month == todayMonth && day < todayDay)
            ) {
              car.status = true;

              let data = {
                id: car.id,
                vehicle: car.vehicle,
                color: car.color,
                fuel: car.fuel,
                status: car.status,
                price: car.price,
              };

              let requestParameters = { ...utils.globalRequestParameters };
              let token = window.localStorage.getItem("token");
              requestParameters.headers.Authorization = "Bearer " + token;
              requestParameters.method = "PUT";
              requestParameters.body = JSON.stringify(data);

              fetch(utils.url + "car/" + car.id, requestParameters)
                .then((res) => res.json())
                .then((res) => {
                  console.log(res.message);
                  if (
                    res.message === "Decoding error!" ||
                    res.message === "Your token expired!"
                  ) {
                    console.log("nu ai voie!");
                  } else {
                    this.$store.dispatch("editCar", data);
                  }
                });
            }
          }
        }
      });
      this.$store.dispatch("setNoOfPages", cars.length / 5);
      return cars.slice(
        (this.$store.state.pageIndex - 1) * 5,
        this.$store.state.pageIndex * 5
      );
    },
    isAuthentif() {
      return this.$store.state.isAuthentif;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    total() {
      let total = 0;
      total = this.$store.state.cars.length;
      return total;
    },
    groupPages() {
      if (this.$store.state.pages.length <= 5) {
        let pages = [];
        pages.push(1);
        return pages;
      } else {
        let pages = [];
        for (let i = 0; i < this.$store.state.pages.length / 5; i++) {
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
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750 || this.windowWidth <= 768) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 100px;
}

.pages {
  margin-top: 25px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
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
  background-color: #ffa900;
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

  img {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .pages {
    display: inline;
    margin-top: 25px;
    margin: 0 auto;
    justify-content: center;
  }
}
</style>