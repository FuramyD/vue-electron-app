<template>
  <router-view />
</template>

<script>
  export default {
    name: "App",
    created() {
      this.$router.push('/')
    },
    async mounted() {
      window.ipcRenderer = require('electron').ipcRenderer
      await this.$store.dispatch('requestScripts')
    }
  };
</script>

<style lang="less">
*,
*:after,
*:before {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
</style>
