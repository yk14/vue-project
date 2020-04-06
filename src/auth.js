import h5store from './js/storage'
export default {
  authenticated() {
    return h5store.ssItem('user_info');
  }
};
