<template>
  <div class="container min-w-full  min-h-screen flex justify-center flex-col  m-auto bg-gradient-to-r from-pink-100 to-blue-200">
    <form
      action=""
      class="lg:max-w-3xl block m-auto lg:w-6/12 w-full"
      @submit.prevent="register">
      <h1 class="font-bold text-2xl text-center mb-3">
        Đăng ký tài khoản
      </h1>
      <div class="mx-2">
        <input
          v-model="fullname"
          type="text"
          required
          class="w-full lg:w-3/6 md:w-3/6 px-2 text-md  bg-pink-200 placeholder-white py-2 rounded-md mb-3  shadow-sm outline-none block m-auto"
          placeholder="Nhập họ tên..." />
      </div>
      <div class="mx-2">
        <input
          v-model="username"
          type="text"
          required
          class="w-full lg:w-3/6 md:w-3/6 px-2 text-md  bg-pink-200 placeholder-white py-2 rounded-md mb-3 shadow-sm outline-none block m-auto"
          placeholder="Nhập tên tài khoản..." />
      </div>
      <div class="mx-2">
        <input
          v-model="email"
          type="text"
          required
          class="w-full lg:w-3/6 md:w-3/6 px-2 text-md  bg-pink-200 placeholder-white py-2 rounded-md mb-3 shadow-sm outline-none block m-auto"
          placeholder="Nhập email..." />
      </div>
      <div class="mx-2">
        <input
          v-model="password"
          required
          type="password" 
          class="w-full lg:w-3/6 md:w-3/6 px-2 text-md  bg-pink-200 placeholder-white py-2 rounded-md mb-3 shadow-sm outline-none block m-auto"
          placeholder="Nhập password..." />
      </div>
      <div class="flex justify-center">
        <button class="bg-yellow-100 px-5 py-2 rounded-3xl font-semibold shadow-inner border  transition-all outline-none hover:bg-yellow-400">
          Đăng ký
        </button>
        <router-link
          :to="{path:'/'}"
          class="bg-yellow-100 px-5 py-2 rounded-3xl font-semibold shadow-inner border  transition-all outline-none hover:bg-yellow-400">
          Trở về đăng nhập
        </router-link>
      </div>
    </form>
  </div>
</template>
<script>
import { ref,getCurrentInstance  } from "vue";
import { useRouter } from "vue-router";

export default {
  setup(){
   const internalInstance = getCurrentInstance()
   const auth = internalInstance.appContext.config.globalProperties.auth;
   const username = ref('');
   const fullname = ref('');
   const email = ref('');
   const password = ref('');
   const router = useRouter();
   const register = () =>{
      let data ={
        username: username.value,
        fullname: fullname.value,
        email: email.value,
        password: password.value
      }
      auth.register(data,'/api/register').then((response) => {
        if(response.data){
            alert("Dang ky thanh cong");
            router.push('/');
        }else{
            alert("Tai khoan ban dang ky da ton tai");
        }
      });
     
   }
   return{
    username,
    email,
    fullname,
    password,
    register
   }
 }
}
</script>
<style>
</style>