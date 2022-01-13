import Vue from 'vue'
//import App from './App.vue'
import LoginWindow from '@/components/LoginWindow.vue'
import vuetify from './plugins/vuetify'
import mixins from './mixins'

Vue.config.productionTip = false

Vue.mixin(mixins)

new Vue({
  vuetify,
  render: h => h(LoginWindow)
}).$mount('#app')
