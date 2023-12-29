<template>
  <div id="app">
    <Memory />
  </div>
</template>

<script>
import Memory from "./components/Memory.vue";

export default {
  components: {
    Memory,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
