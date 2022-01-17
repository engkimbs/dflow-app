<template>
    <v-btn id="userButton"
           style="padding-right: 10px; min-width: 240px; max-width: 240px; justify-content: left">
      <v-icon size="30px" style="
      color:white !important;
      padding-left: 0;
      padding-right: 10px;">mdi-account</v-icon>
      <div style="color:white !important; font-weight: bold">{{fullName}}</div>
    </v-btn>
</template>
<script>
export default {
  name: 'User',
  created() {
    window.IPC.receive('get-user-info', (user) => {
      this.user = user
    })
  },
  mounted() {
    window.IPC.send('get-user-info')
  },
  computed: {
    fullName: function() {
      if(this.user.name !== 'demo')
        return this.user.name + '님'
      else
        return 'demo'
    }
  },
  methods: {
  },
  data: () => ({
    user: ''
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
