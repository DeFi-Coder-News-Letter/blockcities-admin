<template>
    <div>
        <b-jumbotron>
            <div class="row">
                <div class="col">
                    <h1>{{ totalBuildings }} buildings</h1>
                    <small>
                        Price per building: {{ pricePerBuildingInEth }} ETH<br/>
                        Last price per building: {{ lastPricePerBuildingInEth }} ETH<br/>
                        Last Sale Block: <code>{{ lastSaleBlock }}</code><br/>
                        Blocks since last sale: <code>{{ blocknumber - lastSaleBlock }}</code><br/>
                        <span class="text-muted small">roughly {{ ((blocknumber - lastSaleBlock) * 15) / 60 }} mins</span><br/>
                    </small>
                    <hr/>
                    <h1 class="text-danger mt-4">{{ parseFloat(totalEth) }} ETH</h1>
                </div>
                <div class="col text-right">
                    <div class="alert alert-default">
                        <h6>Mint a new building</h6>
                        <a class="btn btn-primary" href="#" role="button" @click="mintBuilding()">Mint</a>
                    </div>
                    <div class="alert alert-warning" v-if="tx">
                        TX: {{ tx.hash }}
                    </div>

                    <div class="alert alert-info" v-if="buildingTokenId">
                        Building Token ID: {{ buildingTokenId }}
                    </div>
                </div>
            </div>
        </b-jumbotron>
        <div class="card-columns" v-if="buildings">
            <div class="card m-2 p-2" v-for="b in buildings" :style="bg(b.data.background_color)">
                <div class="card-body">
                    <p class="text-center mx-auto"><img class="card-img-top" :src="b.data.image" :alt="b.data.name"
                                                        style="width: 150px"></p>
                    <h3 class="card-title text-center">{{ b.data.name }}</h3>
                    <p class="text-center">{{ b.data.description }}</p>
                    <p class="small">
                        <span class="text-muted">Token ID: </span> <code>{{ b.data.attributes.tokenId }}</code><br/>
                        <span class="text-muted">Window Type: </span> <code>{{ b.data.attributes.windowType }}</code><br/>
                        <span class="text-muted">City: </span> <code>{{ b.data.attributes.city }}</code><br/>
                        <span class="text-muted">Building: </span> <code>{{ b.data.attributes.building }}</code><br/>
                        <span class="text-muted">Ground Floor Type: </span> <code>{{ b.data.attributes.groundFloorType }}</code><br/>
                        <span class="text-muted">Ground Floor Use: </span> <code>{{ b.data.attributes.groundFloorUse }}</code><br/>
                        <span class="text-muted">Code Type: </span> <code>{{ b.data.attributes.coreType }}</code><br/>
                        <span class="text-muted">Core Use: </span> <code>{{ b.data.attributes.coreUse }}</code><br/>
                        <span class="text-muted">Roof Type: </span> <code>{{ b.data.attributes.rooftopType }}</code><br/>
                        <span class="text-muted">Roof Use: </span> <code>{{ b.data.attributes.rooftopUse }}</code><br/>
                        <span class="text-muted">Height: </span> <code>{{ b.data.attributes.height }} ft</code><br/>
                        <span class="text-muted">Height Class: </span> <code>{{ b.data.attributes.heightClass }}</code><br/>
                        <span class="text-muted">Exterior Colorway: </span> <code>{{ b.data.attributes.exteriorColorway }}</code><br/>
                        <span class="text-muted">Base Window Colorway: </span> <code>{{b.data.attributes.baseWindowColorway }}</code><br/>
                        <span class="text-muted">Body Window Colorway: </span> <code>{{b.data.attributes.bodyWindowColorway }}</code><br/>
                        <span class="text-muted">Roof Window Colorway: </span> <code>{{b.data.attributes.roofWindowColorway }}</code><br/>
                        <span class="text-muted">Background Colorway: </span> <code>{{b.data.attributes.backgroundColorway }}</code>
                    </p>
                    <p class="small"><span class="text-muted">Architect: </span> <code>{{ b.data.attributes.architect }}</code></p>
                </div>
            </div>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>
</template>

<script>
    import { ethers, utils } from 'ethers';
    import axios from 'axios';
    import NetworkBadge from '../components/NetworkBadge';
    import { mapGetters } from 'vuex';

    export default {
        name: 'home',
        components: {NetworkBadge},
        data() {
            return {
                pricePerBuildingInWei: null,
                pricePerBuildingInEth: null,
                lastPricePerBuildingInEth: null,
                blocknumber: null,
                lastSaleBlock: null,
                totalEth: null,
                totalBuildings: 0,
                buildingTokenId: null,
                buildingMetaData: null,
                buildings: [],
                tx: null,
                form: {
                    recipient: null,
                    selectedSpecial: null,
                    specials: []
                }
            };
        },
        computed: {
            ...mapGetters([
                'rootApi',
                'vendingContract',
                'blockcitiesContract',
                'provider',
                'chain',
                'v1VendingMachineTotalSalesInWei',
            ]),
        },
        watch: {
            async provider(provider) {
                if (provider) {
                    this.blocknumber = await provider.getBlockNumber();
                }
            },
            async vendingContract(vendingContract) {
                if (vendingContract) {
                    this.pricePerBuildingInWei = await vendingContract.totalPrice(1);
                    this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);

                    this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);
                    this.lastPricePerBuildingInEth = ethers.utils.formatEther((await vendingContract.lastSalePrice()));
                    this.lastSaleBlock = await vendingContract.lastSaleBlock();

                    const v1VendingMachineTotalSalesInWeiBn = utils.bigNumberify(this.v1VendingMachineTotalSalesInWei); // static val from contract
                    const v2VendingMachineTotalSalesInWei = await vendingContract.totalPurchasesInWei();
                    this.totalEth = ethers.utils.formatEther(v1VendingMachineTotalSalesInWeiBn.add(v2VendingMachineTotalSalesInWei));
                }
            },
            async blockcitiesContract(blockcitiesContract) {
                if (blockcitiesContract) {
                    this.totalBuildings = (await blockcitiesContract.totalBuildings()).toNumber();

                    if (this.totalBuildings > 0) {
                        const last6 = (this.totalBuildings > 6) ? this.totalBuildings - 6 : this.totalBuildings;
                        for (let i = last6; i <= this.totalBuildings; i++) {
                            const b = await axios.get(`${this.rootApi}/network/${this.chain.chainId}/token/${i}`);
                            this.buildings.push(b);
                        }
                    }
                }
            },
        },
        methods: {
            bg: (hex) => {
                return {
                    'background-color': `#${hex}`
                };
            },
            async mintBuilding() {

                this.pricePerBuildingInWei = (await this.vendingContract.totalPrice(1));

                let overrides = {
                    // The amount to send with the transaction (i.e. msg.value)
                    value: this.pricePerBuildingInWei,
                };

                // wait for tx to be mined
                this.tx = await this.vendingContract.mintBuilding(overrides);

                let receipt = await this.tx.wait(1);
                const tokenIdBN = receipt.events.pop().args[0];
                this.buildingTokenId = tokenIdBN.toNumber();
                console.log(`Token ID:`, this.buildingTokenId);
            },
        }
    };
</script>


