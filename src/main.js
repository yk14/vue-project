import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import 'devextreme/dist/css/dx.common.css';
import 'babel-polyfill'
import Vue from "vue";
import axios from 'axios';
import App from "./App";
import router from "./router";
import appInfo from "./app-info";
import store from './store'
import h5store from './js/storage'
import './js/globalVariable';
import $ from 'jquery'
import common from './js/common'
import notify from 'devextreme/ui/notify';
import Base64 from 'js-base64/base64';
import 'es6-promise';

Vue.prototype.$axios = axios
Vue.config.productionTip = false;
Vue.prototype.$appInfo = appInfo;
Vue.prototype.$h5store = h5store
Vue.prototype.$com = common
Vue.prototype.$notify = notify
Vue.prototype.$ = $
Vue.prototype.$Base64 = Base64


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
