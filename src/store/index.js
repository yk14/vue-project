import Vue from 'vue'
import Vuex from 'vuex'
import h5store from '../js/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      user_info: JSON.stringify({
          id: null,
          name: null,
      }),
      refresh: false,
      current_item: JSON.stringify({
          id: '0',
          text: '主页',
          expanded: false,
          path: '/home',
          items:[]
      }),
      mode: 1//系统模式
  },
  mutations: {
      set_refresh(state, value){
          state.refresh = value;
      },
      set_current_item(state, value){
          state.current_item = value;
          h5store.lsItem('current_item', value);
          h5store.ssItem('current_item', value);
      },
      set_mode (state, value) {
          state.mode = value;
          h5store.lsItem('mode', value);
          h5store.ssItem('mode', value);
      },
      set_user_info (state, value) {
          state.user_info = value;
          h5store.lsItem('user_info', value);
          h5store.ssItem('user_info', value);
      }
  },
  actions: {
  },
  modules: {

  }
})
