<template>
  <v-card class="elevation-12" height="280px">
    <v-toolbar id="loginToolBar" style="background-color:green !important; justify-content: center">
      <v-toolbar-title style="font-weight: bold; color: white !important;">NDB</v-toolbar-title>
      <v-spacer/>
      <v-icon size="20px" style="color: white !important;" @click="close">mdi-close</v-icon>
    </v-toolbar>
    <v-text-field solo
                  id="account"
                  label="아이디"
                  placeholder="아이디"
                  required
                  prepend-icon="mdi-account"
                  outlined
                  v-model="account"
                  style="color:black !important; padding: 20px 15px 0px 15px">
    </v-text-field>
    <!--      <v-text-field solo-->
    <!--                    id="password"-->
    <!--                    label="비밀번호"-->
    <!--                    placeholder="비밀번호"-->
    <!--                    required-->
    <!--                    prepend-icon="mdi-lock"-->
    <!--                    outlined-->
    <!--                    v-model="password"-->
    <!--                    style="padding: 0px 15px 0px 15px"-->
    <!--                    type="password"-->
    <!--      >-->
    <!--      </v-text-field>-->
    <v-card-actions style="justify-content: center">
      <v-btn id="login" color="blue darken-1" text @click="login">로그인</v-btn>
    </v-card-actions>
    <v-card-actions v-if="loginFail" style=" justify-content: center; transition: opacity ease 2s 1s; opacity: 0; ">
      <v-btn style="background-color: black; color: white">등록되지 않은 사용자입니다.</v-btn>
    </v-card-actions>
    <v-card-actions v-else style="padding: 1px 10px 2px 60px; color: white !important; "></v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'Login',
  created() {
    window.IPC.receive('login-reply', (evt) => {
      console.log(evt)
      this.loginFail = evt
    })
  },
  methods: {
    async login() {
      await window.IPC.send('login', this.account, this.password)
    },
    async close() {
      await window.IPC.send('login-window-close')
    }
  },
  data: () => ({
    username: '',
    loginFail: false,
    account: '',
    password: '',
  }),
}
</script>
<style lang="scss">

body {
  -webkit-app-region: drag;
}

input {
  -webkit-app-region: no-drag;
}

button {
  -webkit-app-region: no-drag;
}

::-webkit-scrollbar {
  display: none;
}

#loginToolBar {
  .v-toolbar__content {
    background-color: #7952a1;
    justify-content: center;
  }
}

.v-input__control {
  margin-left: 10px;
}

.v-text-field__details {
  min-height: 0px;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px !important;
}

label[for=account] {
  color: black !important;
}

label[for=password] {
  color: black !important;
}

input#account {
  color: black !important;
}

#login {
  background-color: dodgerblue;
  color: white !important;
  width: 150px;
}

#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-input.theme--light.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--is-booted.v-text-field--enclosed.v-text-field--outlined.v-text-field--placeholder > div.v-input__control > div.v-input__slot > div > label {
  color: darkgray !important;
}

#app > div.v-dialog__content.v-dialog__content--active > div > div > div:nth-child(3) > div.v-input__control > div.v-input__slot > div > label {
  color: darkgray !important;
}
</style>
