import { createApp } from 'vue'
import { BootstrapVue3, BToastPlugin } from 'bootstrap-vue-3'
import { store } from './web/store/store'

import App from './web/App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"

createApp(App)
    .use(BootstrapVue3)
    .use(BToastPlugin)
    .use(store)
    .mount('#app')