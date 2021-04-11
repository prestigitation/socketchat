<template>
  <div class="chat-window">
    <div class="chat-auth" v-if="$store.getters.userId == undefined && $store.getters.userName == undefined">
      <div>
        Добро пожаловать на сервис Chatter
      </div>
      <div class="block q-mt-xs">
        <router-link to="/login">
          <q-btn color="deep-orange" glossy label="Войти" />
        </router-link>
        <router-link to="/register">
          <q-btn color="primary" label="Зарегистрироваться" />
        </router-link>
      </div>
    </div>

    <div class="chat-index" v-else>
      <aside class="chat-aside">
        <input type="text" class="chat-search" @change="searchUser" v-model="search" placeholder="Найти пользователя">
        <div v-if="searchingUsers != []" class="chat-user-container">
          <div
          @click.prevent="startChat(user.id,user.login)"
          role="button"
          v-for="user in searchingUsers"
          :key="user"
          class="chat-user">
              {{ user.login }}
              <span id="chat-dialog-button">
                >
              </span>
          </div>
        </div>
      </aside>
      <main class="chat-main">
        <div v-if="!$store.getters.penmateId && !$store.getters.penmateName">
          Выберите пользователя, чтобы начать с ним диалог
        </div>
        <div class="main-chat-container" v-else>
          <div class="main-chat-header">
            {{ $store.getters.penmateName }}
          </div>
          <div class="main-chat-messages">
            <q-scroll-area class="flex scroll" style="height: 100%; width: 100%;" ref="scrollArea" id="scrollArea">
              <div v-for="message in messageList" :key="message" class="q-py-xs message flex" :style="message.login == $store.getters.userName ? 'align-self:flex-end; background-color : #66b3ff;color:white' : 'align-self:flex-start'">
                <div class="text-center">
                  {{ message.login }}
                </div>
                <div class="main-message-text">
                  {{ message.message }}
                </div>
                <div>
                  {{ message.time }}
                </div>
              </div>
            </q-scroll-area>
          </div>
          <div class="main-chat-message">
              <div class="chat-message-form">
                <input type="text" placeholder="Введите текст сообщения" v-model="message" id="message">
                <button type="submit" id="chat-message-submit" @click.prevent="sendMessage"> > </button>
              </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { scroll } from 'quasar'
const { getScrollHeight,setScrollPosition,getScrollTarget } = scroll
export default {
  data() {
    return {
      search : '',
      searchingUsers : [],
      message: '',
      messageList : [],
      isUserMessage : false
    }
  },
  methods : {
    async searchUser() {
      if(this.search!= '') {
        await this.$axios.post('http://localhost:5791/search',{
         search : this.search
         },{
          'Content-Type': 'application/json'
        }).then(json => {
          json.data.forEach(item => {
            this.searchingUsers.push(item)
          })
        })
      }
    },
    async startChat(id,login) {
      if(this.messageList!= []) {
        this.messageList = [] // очистить предыдущие сообщения от других пользователей
      }
    /*  let scrollArea = document.getElementById("scrollArea")
      let target = getScrollTarget(scrollArea)
      let vueScroll = this.$refs.scrollArea
      let scrollAreaHeight = getScrollHeight(scrollArea)
      vueScroll.setScrollPosition(vueScroll,200)
      console.log(scrollAreaHeight)
      scrollArea.scrollTo(scrollAreaHeight,scrollAreaHeight)*/
      // получение id комнаты
      this.$store.dispatch('penmate',[id,login])
      await this.$axios.post('http://localhost:5791/room',{
        userId: this.$store.getters.userId,
        userName : this.$store.getters.userName,
        penmateId : id,
        penmateName : login
      },{
          'Content-Type': 'application/json'
      }).then(json => {
        this.$store.dispatch('room',json.data)
        this.$socket.client.emit('joinRoom',json.data)
      })



      // получение сохраненных сообщений
      this.$socket.client.emit('getAllMessages',this.$store.getters.room)
      /*vueScroll.$emit('scroll',{position : scrollAreaHeight, direction:"down",
directionChanged:true,
inflexionPosition:0})*/
    },
    async sendMessage() {
      let message = await this.$socket.client.emit('newMessage', {
        senderId : this.$store.getters.userId,
        roomId : this.$store.getters.room,
        message : this.message
      })
      // возвращаем только sender_id(вытащить name из него), message и time
    }
  },
  name: 'PageIndex',
  async mounted() {
    this.$socket.$subscribe('frontendMessage',async (message)=> {
      this.messageList.push(message)
      console.log(message)
    })
    this.$socket.$subscribe('loadMessages', (messages) => {
      this.messageList = messages
    })
  },
}
</script>

<style>
  .chat-auth {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .chat-window {
    height:94%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }

  .chat-index {
    min-height: 854px;
    height:100%;
    width:100%;
    display:flex;
    flex-direction:row;
    flex-basis: 100%;
  }
  .chat-aside {
    flex-basis:20%;
  }
  .chat-main {
    flex-basis: inherit;
    display: flex;
  }

  .chat-search {
    padding: 5px;
    display:flex;
    border-radius: 15px;
    border-top: 3px solid black;
    border-right: 3px solid rgb(88, 165, 209);
    border-left: 3px solid rgb(88, 165, 209);
    border-bottom: 3px solid black;
    margin-top: 10px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .chat-user-container {
    border-right: 1px solid black;
    margin-right:10px;
    height:100%;
    margin-top: 10px;
  }

  .chat-message-form {
    height:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .chat-user {
    border : 2px solid black;
    padding : 5px;
    text-align: center;
    width:90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    margin-bottom:5px;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 15px;
  }

  .chat-user:hover {
    background-color : rgb(118, 184, 228);
    color : white;
  }
  .message {
    display: grid;
    margin-right: 20px;
    margin-left: 20px;
    margin-top:10px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid black;
    width: 200px;
    height: auto;
  }
  .main-chat-header {
    height: 50px;
    width: 100%;
    align-items: center;
    display:flex;
    position: relative;
    border-bottom: 1px solid grey;
    text-align: center;
  }
  .main-message-text {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    max-height: 500px;
  }

  .main-chat-container {
    width: 100%;
  }

  .main-chat-message {
    height: 50px;
    border-top: 1px solid black;
  }

  #chat-dialog-button {
    float: right;
  }

  .main-chat-messages {
    height:95%;
    max-height:947px;
  }

  .messages {
    max-height: 947px;
  }

  #message {
    width:60%;
    display:inline-flex;
  }

  #chat-message-submit {
    display:inline-flex;
    text-align: center;
    justify-content: center;
    justify-self: center;
    width:33px;
    height:33px;
  }

  .full-width {
    display:flex;
    flex-direction: column;
    justify-content:center;
  }

</style>
