<template>
    <div>
        <b-jumbotron header="BlockCities Admin">
            <hr/>
            <div class="row">
                <div class="col">
                    <h2>{{ totalBuildings }} buildings</h2>
                    <small>
                        Price per building: {{ pricePerBuildingInEth }} ETH<br/>
                        Last price per building: {{ lastPricePerBuildingInEth }} ETH<br/>
                    </small>
                    <hr/>
                    <small>
                        Last Sale Block: <code>{{ lastSaleBlock }}</code><br/>
                        Blocks since last sale: <code>{{ blocknumber - lastSaleBlock }}</code><br/>
                        <span class="text-muted small">roughly {{ ((blocknumber - lastSaleBlock) * 15) / 60 }} mins</span><br/>
                    </small>
                    <hr/>
                    <h3 class="text-danger">{{ parseFloat(totalEth) }} ETH</h3>
                </div>
                <!--<div class="d-none d-sm-block col">-->
                    <!--<a class="btn btn-primary btn-lg" href="#" role="button" @click="mintBuilding()">Mint building</a>-->
                    <!--<hr/>-->
                    <!--<div class="alert alert-danger">-->
                        <!--<h6>Mint a new Special</h6>-->

                        <!--<div class="row">-->
                            <!--<div class="col">-->
                                <!--<select class="custom-select mb-2" v-model="form.selectedSpecial">-->
                                    <!--<option v-for="(value, key) in form.specials" :value="{data:value, id:key}">-->
                                        <!--{{ key }}: {{ value.name }} : {{ value.city }} : {{ value.background_color }}-->
                                    <!--</option>-->
                                <!--</select>-->
                                <!--<input type="text" class="form-control mb-2 mr-sm-2" placeholder="0x123..." v-model="form.recipient">-->
                                <!--<button class="btn btn-danger" @click="createSpecial">Mint Special</button>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </b-jumbotron>
    </div>
</template>

<script>
    import { ethers } from 'ethers';
    import { contracts } from 'blockcities-contract-artifacts';

    export default {
        name: 'home',
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
            // const rootApi = await this.getRootApi();

            this.chainId = chainId;

            // let specialsResponse = await axios.get(`${rootApi}/configs/buildings/specials`, {headers: {'Access-Control-Allow-Origin': '*'}});
            //   this.form.specials = specialsResponse.data;
            //

            console.log(signer);

            this.vendingContract = new ethers.Contract(
                contracts.addresses.BlockCitiesVendingMachine(this.chainId).address,
                contracts.addresses.BlockCitiesVendingMachine(this.chainId).abi,
                signer
            );

            this.pricePerBuildingInWei = await this.vendingContract.totalPrice(1);
            this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);

            //
            //   const blockcitiesAddress = await this.getBlockCitiesAddress();
            //
            //   this.blockcitiesContract = new ethers.Contract(
            //           blockcitiesAddress,
            //           this.blockcitiesAbi,
            //           signer
            //   );
            //

              // this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);
            //   this.lastPricePerBuildingInEth = ethers.utils.formatEther((await this.vendingContractV2.lastSalePrice()));
            //   this.lastSaleBlock = await this.vendingContractV2.lastSaleBlock();
            //
            //   this.totalEth = ethers.utils.formatEther((await this.vendingContract.totalPurchasesInWei()));
            //   this.totalEthV2 = ethers.utils.formatEther((await this.vendingContractV2.totalPurchasesInWei()));
            //
            //   this.totalBuildings = (await this.blockcitiesContract.totalBuildings()).toNumber();
            //
            //
            //   for (let i =  this.totalBuildings - 50; i <= this.totalBuildings; i++) {
            //     const b = await axios.get(`${rootApi}/network/${this.chainId}/token/${i}`);
            //     this.buildings.push(b);
            //   }
            } catch (e) {
                console.error(e);
            }

        }
    };
</script>
