import Vue from 'vue'
import {
    Button,
    Menu, Submenu, MenuItem,
    Input,
    Tooltip,
    Popover,
    Loading
} from 'element-ui';
import App from './App.vue'
import router from './router'
import Network from '@/network/Network'
import EvtBus from '@/util/event'
import Events from '@/const/events'
import Prototype from '@/util/prototype'
import '@/assets/icon/font/iconfont.css'

Vue.component(Button.name, Button)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Input.name, Input)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Popover.name, Popover)

Vue.use(Loading)
Vue.prototype.uris = Network.uris
Vue.prototype.store = Network.store
Vue.prototype.network = Network
Vue.prototype.evtbus = EvtBus
Vue.prototype.evts = Events.events
Vue.config.productionTip = false
Prototype.install()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
