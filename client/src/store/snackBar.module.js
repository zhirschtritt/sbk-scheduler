export default {
  namespaced: true,
  state: {
    visable: false,
    text: '',
    color: 'primary', // 'error' | 'info' |
    timeout: 2000
  },
  mutations: {
    show(state, { text, color, timeout }) {
      state.visable = true;
      state.text = text || '👍';
      state.color = color || 'info';
      state.timeout = timeout || 2000;
    },
    hide(state) {
      state.visable = false;
    }
  }
};
