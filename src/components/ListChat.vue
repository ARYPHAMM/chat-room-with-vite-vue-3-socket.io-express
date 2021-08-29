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
      <div class="flex justify-center">
        <input
          v-model="name"
          type="text"
          class="
            placeholder-white
            bg-pink-200
            rounded-md
            px-3
            text-lg
            outline-white
            py-1
          "
          placeholder="Nhập tên tài khoản" />
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
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import router from "../router";
export default {
  setup(props, context) {
    const radio = ref("");
    const name = ref("");
    const go = () => {
      if (radio.value == "") {
        alert("Vui lòng chọn phòng chat!");
      } else {
        // router.push({
        //     path: '/chat', 
        //     query: { id: name.value,id_room: radio.value }
        // });
         window.location.href = `chat?id=${name.value}&id_room=${radio.value}`;
      }
    };
    return {
      radio,
      name,
      go,
    };
  },
};
</script>
<style></style>
