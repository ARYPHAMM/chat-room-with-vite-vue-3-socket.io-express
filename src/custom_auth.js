// import axios from "axios";

// const API_URL = "http://localhost:8000/api/auth/";

// class Auth {
//   login(user) {
//     return axios
//       .post(API_URL + "signin", {
//         username: user.username,
//         password: user.password,
//       })
//       .then((response) => {
//         if (response.data.accessToken) {
//           localStorage.setItem("user", JSON.stringify(response.data));
//         }

//         return response.data;
//       });
//   }

//   logout() {
//     localStorage.removeItem("user");
//   }

//   register(user) {
//     return axios.post(API_URL + "signup", {
//       username: user.username,
//       email: user.email,
//       password: user.password,
//     });
//   }
// }

// export default new Auth();
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split(".").reduce((o, i) => {
        if (o) return o[i];
      }, options);
    };
    app.abc = function () {
      console.log(123);
    };
    app.provide("custom_auth", options);

    app.directive("my-directive", {
      mounted(el, binding, vnode, oldVnode) {},
    });

    app.mixin({});
  },
};
