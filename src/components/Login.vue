<template>
  <v-dialog v-model="loginDialog" persistent
            width="300px" height="800px">
    <template v-slot:activator="{on, attrs}">
      <v-btn id="loginButton" style="padding-right: 10px" v-bind="attrs" v-on="on">
        <v-icon size="30px" style="color:white !important; padding-right: 10px;">mdi-login</v-icon>
        <div style="color:white !important; font-weight: bold"> 로그인</div>
      </v-btn>
    </template>
    <v-card class="elevation-12">
      <v-toolbar id="loginToolBar" style="background-color:green !important; justify-content: center">
        <v-toolbar-title style="font-weight: bold">로그인</v-toolbar-title>
        <v-spacer/>
        <v-icon color="white" size="20px" @click="loginDialog=false">mdi-close</v-icon>
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
      <v-text-field solo
                    id="password"
                    label="비밀번호"
                    placeholder="비밀번호"
                    required
                    prepend-icon="mdi-lock"
                    outlined
                    v-model="password"
                    style="padding: 0px 15px 0px 15px"
                    type="password"
      >
      </v-text-field>
      <v-card-actions style="justify-content: center">
        <v-btn id="login" color="blue darken-1" text @click="loginDialog= false">로그인 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'Login',
  data: () => ({
    loginDialog: false,
    account: '',
    password: '',
  }),
}
</script>
<style lang="scss">

#loginToolBar {
  .v-toolbar__content{
    background-color: #7952a1;
    justify-content: center;
  }
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
