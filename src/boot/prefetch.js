import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import Vue from 'vue'
const socket = io('http://localhost:5792');

Vue.use(VueSocketIOExt, socket);

Vue.component('Index', require('../pages/Index.vue').default)
Vue.component('Register', require('../pages/Register.vue').default)
Vue.component('Login', require('../pages/Login.vue').default)
