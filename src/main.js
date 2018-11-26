import Vue from 'vue'
import {
    Button,
    Menu, Submenu, MenuItem,
    Input,
    Tooltip,
    Popover,
    Dialog,
    Loading,
    Card,
    Collapse, CollapseItem,
    Dropdown, DropdownMenu, DropdownItem,
    Checkbox,
    Table, TableColumn,
    Badge,
    Select,
    Option,
    Progress
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
Vue.component(Dialog.name, Dialog)
Vue.component(Card.name, Card)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Badge.name, Badge)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Progress.name, Progress)

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
