<template>
  <div
    class="
      bg-pink-300
      container
      max-w-2xl
      block
      m-auto
      p-4
      mt-3
      shadow-lg
      rounded-lg
    ">
    Online:  {{ connections }}
    <div
      ref="chat"
      class="h-96 overflow-overlay">
      <div class="message-content p-3 flex flex-col">
        <div
          v-for="item,index in messages"
          :key="index"
          :class="`me-message w-11/12 rounded-lg p-2 mb-1 ${item.type == 1 ? 'bg-pink-100 ml-auto': 'bg-pink-200 mr-auto'}`">
          <div>{{ item.message }}</div>
          <div class="flex justify-end">
            {{ item.time }} {{ item.username }}
          </div>
        </div>
      </div>
    </div>
    <div>
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
    <div class="clear-both"></div>
  </div>
</template>
<script>
import { io } from "socket.io-client";
import { useRoute } from 'vue-router';
import { ref,reactive,onMounted,watchEffect   } from 'vue';

const socket = io("http://localhost:8000", {transports: ["websocket", "polling", "flashsocket"],});
export default {
  name: "Chat",
  setup(props, context) { 
     const route = useRoute();
     const chat = ref(null)

     let newMessage = ref(null);
    //  let typing = ref(false);
    //  let ready = ref(false);
     let info = reactive([]);
     let connections = ref(0);
     const messages = reactive([]);
     const username = ref('');
     const room = ref(route.query.id_room);
     socket.on('connect', function() {
      socket.emit('room', room.value);
     });
     socket.on('connections', (data) => { 
         connections.value = data;
     });
     socket.on('disconnectroom', (data) => { 
         connections.value = data;
     });
     socket.on('chat-message', (data) => {
         messages.push({
                    message: data.message,
             type: 2,
               username: data.username,
               time: data.time,
         });
           setTimeout(function () { setScrollTop() }, 300);
    });
    onMounted(() => {
      username.value = route.query.id;
    });
    const setScrollTop = ()=>{
     let scrollHeight = chat.value.scrollHeight;
      chat.value.scrollTop = scrollHeight; 
    }
    const send = () =>{
      var time = new Date();
      info.value = {room: room.value, username: username.value, message: newMessage.value,time: time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()};
      socket.emit('chat-message', info.value);
      info.value.type = 1;
      messages.push(info.value);
      newMessage.value = "";
      setTimeout(function () { setScrollTop() }, 300);
   }

  return {
    username,
    chat,
    room,
    newMessage,
    messages,
    connections,
    send
  }
  },
};
</script>
<style scss>
.overflow-overlay{
  overflow: overlay;
}
</style>
