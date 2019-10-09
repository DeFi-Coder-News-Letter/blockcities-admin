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
            <div class="col-12">
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

                        <b-button variant="primary" v-on:click="updateColourArray('exteriorPercentageArrayInput', 'exteriorPercentageArray', 'updateExteriorPercentages', 'exteriorPercentageArray')">Update Exterior %</b-button>
                    </b-form>
                </div>
                <hr/>
                <div class="mb-2 text-right">Backgrounds %: <code>{{ colourGeneratorData.backgroundsPercentagesArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Backgrounds %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.backgroundsPercentagesArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateColourArray('backgroundsPercentagesArrayInput', 'backgroundsPercentagesArray', 'updateBackgroundsPercentages', 'backgroundsPercentagesArray')">Update Backgrounds %</b-button>
                    </b-form>
                </div>
                <hr/>
            </div>
            <div class="col-12">
                <h3>Logic Generator</h3>
                Platform: <code>{{ colourGeneratorData.platform }}</code><br/>
                Partner: <code>{{ colourGeneratorData.partner }}</code><br/>
                <hr/>
                <div class="mb-2 text-right">City %: <code>{{ logicGeneratorData.cityPercentagesArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="City %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.cityPercentagesArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateCityPercentagesArray">Update City %</b-button>
                    </b-form>
                </div>
                <hr/>
                <div class="mb-2 text-right">Special Mappings:  <code>{{ logicGeneratorData.specialMappingsArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Specials %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.specialMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateSpecialMappingsArray">Update Specials %</b-button>
                    </b-form>
                </div>
                <hr/>
                <div class="mb-2 text-right">City: <b-form-input type="number" v-model="form.cityId" placeholder="City ID" v-on:change="lookupCityMappings"></b-form-input></div>
                <div class="mb-2 text-right">City ID: <code>{{ form.cityId }}</code> City Mappings:  <code>{{ logicGeneratorData.cityMappingsArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="City Mappings %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.cityMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateCityMappingsArray">Update City Mappings %</b-button>
                    </b-form>
                </div>
                <hr/>
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
                    platform: null,
                    partner: null,
                    cityPercentagesArray: null,
                    specialMappingsArray: null,
                    cityMappingsArray: null,
                    buildingBaseMappings: null,
                    buildingBodyMappings: null,
                    buildingRoofMappings: null,
                },

                form: {
                    city: null,
                    exteriorPercentageArrayInput: null,
                    backgroundsPercentagesArrayInput: null,
                    cityPercentagesArrayInput: null,
                    specialMappingsArrayInput: null,

                    cityId: null,
                    cityMappingsArrayInput: null,
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

                this.colourGeneratorContract = new ethers.Contract(
                    this.colourGeneratorContractAddress,
                    contracts.addresses.ColourGenerator(this.chainId).abi,
                    signer
                );

                this.colourGeneratorData.platform = await this.colourGeneratorContract.platform();
                this.colourGeneratorData.partner = await this.colourGeneratorContract.partner();
                this.colourGeneratorData.exteriorPercentageArray = this.mapToNumber(await this.colourGeneratorContract.exteriorPercentageArray());
                this.colourGeneratorData.backgroundsPercentagesArray = this.mapToNumber(await this.colourGeneratorContract.backgroundsPercentagesArray());

                this.logicGeneratorContract = new ethers.Contract(
                    this.logicGeneratorContractAddress,
                    contracts.addresses.LogicGenerator(this.chainId).abi,
                    signer
                );

                this.logicGeneratorData.platform = await this.logicGeneratorContract.platform();
                this.logicGeneratorData.partner = await this.logicGeneratorContract.partner();
                this.logicGeneratorData.cityPercentagesArray = this.mapToNumber(await this.logicGeneratorContract.cityPercentagesArray());
                this.logicGeneratorData.specialMappingsArray = this.mapToNumber(await this.logicGeneratorContract.specialMappingsArray());


            } catch (e) {
                console.error(e);
            }
        },
        methods: {
            mapToNumber(inputArray) {
                return (inputArray || []).map((bn) => bn.toNumber());
            },
            splitNTrim(inputArray) {
                return (inputArray || []).split(',').map((str) => str.trim());
            },
            async updateColourArray(inputArray, dataArray, updateFunc, readFunc) {
                console.log(`${inputArray} ${dataArray} ${updateFunc} ${readFunc}`);
                try {
                    if (this.form[inputArray]) {

                        const convertedArray = this.splitNTrim(this.form[inputArray]);
                        const tx = await this.colourGeneratorContract[updateFunc](convertedArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.colourGeneratorData[dataArray] = this.mapToNumber(await this.colourGeneratorContract[readFunc]());
                        this.form[inputArray] = null;

                        console.log('New data:', this.colourGeneratorData[dataArray]);
                    } else {
                        alert(`Fill in ${inputArray} Input!`);
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateCityPercentagesArray() {
                try {
                    if (this.form.cityPercentagesArrayInput) {

                        const convertedCityPercentagesArray =  this.splitNTrim(this.form.cityPercentagesArrayInput);
                        const tx = await this.logicGeneratorContract.updateCityPercentages(convertedCityPercentagesArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.cityPercentagesArray = this.mapToNumber(await this.logicGeneratorContract.cityPercentagesArray());
                        this.form.cityPercentagesArrayInput = null;
                    } else {
                        alert('Fill in City Percentage Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateSpecialMappingsArray() {
                try {
                    if (this.form.specialMappingsArrayInput) {

                        const convertedSpecialMappingsArray =  this.splitNTrim(this.form.specialMappingsArrayInput);
                        const tx = await this.logicGeneratorContract.updateSpecialMappings(convertedSpecialMappingsArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.specialMappingsArray = this.mapToNumber(await this.logicGeneratorContract.specialMappingsArray());
                        this.form.specialMappingsArrayInput = null;
                    } else {
                        alert('Fill in Specials Percentage Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async lookupCityMappings() {
                try {
                    if (this.form.cityId) {
                        console.log('Looking up city ID', this.form.cityId);

                        this.logicGeneratorData.cityMappingsArray = this.mapToNumber(await this.logicGeneratorContract.cityMappingsArray(this.form.cityId));
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateCityMappingsArray() {
                try {
                    if (this.form.cityId && this.form.cityMappingsArrayInput) {

                        const convertedCityMappingsArray =  this.splitNTrim(this.form.cityMappingsArrayInput);
                        const tx = await this.logicGeneratorContract.updateCityMappings(this.form.cityId, convertedCityMappingsArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.cityMappingsArray = this.mapToNumber(await this.logicGeneratorContract.cityMappingsArray(this.form.cityId));
                        this.form.cityMappingsArrayInput = null;
                    } else {
                        alert('Fill in City Mappings Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
        }
    };
</script>
