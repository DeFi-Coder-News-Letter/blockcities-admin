import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { ethers, utils } from 'ethers';
import { contracts } from 'blockcities-contract-artifacts';

export default new Vuex.Store({
    state: {
        provider: null,
        signer: null,
        chain: null,

        vendingContract: null,
        limitedVendingContract: null,
        blockcitiesContract: null,
    },
    getters: {
        rootApi: (state) => {
            return 'http://localhost:5000/block-cities/us-central1/api';
            // return 'https://us-central1-block-cities.cloudfunctions.net/api';
        },
        provider: state => state.provider,
        signer: state => state.signer,
        chain: state => state.chain,
        v1VendingMachineTotalSalesInWei: state => (state.chain && state.chain.chainId === 1) ? '25510500000000000000' : '',
        vendingContract: state => state.vendingContract,
        blockcitiesContract: state => state.blockcitiesContract,
        limitedVendingContract: state => state.limitedVendingContract,
    },
    mutations: {
        provider (state, provider) {
            state.provider = provider;
        },
        signer (state, signer) {
            state.signer = signer;
        },
        chain (state, chain) {
            state.chain = chain;
        },
        vendingContract (state, vendingContract) {
            state.vendingContract = vendingContract;
        },
        blockcitiesContract (state, blockcitiesContract) {
            state.blockcitiesContract = blockcitiesContract;
        },
        limitedVendingContract (state, limitedVendingContract) {
            state.limitedVendingContract = limitedVendingContract;
        },
    },
    actions: {
        async provider ({ commit, state }, provider) {
            console.log('setting provider...');
            commit('provider', provider);
            commit('signer', provider.getSigner());

            const chain = await provider.getNetwork();
            commit('chain', chain);

            const vendingContract = new ethers.Contract(
                contracts.addresses.BlockCitiesVendingMachine(state.chain.chainId).address,
                contracts.addresses.BlockCitiesVendingMachine(state.chain.chainId).abi,
                state.signer
            );
            commit('vendingContract', vendingContract);

            const blockcitiesContract = new ethers.Contract(
                contracts.addresses.BlockCities(state.chain.chainId).address,
                contracts.addresses.BlockCities(state.chain.chainId).abi,
                state.signer
            );
            commit('blockcitiesContract', blockcitiesContract);

            const limitedVendingContract = new ethers.Contract(
                contracts.addresses.LimitedVendingMachine(state.chain.chainId).address,
                contracts.addresses.LimitedVendingMachine(state.chain.chainId).abi,
                state.signer
            );
            commit('limitedVendingContract', limitedVendingContract);
        }
    }
});
