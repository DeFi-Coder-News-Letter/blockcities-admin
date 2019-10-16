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
                <div class="mb-2 text-right">Special Modulo: <code>{{ logicGeneratorData.specialModulo }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Special Modulo" class="mb-2">
                            <b-input type="text" placeholder="for example, 10" v-model="form.specialModuloInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateSpecialModulo">Update Special Modulo</b-button>
                    </b-form>
                </div>
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
                <div class="mb-2 text-right">Special Mappings: <code>{{ logicGeneratorData.specialMappingsArray }}</code></div>
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
                <div class="mb-2 text-right">City ID: <code>{{ form.cityId }}</code> City -> Building Mappings:  <code>{{ logicGeneratorData.cityMappingsArray }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="City Mappings %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.cityMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateCityMappingsArray">Update City Mappings %</b-button>
                    </b-form>
                </div>
                <hr/>
                <div class="mb-2 text-right">Building: <b-form-input type="number" v-model="form.buildingId" placeholder="Building ID" v-on:change="lookupBuildingMappings"></b-form-input></div>
                <div class="mb-2 text-right">Building ID: <code>{{ form.buildingId }}</code> Base Mappings:  <code>{{ logicGeneratorData.buildingBaseMappings }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Base Mappings %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.buildingBaseMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateBuildingBaseMappingsArray">Update Base Mappings %</b-button>
                    </b-form>
                </div>
                <div class="mb-2 text-right">Building ID: <code>{{ form.buildingId }}</code> Body Mappings:  <code>{{ logicGeneratorData.buildingBodyMappings }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Body Mappings %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.buildingBodyMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateBuildingBodyMappingsArray">Update Body Mappings %</b-button>
                    </b-form>
                </div>
                <div class="mb-2 text-right">Building ID: <code>{{ form.buildingId }}</code> Roof Mappings:  <code>{{ logicGeneratorData.buildingRoofMappings }}</code></div>
                <div>
                    <b-form>
                        <b-input-group prepend="Roof Mappings %" class="mb-2">
                            <b-input type="text" placeholder="comma separated list, for example:1,2,3" v-model="form.buildingRoofMappingsArrayInput"></b-input>
                        </b-input-group>

                        <b-button variant="primary" v-on:click="updateBuildingRoofMappingsArray">Update Roof Mappings %</b-button>
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
                    specialModulo: null,
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
                    specialModuloInput: null,

                    cityId: null,
                    cityMappingsArrayInput: null,

                    buildingId: null,
                    buildingBaseMappingsArrayInput: null,
                    buildingBodyMappingsArrayInput: null,
                    buildingRoofMappingsArrayInput: null,
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
                this.logicGeneratorData.specialModulo = await this.logicGeneratorContract.specialModulo();
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
            async updateSpecialModulo() {
                console.log(`Updating modulo ${this.form.specialModuloInput}`);
                try {
                    if (this.form.specialModuloInput) {

                        const tx = await this.logicGeneratorContract.updateSpecialModulo(this.form.specialModuloInput);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.specialModulo = await this.logicGeneratorContract.specialModulo();

                        console.log('New data:', this.logicGeneratorData.specialModulo);
                    } else {
                        alert(`Fill in Special Modulo!`);
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
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
            async lookupBuildingMappings() {
                try {
                    if (this.form.buildingId) {
                        console.log('Looking up building ID', this.form.buildingId);

                        this.logicGeneratorData.buildingBaseMappings = this.mapToNumber(await this.logicGeneratorContract.buildingBaseMappingsArray(this.form.buildingId));
                        this.logicGeneratorData.buildingBodyMappings = this.mapToNumber(await this.logicGeneratorContract.buildingBodyMappingsArray(this.form.buildingId));
                        this.logicGeneratorData.buildingRoofMappings = this.mapToNumber(await this.logicGeneratorContract.buildingRoofMappingsArray(this.form.buildingId));
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateBuildingBaseMappingsArray() {
                try {
                    if (this.form.buildingId && this.form.buildingBaseMappingsArrayInput) {

                        const convertedBaseMappingsArray =  this.splitNTrim(this.form.buildingBaseMappingsArrayInput);
                        const tx = await this.logicGeneratorContract.updateBuildingBaseMappings(this.form.buildingId, convertedBaseMappingsArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.buildingBaseMappings = this.mapToNumber(await this.logicGeneratorContract.buildingBaseMappingsArray(this.form.buildingId));
                        this.form.buildingBaseMappingsArrayInput = null;
                    } else {
                        alert('Fill in Base Mappings Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateBuildingBodyMappingsArray() {
                try {
                    if (this.form.buildingId && this.form.buildingBodyMappingsArrayInput) {

                        const convertedBodyMappingsArray =  this.splitNTrim(this.form.buildingBodyMappingsArrayInput);
                        const tx = await this.logicGeneratorContract.updateBuildingBodyMappings(this.form.buildingId, convertedBodyMappingsArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.buildingBodyMappings = this.mapToNumber(await this.logicGeneratorContract.buildingBodyMappingsArray(this.form.buildingId));
                        this.form.buildingBodyMappingsArrayInput = null;
                    } else {
                        alert('Fill in Body Mappings Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
            async updateBuildingRoofMappingsArray() {
                try {
                    if (this.form.buildingId && this.form.buildingRoofMappingsArrayInput) {

                        const convertedRoofMappingsArray =  this.splitNTrim(this.form.buildingRoofMappingsArrayInput);
                        const tx = await this.logicGeneratorContract.updateBuildingRoofMappings(this.form.buildingId, convertedRoofMappingsArray);
                        console.log('TX', tx);

                        const receipt = await tx.wait(1);
                        console.log('RECEIPT', receipt);

                        this.logicGeneratorData.buildingRoofMappings = this.mapToNumber(await this.logicGeneratorContract.buildingRoofMappingsArray(this.form.buildingId));
                        this.form.buildingRoofMappingsArrayInput = null;
                    } else {
                        alert('Fill in Base Mappings Array Input!');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Something went bang!\n' +  e);
                }
            },
        }
    };
</script>
