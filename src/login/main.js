import Vue from 'vue'
import Login from '../components/LoginWindow'
import vuetify from '../plugins/vuetify'
import mixins from '../mixins'

Vue.config.productionTip = false

Vue.mixin(mixins)

new Vue({
    vuetify,
    render: h => h(Login)
}).$mount('#app')
