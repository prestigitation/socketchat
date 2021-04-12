<template>
  <div class="auth-form">
    <div class="text-center">
      <div> Регистрация </div>
      <div>
        <q-form>
        <q-input v-model="login" type="text" placeholder="Придумайте логин"></q-input>
        <q-input v-model="email" type="text" placeholder="Введите адрес электронной почты"></q-input>
        <q-input v-model="password" type="password" placeholder="Придумайте пароль"></q-input>
        <q-btn type="submit" color="primary" class="q-mt-sm" @click.prevent="register"> Отправить </q-btn>
      </q-form>
      </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login : '',
      email : '',
      password : '',
    }
  },
  methods : {
     async register() {
      let query = await this.$axios.post('http://localhost:5791/register',{
          login : this.login,
          email : this.email,
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
  .auth-form {
    display:flex;
    height: 94%;
    justify-content:center;
    align-items:center;
    flex-direction: column;
  }
</style>
