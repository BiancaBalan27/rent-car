<template>
  <div class="gridRow">
    <ui-grid>
      <ui-grid-cell>{{user.lastName}}</ui-grid-cell>
      <ui-grid-cell>{{user.firstName}}</ui-grid-cell>
      <ui-grid-cell>{{user.email}}</ui-grid-cell>
    </ui-grid>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    user: Object,
  },
};
</script>

<style lang="scss" scoped>
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