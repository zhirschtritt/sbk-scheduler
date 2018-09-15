export default {
  name: 'members',
  methods: {
    actions: {
      setCurrentByName({ commit, getters }, memberName) {
        const [member] = getters.find({ query: { name: memberName.toLowerCase() } }).data;

        commit('setCurrent', member);
      },
    },
  },
};
