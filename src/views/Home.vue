<template>
    <div>
        <b-jumbotron>
            <div class="row">
                <div class="col">
                    <h1>{{ totalBuildings }} buildings</h1>
                    <small>
                        Price per building: {{ pricePerBuildingInEth }} ETH<br/>
                        Last price per building: {{ lastPricePerBuildingInEth }} ETH<br/>
                    </small>
                    <h1 class="text-danger mt-4">{{ parseFloat(totalEth) }} ETH</h1>
                </div>
                <div class="col text-right">
                    <div class="mt-4">
                        <small>
                            Last Sale Block: <code>{{ lastSaleBlock }}</code><br/>
                            Blocks since last sale: <code>{{ blocknumber - lastSaleBlock }}</code><br/>
                            <span class="text-muted small">roughly {{ ((blocknumber - lastSaleBlock) * 15) / 60 }} mins</span><br/>
                        </small>
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
    import { contracts } from 'blockcities-contract-artifacts';
    import axios from 'axios';

    import store from '../store';
    import NetworkBadge from '../components/NetworkBadge';

    export default {
        name: 'home',
        components: {NetworkBadge},
        data() {
            return {
                blockcitiesContract: null,
                vendingContract: null,
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
                chainId: null,
                form: {
                    recipient: null,
                    selectedSpecial: null,
                    specials: []
                }
            };
        },
        created: async function () {
            try {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(web3.currentProvider);
                const signer = provider.getSigner();

                this.blocknumber = await provider.getBlockNumber();
                const {chainId} = await provider.getNetwork();
                const rootApi = store.getters.rootApi;

                this.chainId = chainId;

                this.vendingContract = new ethers.Contract(
                    contracts.addresses.BlockCitiesVendingMachine(this.chainId).address,
                    contracts.addresses.BlockCitiesVendingMachine(this.chainId).abi,
                    signer
                );

                this.pricePerBuildingInWei = await this.vendingContract.totalPrice(1);
                this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);

                this.blockcitiesContract = new ethers.Contract(
                    contracts.addresses.BlockCities(this.chainId).address,
                    contracts.addresses.BlockCities(this.chainId).abi,
                    signer
                );

                this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);
                this.lastPricePerBuildingInEth = ethers.utils.formatEther((await this.vendingContract.lastSalePrice()));
                this.lastSaleBlock = await this.vendingContract.lastSaleBlock();

                const v1VendingMachineTotalSalesInWei = utils.bigNumberify('25510500000000000000');
                const v2VendingMachineTotalSalesInWei = await this.vendingContract.totalPurchasesInWei();
                this.totalEth = ethers.utils.formatEther(v1VendingMachineTotalSalesInWei.add(v2VendingMachineTotalSalesInWei));

                this.totalBuildings = (await this.blockcitiesContract.totalBuildings()).toNumber();

                for (let i = this.totalBuildings - 12; i <= this.totalBuildings; i++) {
                    const b = await axios.get(`${rootApi}/network/${this.chainId}/token/${i}`);
                    this.buildings.push(b);
                }
            } catch (e) {
                console.error(e);
            }
        },
        methods: {
            bg: (hex) => {
                return {
                    'background-color': `#${hex}`
                };
            },
        }
    };
</script>


