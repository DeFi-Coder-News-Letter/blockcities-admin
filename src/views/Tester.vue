<template>
    <div>
        <h1 class="">Tester</h1>
        <div class="alert alert-warning" v-if="tx">
            TX: {{ tx.hash }}
        </div>
        <div class="alert alert-info" v-if="limitedLeft">
            Limited Vending Machine (Left): {{ limitedLeft }}
        </div>
        <div class="row">
            <div class="col-12 col-sm-9">
                <img :src="`${rootApi}/builder/${building}/base/${base}/body/${body}/roof/${roof}/exterior/${exterior}/svg`"
                     :class="{'restrict': restrict}"/>
            </div>
            <div class="col-4 col-sm-3 text-right">
                <b-form-group id="building" label="Building ID:" label-for="building">
                    <b-form-input id="building" type="number" v-model="building" :min="0"></b-form-input>
                </b-form-group>

                <b-form-group id="base" label="Base ID:" label-for="base">
                    <b-form-input id="base" type="number" v-model="base" :min="0"></b-form-input>
                </b-form-group>

                <b-form-group id="body" label="Body ID:" label-for="body">
                    <b-form-input id="body" type="number" v-model="body" :min="0"></b-form-input>
                </b-form-group>

                <b-form-group id="roof" label="Roof ID:" label-for="roof">
                    <b-form-input id="roof" type="number" v-model="roof" :min="0"></b-form-input>
                </b-form-group>

                <b-form-group id="exterior" label="Exterior ID:" label-for="exterior">
                    <b-form-input id="exterior" type="number" v-model="exterior" :min="0"></b-form-input>
                </b-form-group>

                <b-form-group id="background" label="Background ID:" label-for="background">
                    <b-form-input id="background" type="number" v-model="background" :min="0" :max="12"></b-form-input>
                </b-form-group>

                <b-form-checkbox
                        id="restrict"
                        v-model="restrict"
                        name="restrict"
                        :value="true"
                        :unchecked-value="false">
                    Restrict?
                </b-form-checkbox>

                <hr/>

                <a class="btn btn-info" href="#" role="button" @click="premint">Limited Premint</a>

                <hr/>

                <a class="btn btn-warning" href="#" role="button" @click="ping">Test Ping</a>
                <div class="alert alert-info m-2" v-if="pinged && !error">
                    Ping OK
                </div>
                <div v-else-if="pinged && error" class="alert alert-danger m-2">
                    Ping NOT OK. Check roots and anchors!
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    import Spinner from '../components/Spinner';
    import {mapGetters} from 'vuex';

    export default {
        name: 'tester',
        components: {Spinner},
        computed: {
            ...mapGetters([
                'rootApi',
                'limitedVendingContract',
            ]),
        },
        data() {
            return {
                building: 0,
                base: 0,
                body: 0,
                roof: 0,
                exterior: 0,
                background: 0,
                restrict: false,
                pinged: false,
                error: false,
                tx: null,
                limitedLeft: null,
            };
        },
        created: async function () {
        },
        methods: {
            async ping() {
                console.log('ping...');
                this.pinged = false;
                try {
                    const res = await axios.get(`${this.rootApi}/builder/${this.building}/base/${this.base}/body/${this.body}/roof/${this.roof}/exterior/${this.exterior}/svg`, {headers: {'Access-Control-Allow-Origin': '*'}});
                    this.pinged = true;
                    this.error = false;
                    console.log(res);
                } catch (e) {
                    console.error(e);
                    this.pinged = true;
                    this.error = true;
                }
            },

            async premint() {
                this.tx = null; // reset

            //     function premintBuilding(
            //         uint256 _building,
            //         uint256 _base,
            //         uint256 _body,
            //         uint256 _roof,
            //         uint256 _exteriorColorway,
            //         uint256 _backgroundColorway
            // ) onlyWhitelisted public returns (uint256 _tokenId) {

                this.tx = await this.limitedVendingContract.premintBuilding(
                    this.building,
                    this.base,
                    this.body,
                    this.roof,
                    this.exterior,
                    this.background,
                    {gasLimit: 5000000} // rinkeby
                );

                const receipt = await this.tx.wait(1);
                alert('Premint complete!');
                console.log(`Premint receipt:`, receipt);

                this.limitedLeft = await this.limitedVendingContract.buildingsMintAllowanceRemaining();
            },
        }
    };
</script>

<style lang="scss">
    .restrict {
        max-height: 600px;
    }
</style>
