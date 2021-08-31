<template>
  <div class="flex h-screen w-full">
    <div
      class=" container
        max-w-3xl
        shadow-md
        border-t border-gray-100
        w-full
        block
        m-auto
        px-3
        py-3
      ">
      <h1 class="font-bold text-2xl">
        Chọn phòng chat
      </h1>
      <div class="flex flex-wrap">
        <div class="flex">
          <input
            id="food"
            v-model="radio"
            value="food"
            name="choose"
            class="choose hidden"
            type="radio" />
          <label
            for="food"
            class="m-2 px-3 py-3 bg-pink-100 shadow-sm rounded-full">
            <i class="fas fa-utensil-fork"></i>
            <span> Ẩm thực </span>
          </label>
        </div>
        <div class="flex">
          <input
            id="sport"
            v-model="radio"
            value="sport"
            name="choose"
            class="choose hidden"
            type="radio" />
          <label
            for="sport"
            class="m-2 px-3 py-3 bg-pink-100 shadow-sm rounded-full">
            <i class="fas fa-running"></i>
            <span> Thể thao </span>
          </label>
        </div>
        <div class="flex">
          <input
            id="travel"
            v-model="radio"
            value="travel"
            name="choose"
            class="choose hidden"
            type="radio" />
          <label
            for="travel"
            class="m-2 px-3 py-3 bg-pink-100 shadow-sm rounded-full">
            <i class="fas fa-plane-departure"></i>
            <span> Du lịch </span>
          </label>
        </div>
        <div class="flex">
          <input
            id="game"
            v-model="radio"
            value="game"
            name="choose"
            class="choose hidden"
            type="radio" />
          <label
            for="game"
            class="m-2 px-3 py-3 bg-pink-100 shadow-sm rounded-full">
            <i class="fas fa-gamepad"></i>
            <span> Trò chơi </span>
          </label>
        </div>
        <div class="flex">
          <input
            id="music"
            v-model="radio"
            value="music"
            name="choose"
            class="choose hidden"
            type="radio" />
          <label
            for="music"
            class="m-2 px-3 py-3 bg-pink-100 shadow-sm rounded-full">
            <i class="fas fa-music"></i>
            <span> Âm nhạc </span>
          </label>
        </div>
      </div>

      <div
        
        class="flex justify-center">
        <input
          v-if="!login"
          v-model="email"
          type="text"
          class="
          mx-1
            placeholder-white
            bg-pink-200
            rounded-md
            px-3
            text-lg
            outline-none
            py-1
          "
          placeholder="Nhập email" />
        <input
          v-if="!login"
          v-model="password"
          type="password"
          class="
          mx-1
            placeholder-white
            bg-pink-200
            rounded-md
            px-3
            text-lg
            outline-none
            py-1
          "
          placeholder="Nhập mật khẩu" />
        <div
          v-if="login"
          class="flex items-center">
          Account: {{ username }}
        </div>
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
          "
          @click="go">
          Tham gia
        </button>
        <button
          v-if="login"
          class="
            pl
            mx-2
            px-3
            py-2
            bg-yellow-100
            shadow-2xl
            font-semibold
            rounded-full
          "
          @click="logout">
          Đăng xuất
        </button>
        <router-link
          v-if="!login"
          :to="{path:'/dang-ky'}"
          class="
            pl
            mx-2
            px-3
            py-2
            bg-yellow-100
            shadow-2xl
            font-semibold
            rounded-full
          ">
          Đăng ký
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { ref,getCurrentInstance,onMounted  } from "vue";
import router from "../router";
export default {
  setup(props, context) {
    const internalInstance = getCurrentInstance()
    const auth = internalInstance.appContext.config.globalProperties.auth;
    const radio = ref("");
    const username = ref("");
    const password = ref("");
    const email = ref("");
    const login = ref(false);
    
    onMounted(()=>{
      auth.user().then(res=>{
          login.value = true;
          username.value = res.username;
          email.value = res.email
      });
    })
    const go = () => {
      if (radio.value == "") {
        alert("Vui lòng chọn phòng chat!");
      } else {
          if(!login.value){
            let data = {
            email: email.value,
            password: password.value
            }
            auth.login(data,'/api/login').then((response) => {
                window.location.href = `chat?email=${email.value}&id_room=${radio.value}`;
            }).catch(error=>{
              alert("Kiem tra lai tai khoan va mat khau!");
            });
        }else{
          window.location.href = `chat?email=${email.value}&id_room=${radio.value}`;
        }
      }
    };
   const logout = () => {
     auth.logout();
     login.value = false;
     username.value = null;
     email.value = ""
   };
    return {
      radio,
      password,
      email,
      username,
      login,
      go,
      logout,
    };
  },
};
</script>
<style></style>
