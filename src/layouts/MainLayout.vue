<template>
  <div class="main">
    <header class="main-header">
      <span> {{ '' ||  $store.getters.userName }}</span>
      <span>
        <router-link to="/">
          Chatter
        </router-link>
      </span>
      <span role="button" @click.prevent="$store.dispatch('logout')">
        Выйти
      </span>
    </header>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
    }
  }
}
</script>

<style>
  .main {
    font-size: 18px;
    height:100%;
    min-height: 967px;
  }
  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height:50px;
    background-color: rgb(68, 150, 182);
    color: white;
  }
</style>
