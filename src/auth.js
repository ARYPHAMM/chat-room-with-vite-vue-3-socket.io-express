import axios from "axios";
class Auth {
  constructor(obj) {
    this.fetchPath = obj.fetchPath || null;
    this.path = obj.path || null;
    this.fetchTime = obj.fetchTime || null;
    if (obj.autoFetch) this.fetch();
  }
  async login(user, path) {
    return new Promise((resolve, reject) => {
      const item = axios
        .post(this.path + path, user)
        .then((response) => {
          if (response.data) {
            localStorage.setItem("user", response.data.accessToken);
            return resolve(true);
          } else {
            return reject(false);
          }
        })
        .catch((error) => reject(false));
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  async fetch() {
    setInterval(
      () => {
        if (this.token() != null) {
          const item = axios
            .post(
              this.path + this.fetchPath,
              {},
              {
                headers: {
                  Authorization: "Bearer " + this.token(),
                },
              }
            )
            .then((response) => {
              // this.user = response.data;
            })
            .catch((error) => {
              // this.user = false;
              localStorage.removeItem("user");
            });
        } else {
          // this.user = false;
          localStorage.removeItem("user");
        }
      },
      this.fetchTime == null ? 10000 : this.fetchTime
    );
  }
  token() {
    return localStorage.getItem("user");
  }
  async user() {
    return new Promise((resolve, reject) => {
      axios
        .post(
          this.path + this.fetchPath,
          {},
          {
            headers: {
              Authorization: "Bearer " + this.token(),
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          // this.user = false;
          localStorage.removeItem("user");
          reject(false);
        });
    });
  }
  async register(user, path) {
    const item = await axios.post(this.path + path, user);
    return item;
  }
}

export default Auth;
//export default new Auth();
