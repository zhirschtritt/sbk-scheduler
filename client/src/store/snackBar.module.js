export default {
  namespaced: true,
  state: {
    visable: false,
    text: '',
    color: 'success' // 'error' | 'info' |
  },
  mutations: {
    show(state, { text, color }) {
      state.visable = true;
      state.text = text || '👍';
      state.color = color || 'info';
    },
    hide(state) {
      state.visable = false;
    }
  },
};
