<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  async mounted() {
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
