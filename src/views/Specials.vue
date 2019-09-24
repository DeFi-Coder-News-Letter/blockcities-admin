<template>
    <div>
        <h1 class="">Specials</h1>
        <div class="row" v-if="vendingContract">
            <div class="col">
                BlockCities contract: <code>{{ blockcitiesContract.address }}</code><br/>
                Vending Machine contract: <code>{{ vendingContract.address }}</code><br/>
            </div>
            <div class="col" v-if="form.specials">
                <div class="alert alert-danger">
                    <h6>Mint a new Special</h6>

                    <select class="custom-select mb-2" v-model="form.selectedSpecial">
                        <option v-for="(value, key) in form.specials" :value="{data:value, id:key}">
                            {{ key }}: {{ value.name }} : {{ value.city }} : {{ value.background_color }}
                        </option>
                    </select>
                    <input type="text" class="form-control mb-2 mr-sm-2" placeholder="0x123..." v-model="form.recipient">
                    <button class="btn btn-danger" @click="createSpecial">Mint Special</button>
                </div>

                <div class="alert alert-warning" v-if="tx">
                    TX: {{ tx.hash }}
                </div>

                <div class="alert alert-info" v-if="buildingTokenId">
                    Building Token ID: {{ buildingTokenId }}
                </div>
            </div>
            <div class="col" v-else>
                <spinner></spinner>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from 'axios';

    import Spinner from '../components/Spinner';
    import { mapGetters } from 'vuex';

    export default {
        name: 'config',
        components: {Spinner},
        computed: {
            ...mapGetters([
                'rootApi',
                'vendingContract',
                'blockcitiesContract',
            ]),
        },
        data() {
            return {
                chainId: null,

                buildingTokenId: null,
                tx: null,

                form: {
                    recipient: null,
                    selectedSpecial: null,
                    specials: null,
                }
            };
        },
        created: async function () {
            try {
                let specialsResponse = await axios.get(`${this.rootApi}/configs/buildings/specials`, {headers: {'Access-Control-Allow-Origin': '*'}});
                this.form.specials = specialsResponse.data;
            } catch (e) {
                console.error(e);
            }
        },
        methods: {
            async createSpecial() {
                this.buildingTokenId = null; // reset
                this.tx = null; // reset

                const special = this.form.selectedSpecial;
                const recipient = this.form.recipient;
                if (special !== null && special.id !== null && recipient !== null) {

                    console.log(`Special:`, special);

                    const {id, data} = special;
                    const city = data.cityId || 0;
                    const backgroundColorway = data.background_colorId || 0;

                    this.tx = await this.blockcitiesContract.createBuilding(0, backgroundColorway, city, 0, 0, 0, 0, id, recipient);

                    const receipt = await this.tx.wait(1);
                    const tokenIdBN = receipt.events.pop().args[0];
                    this.buildingTokenId = tokenIdBN.toNumber();
                    console.log(`Token ID:`, this.buildingTokenId);
                } else {
                    alert('Please select a special and enter an account');
                }
            },
        }
    };
</script>
