<template>
    <div>
        <h1 class="">Tester</h1>
        <div class="row">
            <div class="col">&nbsp;</div>
            <div class="col-3 text-right">
                <b-form-group id="tokenId" label="Token ID:" label-for="tokenId">
                    <b-form-input id="tokenId" type="number" v-model="tokenId"></b-form-input>
                </b-form-group>

                <b-form-checkbox
                        id="restrict"
                        v-model="restrict"
                        name="restrict"
                        :value="true"
                        :unchecked-value="false">
                    Restrict?
                </b-form-checkbox>
            </div>
        </div>
        <div class="row text-center">
            <div class="col-12 col-sm-6">
                <h2>SVG</h2>
                <img :src="`${rootApi}/network/1/token/${tokenId}/image`" class="img-fluid" :class="{'restrict': restrict}"/>
            </div>
            <div class="col-12 col-sm-6">
                <h2>PNG</h2>
                <img :src="`${rootApi}/network/1/token/image/${tokenId}.png`" class="img-fluid" :class="{'restrict': restrict}"/>
            </div>
            <div class="col-12 col-sm-6">
                <h2>SVG with BG</h2>
                <img :src="`${rootApi}/network/1/token/${tokenId}/image-bg`" class="img-fluid" :class="{'restrict': restrict}"/>
            </div>
            <div class="col-12 col-sm-6">
                <h2>PNG with BG</h2>
                <img :src="`${rootApi}/network/1/token/image-bg/${tokenId}.png`" class="img-fluid" :class="{'restrict': restrict}"/>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    import Spinner from '../components/Spinner';
    import { mapGetters } from 'vuex';

    export default {
        name: 'checker',
        components: {Spinner},
        computed: {
            ...mapGetters([
                'rootApi',
            ]),
        },
        data() {
            return {
                tokenId: 99,
                restrict: false,
            };
        },
        created: async function () {
        },
        methods: {}
    };
</script>

<style lang="scss">

    .restrict {
        max-height: 400px;
    }
</style>
