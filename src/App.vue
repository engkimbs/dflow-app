<template>
  <h1 id="version">{{version}}</h1>
  <div class="hello">
    <h1>{{msg}}</h1>
    <p>Updates State: {{state}}</p>
  </div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'App',
    mounted() {
      window.ipcKey.receive("updater", (message) => {
        this.state = message;
        switch (message) {
          case "update_available":
            this.state = "Available";
            break;
          case "update_not_available":
            this.state = "Not Available";
            break;
        }
      })
      window.ipcKey.send("initialize", "start to initialize")
    },
    data() {
      return {
        version: process.env.VUE_APP_VERSION,
        state: "Thinking..."
      }
    },
    methods: {
    },
    props: {
      msg: String,
    },
    components: {
      HelloWorld
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
