
export default {
    lsItem: function (key, value) {
          return value
              ? localStorage.setItem(key, value)
              : localStorage.getItem(key);
    },
    lsClear: function () {
        localStorage.clear();
    },
    ssItem: function (key, value) {
        return value
            ? sessionStorage.setItem(key, value)
            : sessionStorage.getItem(key);
    },
    ssClear: function () {
        sessionStorage.clear();
    },
}
