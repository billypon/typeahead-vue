import Vue from 'vue'
import VueTypeahead from 'components/typeahead'

Vue.component('v-typeahead', VueTypeahead)

Vue.config.debug = true
Vue.config.devtools = true

import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
})
