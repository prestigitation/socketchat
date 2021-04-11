<template>
  <div class="login-form">
   Вход
  <q-input v-model="login" type="text" placeholder="Введите логин"></q-input>
  <q-input v-model="password" type="password" placeholder="Введите пароль"></q-input>
  <q-btn type="submit" color="primary" class="q-mt-sm" @click.prevent="loginUser"> Войти </q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login : '',
      password : '',
    }
  },
  methods : {
    async loginUser() {
      await this.$axios.post('http://localhost:5791/login',{
          login : this.login,
          password : this.password
        }, {
          'Content-Type': 'application/json'
        }).then((user) => {
          this.$store.dispatch('auth',[user.data.id,user.data.login])
        })
    }
  }
}
</script>

<style>
.login-form {
    display:flex;
    height: 94%;
    justify-content:center;
    align-items:center;
    flex-direction: column;
  }
</style>
