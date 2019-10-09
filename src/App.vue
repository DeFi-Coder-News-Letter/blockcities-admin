<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="danger">
            <b-navbar-brand to="/">BlockCities Admin</b-navbar-brand>

            <network-badge :chain="chain" v-if="chain"></network-badge>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-item :to="{name:'tester'}">Tester</b-nav-item>
                    <b-nav-item :to="{name:'specials'}">Specials</b-nav-item>
                    <b-nav-item :to="{name:'config'}">Config</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="container-fluid mt-4">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import { ethers } from 'ethers';
    import NetworkBadge from './components/NetworkBadge';
    import store from './store';
    import { mapGetters } from 'vuex';

    export default {
        components: {NetworkBadge},
        computed: {
            ...mapGetters([
                'chain',
            ]),
        },
        created: async function () {
            try {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(web3.currentProvider);
                const signer = provider.getSigner();

                store.dispatch('provider', provider);
            } catch (e) {
                console.error(e);
            }
        },
    };
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';

    h1 {
        margin-bottom: 2rem;
    }
</style>
