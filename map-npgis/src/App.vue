<template>
  <div id="app">
    <map-demo />
  </div>
</template>

<script>
import MapDemo from "./components/MapDemo.vue";
export default {
  name: "app",
  components: {
    MapDemo
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
