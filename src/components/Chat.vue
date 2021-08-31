<template>
  <div
    class="
      bg-pink-300
      container
      max-w-2xl
      block
      m-auto
      p-4
      lg:mt-3
      shadow-lg
      lg:rounded-lg
   
    ">
    Online: {{ connections }}
    <div
      ref="chat"
      class="h-96 overflow-overlay">
      <div class="message-content p-3 flex flex-col">
        <div
          v-if="loadMore != 0"
          class="flex justify-center"
          @click="loadMessages">
          <button class="outline-none">
            <i class="fas fa-chevron-up    "></i>
          </button> 
        </div>
        <div
          v-for="(item, index) in messages"
          :key="index"
          :class="`me-message w-11/12 rounded-lg p-2 mb-1 ${
            item.type == 1 ? 'bg-pink-100 ml-auto' : 'bg-pink-200 mr-auto'
          }`">
          <div>{{ item.message }}</div>
          <div class="flex items-end flex-col">
            <span>{{ item.username }}</span>
            <span>{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center justify-center">
        <textarea
          v-model="newMessage"
          class="
          placeholder-white
          bg-pink-200
          rounded-md
          px-3
          text-lg
          outline-none
          py-1
          w-10/12
          float-left
        "
          placeholder="Nhập nội dung"
          rows="2"></textarea>
        <button
          class="
          pl
          mx-2
          px-3
          py-2
          bg-yellow-100
          shadow-2xl
          font-semibold
          rounded-full
          whitespace-nowrap
          float-left
        "
          @click="send">
          Gửi
        </button>
      </div>
      <div class="w-full flex justify-center">
        <router-link
          :to="{path:'/'}"
          class="
          mt-3
          pl
          mx-2
          px-3
          py-2
          bg-yellow-100
          font-semibold
          rounded-full
         
        "
          @click="send">
          Quay về phòng chat
        </router-link>
      </div>
    </div>
    <div class="clear-both"></div>
  </div>
</template>
<script>
import { io } from "socket.io-client";
import { useRoute,useRouter } from "vue-router";
import { ref, reactive, onMounted, watchEffect,getCurrentInstance } from "vue";


export default {
  name: "Chat",
  setup(props, context) {

     const internalInstance = getCurrentInstance()
    const auth = internalInstance.appContext.config.globalProperties.auth;
    const route = useRoute();
    const router = useRouter();
    const chat = ref(null);

    let newMessage = ref(null);
    //  let typing = ref(false);
    //  let ready = ref(false);
    let info = reactive([]);
    let connections = ref(0);
    let loadMore = ref(0);
    const messages = reactive([]);
    const username = ref("");
    const email = ref("");
    const room = ref(route.query.id_room);
    email.value = route.query.email;
         const socket = io("http://localhost:8000", {
      transports: ["websocket", "polling", "flashsocket"],
      query:'email='+ email.value
    },);
    socket.on("connect", function () {
      let user = {
        room: room.value,
        token: auth.token(),
        email: email.value,
      };
      socket.emit("room", user);
    });
    socket.on("auth", (auth) => {
     if(!auth){
       alert("Lỗi xác thực!!!")
        router.push('/');
     }else{
       username.value = auth.username;
     }
    });
    socket.on("connections", (data, message) => {
      if (messages.length == 0){
        if(message.length == 6){
        
          loadMore.value = message.length;
           message.pop();
        }
        message.map((currentValue) => {
          messages.unshift(currentValue);
        });
      }
      connections.value = data;
      setTimeout(function () {
        setScrollTop();
      }, 300);
    });
    socket.on("disconnectroom", (data) => {
      connections.value = data;
    });
    socket.on("chat-message", (data) => {
      messages.push({
        message: data.message,
        type: data.username == username.value? 1 : 2,
        username: data.username,
        time: data.time,
      });
      setTimeout(function () {
        setScrollTop();
      }, 300);
    });

    const setScrollTop = () => {
      let scrollHeight = chat.value.scrollHeight;
      chat.value.scrollTop = scrollHeight;
    };
    const send = () => {
      var time = new Date();
      info.value = {
        room: room.value,
        username: username.value,
        email: email.value,
        message: newMessage.value,
        token: auth.token(),
        time:
          time.getHours() + ":" + time.getMinutes(),
      };
      socket.emit("chat-message", info.value);
      info.value.type = 1;
      messages.push(info.value);
      newMessage.value = "";
      setTimeout(function () {
        setScrollTop();
      }, 300);
    };
    const loadMessages = () =>{
      let user = {
        room: room.value,
        token: auth.token(),
        email: email.value,
        offset: loadMore.value
      };
      socket.emit("loadmore", user);

    }
   socket.on("loadmore", (message) => {
      if(message.length != 0){
          loadMore.value = loadMore.value + message.length;
          if(message.length < 7){
              loadMore.value = 0;
          }
          message.shift();
          message.map((currentValue) => {
          messages.unshift(currentValue);
        });
      }
    
    });

    return {
      username,
      chat,
      room,
      newMessage,
      messages,
      connections,
      send,
      loadMore,
      loadMessages
    };
  },
};
</script>
<style scss>
.overflow-overlay {
  overflow: overlay;
}
</style>
