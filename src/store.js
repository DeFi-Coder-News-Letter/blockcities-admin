import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        chainId: 1
    },
    mutations: {},
    actions: {},
    getters: {
        rootApi: (state) => {
            if (state.chainId === 5777) {
                return 'http://localhost:5000/block-cities/us-central1/api';
            }
            return 'https://us-central1-block-cities.cloudfunctions.net/api';
        },
    }
});
