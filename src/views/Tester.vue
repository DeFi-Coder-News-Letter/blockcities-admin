<template>
    <div>
        <h1 class="">Tester</h1>
        <div class="row">
            <div class="col-12 col-sm-9">
                <img :src="`${rootApi}/builder/${building}/base/${base}/body/${body}/roof/${roof}/exterior/${exterior}/svg`" :class="{'restrict': restrict}"/>
            </div>
            <div class="col-4 col-sm-3 text-right">
                <b-form-group id="building" label="Building ID:" label-for="building">
                    <b-form-input id="building" type="number" v-model="building"></b-form-input>
                </b-form-group>

                <b-form-group id="base" label="Base ID:" label-for="base">
                    <b-form-input id="base" type="number" v-model="base"></b-form-input>
                </b-form-group>

                <b-form-group id="body" label="Body ID:" label-for="body">
                    <b-form-input id="body" type="number" v-model="body"></b-form-input>
                </b-form-group>

                <b-form-group id="roof" label="Roof ID:" label-for="roof">
                    <b-form-input id="roof" type="number" v-model="roof"></b-form-input>
                </b-form-group>

                <b-form-group id="exterior" label="Exterior ID:" label-for="exterior">
                    <b-form-input id="exterior" type="number" v-model="exterior"></b-form-input>
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
    import { mapGetters } from 'vuex';

    export default {
        name: 'tester',
        components: {Spinner},
        computed: {
            ...mapGetters([
                'rootApi',
            ]),
        },
        data() {
            return {
                building: 0,
                base: 0,
                body: 0,
                roof: 0,
                exterior: 0,
                restrict: false,
                pinged: false,
                error: false,
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
            }
        }
    };
</script>

<style lang="scss">

    .restrict {
        max-height: 600px;
    }
</style>
