import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import messagePlugin from '@/utils/message.plugin.js'
import './registerServiceWorker'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.use(VueMeta)
Vue.filter('dateFilter', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.component('Paginate', Paginate)

const firebaseConfig = {
  apiKey: "AIzaSyCq4Ro-1W46Lx7LDu9RaltMKtTSFoS9-ls",
  authDomain: "vue-crm-exfinance-2bd89.firebaseapp.com",
  projectId: "vue-crm-exfinance-2bd89",
  storageBucket: "vue-crm-exfinance-2bd89.appspot.com",
  messagingSenderId: "616287827345",
  appId: "1:616287827345:web:a9ef6daa5aa9fdd219d630",
  measurementId: "G-J6SPEKF09Z"
};

firebase.initializeApp(firebaseConfig);
// Google analitics
// firebase.analytics()

let app = null

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


