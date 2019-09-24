<template>
    <div>
        <h1 class="">Config</h1>
        <div class="row" v-if="blockcitiesContract && vendingContract">
            <div class="col">
                BlockCities contract: <code>{{ blockcitiesContract.address }}</code><br/>
                Vending Machine contract: <code>{{ vendingContract.address }}</code><br/>
            </div>
            <div class="col">
                Colour Generator contract: <code>{{ colourGeneratorContractAddress }}</code><br/>
                Logic Generator contract: <code>{{ logicGeneratorContractAddress }}</code><br/>
                <small class="text-muted">Read from the on-chain Vending Machine contract</small>
            </div>
        </div>

        <div class="row mt-4" v-if="blockcitiesContract && vendingContract">
            <div class="col">
                <h3>Colour Generator</h3>
                Platform: <code>{{ colourGeneratorData.platform }}</code><br/>
                Partner: <code>{{ colourGeneratorData.partner }}</code><br/>
                <hr/>
                <div class="mb-2 text-right">Exterior %: <code>{{ colourGeneratorData.exteriorPercentageArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Exterior %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.exteriorPercentageArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateExteriorPercentageArray">Update Exterior %</b-button>
                    </b-form>
                </div>
                <hr/>
                <div class="mb-2 text-right">Backgrounds %: <code>{{ colourGeneratorData.backgroundsPercentagesArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Backgrounds %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.backgroundsPercentagesArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateBackgroundsPercentagesArray">Update Backgrounds %</b-button>
                    </b-form>
                </div>
                <hr/>
            </div>
            <div class="col">
                <h3>Logic Generator</h3>
                City %: {{ logicGeneratorData.cityPercentages }}<br/>
                City Mappings: {{ logicGeneratorData.cityMappings }}<br/>
                Base Mappings: {{ logicGeneratorData.buildingBaseMappings }}<br/>
                Body Mappings: {{ logicGeneratorData.buildingBodyMappings }}<br/>
                Roof Mappings: {{ logicGeneratorData.buildingRoofMappings }}<br/>
            </div>
        </div>
    </div>
</template>

<script>
    import { ethers, utils } from 'ethers';
    import { contracts } from 'blockcities-contract-artifacts';

    export default {
        name: 'config',
        data() {
            return {
                blockcitiesContract: null,
                vendingContract: null,

                colourGeneratorContractAddress: null,
                colourGeneratorContract: null,
                colourGeneratorData: {
                    platform: null,
                    partner: null,
                    exteriorPercentageArray: null,
                    backgroundsPercentagesArray: null,
                },

                logicGeneratorContractAddress: null,
                logicGeneratorContract: null,
                logicGeneratorData: {
                    cityPercentages: null,
                    cityMappings: null,
                    buildingBaseMappings: null,
                    buildingBodyMappings: null,
                    buildingRoofMappings: null,
                },

                form: {
                    exteriorPercentageArrayInput: null,
                    backgroundsPercentagesArrayInput: null,
                },

                chainId: null,
            };
        },
        created: async function () {
            try {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(web3.currentProvider);
                const signer = provider.getSigner();
                const {chainId} = await provider.getNetwork();

                this.chainId = chainId;

                this.vendingContract = new ethers.Contract(
                    contracts.addresses.BlockCitiesVendingMachine(this.chainId).address,
                    contracts.addresses.BlockCitiesVendingMachine(this.chainId).abi,
                    signer
                );

                this.blockcitiesContract = new ethers.Contract(
                    contracts.addresses.BlockCities(this.chainId).address,
                    contracts.addresses.BlockCities(this.chainId).abi,
                    signer
                );

                // get generators off the vending machine
                this.colourGeneratorContractAddress = await this.vendingContract.colourGenerator();
                this.logicGeneratorContractAddress = await this.vendingContract.logicGenerator();

                // FIXME use this once deployed correctly
                // this.colourGeneratorContract = new ethers.Contract(
                //     this.colourGeneratorContractAddress,
                //     contracts.addresses.ColourGenerator(this.chainId).abi,
                //     signer
                // );

                this.colourGeneratorContract = new ethers.Contract(
                    contracts.addresses.ColourGenerator(this.chainId).address,
                    contracts.addresses.ColourGenerator(this.chainId).abi,
                    signer
                );

                this.colourGeneratorData.platform = await this.colourGeneratorContract.platform();
                this.colourGeneratorData.partner = await this.colourGeneratorContract.partner();
                this.colourGeneratorData.exteriorPercentageArray = (await this.colourGeneratorContract.exteriorPercentageArray()).map((bn) => bn.toNumber());
                this.colourGeneratorData.backgroundsPercentagesArray = (await this.colourGeneratorContract.backgroundsPercentagesArray()).map((bn) => bn.toNumber());

                this.logicGeneratorContract = new ethers.Contract(
                    this.logicGeneratorContractAddress,
                    contracts.addresses.LogicGenerator(this.chainId).abi,
                    signer
                );

                // uint256[] public cityPercentages;
                //
                // mapping(uint256 => uint256[]) public cityMappings;
                //
                // mapping(uint256 => uint256[]) public buildingBaseMappings;
                // mapping(uint256 => uint256[]) public buildingBodyMappings;
                // mapping(uint256 => uint256[]) public buildingRoofMappings;
                //
                // uint256[] public specialMappings;

                // this.logicGeneratorData.cityPercentages = await this.logicGeneratorContract.cityPercentages(0);
                // this.logicGeneratorData.cityMappings = await this.logicGeneratorContract.cityMappings(0, 0);
                // this.logicGeneratorData.buildingBaseMappings = await this.logicGeneratorContract.buildingBaseMappings(0, 0);
                // this.logicGeneratorData.buildingBodyMappings = await this.logicGeneratorContract.buildingBodyMappings(0, 0);
                // this.logicGeneratorData.buildingRoofMappings = await this.logicGeneratorContract.buildingRoofMappings(0, 0);

            } catch (e) {
                console.error(e);
            }
        },
        methods: {
            async updateExteriorPercentageArray() {
                try {
                    if (this.form.exteriorPercentageArrayInput) {

                        const convertedExteriorPercentageArray = this.form.exteriorPercentageArrayInput.split(',').map((str) => str.trim());
                        const tx = await this.colourGeneratorContract.updateExteriorPercentages(convertedExteriorPercentageArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.colourGeneratorData.exteriorPercentageArray = (await this.colourGeneratorContract.exteriorPercentageArray()).map((bn) => bn.toNumber());
                        this.form.exteriorPercentageArrayInput = null;
                    } else {
                        alert('Fill in Exterior Percentage Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateBackgroundsPercentagesArray() {
                try {
                    if (this.form.backgroundsPercentagesArrayInput) {

                        const convertedBackgroundsPercentageArray = this.form.backgroundsPercentagesArrayInput.split(',').map((str) => str.trim());
                        const tx = await this.colourGeneratorContract.updateBackgroundsPercentages(convertedBackgroundsPercentageArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.colourGeneratorData.backgroundsPercentagesArray = (await this.colourGeneratorContract.backgroundsPercentagesArray()).map((bn) => bn.toNumber());
                        this.form.backgroundsPercentagesArrayInput = null;
                    } else {
                        alert('Fill in Exterior Percentage Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            }
        }
    };
</script>
