<template>
    <div>
        <h1>HOME</h1>
        <b-jumbotron header="BootstrapVue" lead="Bootstrap v4 Components for Vue.js 2">
            <p v-if="blocknumber">BN {{ blocknumber }}</p>
            <p v-if="chainId">CHAIN {{ chainId }}</p>
        </b-jumbotron>
    </div>
</template>

<script>
    import { ethers } from 'ethers';

    export default {
        name: 'home',
        data () {
            return {
                chainId: null,
                blocknumber: null,
            };
        },
        created: async function () {

            // try {
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
            //   const vendingAddress = await this.getVendingMachineAddress();
            //
            //   this.vendingContract = new ethers.Contract(
            //           vendingAddress,
            //           this.vendingAbi,
            //           signer
            //   );
            //
            //   const vendingAddressV2 = await this.getVendingMachineV2Address();
            //
            //   this.vendingContractV2 = new ethers.Contract(
            //           vendingAddressV2,
            //           this.vendingAbiV2,
            //           signer
            //   );
            //
            //   const blockcitiesAddress = await this.getBlockCitiesAddress();
            //
            //   this.blockcitiesContract = new ethers.Contract(
            //           blockcitiesAddress,
            //           this.blockcitiesAbi,
            //           signer
            //   );
            //
            //   this.pricePerBuildingInWei = (await this.vendingContractV2.totalPrice(1));
            //   this.pricePerBuildingInEth = ethers.utils.formatEther(this.pricePerBuildingInWei);
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
            // } catch (e) {
            //   console.error(e);
            // }

        }
    };
</script>
