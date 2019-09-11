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
                    <h3 class="text-danger">{{ parseFloat(totalEth) + parseFloat(totalEthV2) }} ETH</h3>
                </div>
                <div class="d-none d-sm-block col">
                    <a class="btn btn-primary btn-lg" href="#" role="button" @click="mintBuilding()">Mint building</a>
                    <hr/>
                    <div class="alert alert-danger">
                        <h6>Mint a new Special</h6>

                        <div class="row">
                            <div class="col">
                                <select class="custom-select mb-2" v-model="form.selectedSpecial">
                                    <option v-for="(value, key) in form.specials" :value="{data:value, id:key}">
                                        {{ key }}: {{ value.name }} : {{ value.city }} : {{ value.background_color }}
                                    </option>
                                </select>
                                <input type="text" class="form-control mb-2 mr-sm-2" placeholder="0x123..." v-model="form.recipient">
                                <button class="btn btn-danger" @click="createSpecial">Mint Special</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-jumbotron>
    </div>
</template>

<script>
    import { ethers } from 'ethers';

    export default {
        name: 'home',
        data () {
            return {
                blockcitiesAbi: [
                    {
                        'constant': true,
                        'inputs': [{'name': 'interfaceId', 'type': 'bytes4'}],
                        'name': 'supportsInterface',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'name',
                        'outputs': [{'name': '', 'type': 'string'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'getApproved',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'to', 'type': 'address'}, {'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'approve',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'addWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'totalSupply',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_newBaseURI', 'type': 'string'}],
                        'name': 'updateTokenBaseURI',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'from', 'type': 'address'}, {'name': 'to', 'type': 'address'}, {
                            'name': 'tokenId',
                            'type': 'uint256'
                        }],
                        'name': 'transferFrom',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'removeWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'owner', 'type': 'address'}, {'name': 'index', 'type': 'uint256'}],
                        'name': 'tokenOfOwnerByIndex',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'isWhitelisted',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'tokenIdPointer',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'totalBuildings',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'from', 'type': 'address'}, {'name': 'to', 'type': 'address'}, {
                            'name': 'tokenId',
                            'type': 'uint256'
                        }],
                        'name': 'safeTransferFrom',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'name': 'burn',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'renounceWhitelistAdmin',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'tokenBaseURI',
                        'outputs': [{'name': '', 'type': 'string'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'index', 'type': 'uint256'}],
                        'name': 'tokenByIndex',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'ownerOf',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'owner', 'type': 'address'}],
                        'name': 'balanceOf',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'addWhitelistAdmin',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'owner', 'type': 'address'}],
                        'name': 'tokensOfOwner',
                        'outputs': [{'name': '', 'type': 'uint256[]'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_exteriorColorway', 'type': 'uint256'}, {
                            'name': '_backgroundColorway',
                            'type': 'uint256'
                        }, {'name': '_city', 'type': 'uint256'}, {'name': '_building', 'type': 'uint256'}, {
                            'name': '_base',
                            'type': 'uint256'
                        }, {'name': '_body', 'type': 'uint256'}, {'name': '_roof', 'type': 'uint256'}, {
                            'name': '_special',
                            'type': 'uint256'
                        }, {'name': '_architect', 'type': 'address'}],
                        'name': 'createBuilding',
                        'outputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'symbol',
                        'outputs': [{'name': '', 'type': 'string'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'to', 'type': 'address'}, {'name': 'approved', 'type': 'bool'}],
                        'name': 'setApprovalForAll',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'from', 'type': 'address'}, {'name': 'to', 'type': 'address'}, {
                            'name': 'tokenId',
                            'type': 'uint256'
                        }, {'name': '_data', 'type': 'bytes'}],
                        'name': 'safeTransferFrom',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'isWhitelistAdmin',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'tokenURI',
                        'outputs': [{'name': '', 'type': 'string'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'name': 'attributes',
                        'outputs': [{'name': '_exteriorColorway', 'type': 'uint256'}, {
                            'name': '_backgroundColorway',
                            'type': 'uint256'
                        }, {'name': '_city', 'type': 'uint256'}, {'name': '_building', 'type': 'uint256'}, {
                            'name': '_base',
                            'type': 'uint256'
                        }, {'name': '_body', 'type': 'uint256'}, {'name': '_roof', 'type': 'uint256'}, {
                            'name': '_special',
                            'type': 'uint256'
                        }, {'name': '_architect', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'renounceWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'owner', 'type': 'address'}, {'name': 'operator', 'type': 'address'}],
                        'name': 'isApprovedForAll',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'inputs': [{'name': '_tokenBaseURI', 'type': 'string'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'constructor'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': '_tokenId', 'type': 'uint256'}, {
                            'indexed': true,
                            'name': '_to',
                            'type': 'address'
                        }, {'indexed': true, 'name': '_architect', 'type': 'address'}],
                        'name': 'BuildingMinted',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistedAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistedRemoved',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistAdminAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistAdminRemoved',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {
                            'indexed': true,
                            'name': 'to',
                            'type': 'address'
                        }, {'indexed': true, 'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'Transfer',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'owner', 'type': 'address'}, {
                            'indexed': true,
                            'name': 'approved',
                            'type': 'address'
                        }, {'indexed': true, 'name': 'tokenId', 'type': 'uint256'}],
                        'name': 'Approval',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'owner', 'type': 'address'}, {
                            'indexed': true,
                            'name': 'operator',
                            'type': 'address'
                        }, {'indexed': false, 'name': 'approved', 'type': 'bool'}],
                        'name': 'ApprovalForAll',
                        'type': 'event'
                    }],
                blockcitiesContract: null,
                vendingAbi: [
                    {
                        'constant': true,
                        'inputs': [],
                        'name': 'floorPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'blockcities',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'blockCities',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'lastSaleBlock',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'mintBatch',
                        'outputs': [{'name': '_tokenIds', 'type': 'uint256[]'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'totalPrice',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_ceilingPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'setCeilingPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'colourGenerator',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_partner', 'type': 'address'}],
                        'name': 'updatePartnerAddress',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
                        'name': 'addCreditAmount',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'totalPurchasesInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'mintBuilding',
                        'outputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_colourGenerator', 'type': 'address'}],
                        'name': 'setColourGenerator',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_techPartnerRate', 'type': 'uint256'}],
                        'name': 'updatePartnerRate',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_addresses', 'type': 'address[]'}, {'name': '_amount', 'type': 'uint256'}],
                        'name': 'addCreditBatch',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}],
                        'name': 'mintBuildingTo',
                        'outputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'renounceOwnership',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_blockStep', 'type': 'uint256'}],
                        'name': 'setBlockStep',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_floorPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'setFloorPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'logicGenerator',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}],
                        'name': 'addCredit',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'lastSalePrice',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_logicGenerator', 'type': 'address'}],
                        'name': 'setLogicGenerator',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'owner',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'isOwner',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_blockcities', 'type': 'address'}],
                        'name': 'updateBlockcitiesAddress',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_newPriceDiscountBands', 'type': 'uint256[2]'}],
                        'name': 'setPriceDiscountBands',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_pricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'setPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_lastSaleBlock', 'type': 'uint256'}],
                        'name': 'setLastSaleBlock',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'partnerRate',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'priceStepInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'partner',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_priceStepInWei', 'type': 'uint256'}],
                        'name': 'setPriceStepInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'blockStep',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '', 'type': 'uint256'}],
                        'name': 'priceDiscountBands',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'mintBatchTo',
                        'outputs': [{'name': '_tokenIds', 'type': 'uint256[]'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'ceilingPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'newOwner', 'type': 'address'}],
                        'name': 'transferOwnership',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '', 'type': 'address'}],
                        'name': 'credits',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'inputs': [{'name': '_logicGenerator', 'type': 'address'}, {
                            'name': '_colourGenerator',
                            'type': 'address'
                        }, {'name': '_blockCities', 'type': 'address'}, {
                            'name': '_blockCitiesAddress',
                            'type': 'address'
                        }, {'name': '_partnerAddress', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'constructor'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': '_tokenId', 'type': 'uint256'}, {
                            'indexed': true,
                            'name': '_architect',
                            'type': 'address'
                        }],
                        'name': 'VendingMachineTriggered',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': '_to', 'type': 'address'}, {
                            'indexed': false,
                            'name': '_amount',
                            'type': 'uint256'
                        }],
                        'name': 'CreditAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_priceDiscountBands', 'type': 'uint256[2]'}],
                        'name': 'PriceDiscountBandsChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldPriceStepInWei', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newPriceStepInWei',
                            'type': 'uint256'
                        }],
                        'name': 'PriceStepInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{
                            'indexed': false,
                            'name': '_oldPricePerBuildingInWei',
                            'type': 'uint256'
                        }, {'indexed': false, 'name': '_newPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'PricePerBuildingInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{
                            'indexed': false,
                            'name': '_oldFloorPricePerBuildingInWei',
                            'type': 'uint256'
                        }, {'indexed': false, 'name': '_newFloorPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'FloorPricePerBuildingInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{
                            'indexed': false,
                            'name': '_oldCeilingPricePerBuildingInWei',
                            'type': 'uint256'
                        }, {'indexed': false, 'name': '_newCeilingPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'CeilingPricePerBuildingInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldBlockStep', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newBlockStep',
                            'type': 'uint256'
                        }],
                        'name': 'BlockStepChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldLastSaleBlock', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newLastSaleBlock',
                            'type': 'uint256'
                        }],
                        'name': 'LastSaleBlockChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'previousOwner', 'type': 'address'}, {
                            'indexed': true,
                            'name': 'newOwner',
                            'type': 'address'
                        }],
                        'name': 'OwnershipTransferred',
                        'type': 'event'
                    }],
                vendingContract: null,
                vendingAbiV2: [
                    {
                        'constant': true,
                        'inputs': [],
                        'name': 'floorPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'blockCities',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'addWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'lastSaleBlock',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'mintBatch',
                        'outputs': [{'name': '_tokenIds', 'type': 'uint256[]'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'totalPrice',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'removeWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_ceilingPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'setCeilingPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'isWhitelisted',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'colourGenerator',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_partner', 'type': 'address'}],
                        'name': 'updatePartnerAddress',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'platform',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'renounceWhitelistAdmin',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
                        'name': 'addCreditAmount',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'totalPurchasesInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'mintBuilding',
                        'outputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_colourGenerator', 'type': 'address'}],
                        'name': 'setColourGenerator',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_techPartnerRate', 'type': 'uint256'}],
                        'name': 'updatePartnerRate',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_addresses', 'type': 'address[]'}, {'name': '_amount', 'type': 'uint256'}],
                        'name': 'addCreditBatch',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}],
                        'name': 'mintBuildingTo',
                        'outputs': [{'name': '_tokenId', 'type': 'uint256'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_blockStep', 'type': 'uint256'}],
                        'name': 'setBlockStep',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_floorPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'setFloorPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'addWhitelistAdmin',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'logicGenerator',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}],
                        'name': 'addCredit',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'lastSalePrice',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_logicGenerator', 'type': 'address'}],
                        'name': 'setLogicGenerator',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_platform', 'type': 'address'}],
                        'name': 'updatePlatformAddress',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_newPriceDiscountBands', 'type': 'uint256[2]'}],
                        'name': 'setPriceDiscountBands',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_lastSaleBlock', 'type': 'uint256'}],
                        'name': 'setLastSaleBlock',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'partnerRate',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': 'account', 'type': 'address'}],
                        'name': 'isWhitelistAdmin',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'priceStepInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'partner',
                        'outputs': [{'name': '', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_priceStepInWei', 'type': 'uint256'}],
                        'name': 'setPriceStepInWei',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'blockStep',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '', 'type': 'uint256'}],
                        'name': 'priceDiscountBands',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_numberOfBuildings', 'type': 'uint256'}],
                        'name': 'mintBatchTo',
                        'outputs': [{'name': '_tokenIds', 'type': 'uint256[]'}],
                        'payable': true,
                        'stateMutability': 'payable',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [],
                        'name': 'renounceWhitelisted',
                        'outputs': [],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [],
                        'name': 'ceilingPricePerBuildingInWei',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'constant': false,
                        'inputs': [{'name': '_lastSalePrice', 'type': 'uint256'}],
                        'name': 'setLastSalePrice',
                        'outputs': [{'name': '', 'type': 'bool'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    }, {
                        'constant': true,
                        'inputs': [{'name': '', 'type': 'address'}],
                        'name': 'credits',
                        'outputs': [{'name': '', 'type': 'uint256'}],
                        'payable': false,
                        'stateMutability': 'view',
                        'type': 'function'
                    }, {
                        'inputs': [{'name': '_logicGenerator', 'type': 'address'}, {
                            'name': '_colourGenerator',
                            'type': 'address'
                        }, {'name': '_blockCities', 'type': 'address'}, {
                            'name': '_platform',
                            'type': 'address'
                        }, {'name': '_partnerAddress', 'type': 'address'}],
                        'payable': false,
                        'stateMutability': 'nonpayable',
                        'type': 'constructor'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': '_tokenId', 'type': 'uint256'}, {
                            'indexed': true,
                            'name': '_architect',
                            'type': 'address'
                        }],
                        'name': 'VendingMachineTriggered',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': '_to', 'type': 'address'}, {
                            'indexed': false,
                            'name': '_amount',
                            'type': 'uint256'
                        }],
                        'name': 'CreditAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_priceDiscountBands', 'type': 'uint256[2]'}],
                        'name': 'PriceDiscountBandsChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldPriceStepInWei', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newPriceStepInWei',
                            'type': 'uint256'
                        }],
                        'name': 'PriceStepInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{
                            'indexed': false,
                            'name': '_oldFloorPricePerBuildingInWei',
                            'type': 'uint256'
                        }, {'indexed': false, 'name': '_newFloorPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'FloorPricePerBuildingInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{
                            'indexed': false,
                            'name': '_oldCeilingPricePerBuildingInWei',
                            'type': 'uint256'
                        }, {'indexed': false, 'name': '_newCeilingPricePerBuildingInWei', 'type': 'uint256'}],
                        'name': 'CeilingPricePerBuildingInWeiChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldBlockStep', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newBlockStep',
                            'type': 'uint256'
                        }],
                        'name': 'BlockStepChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldLastSaleBlock', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newLastSaleBlock',
                            'type': 'uint256'
                        }],
                        'name': 'LastSaleBlockChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': false, 'name': '_oldLastSalePrice', 'type': 'uint256'}, {
                            'indexed': false,
                            'name': '_newLastSalePrice',
                            'type': 'uint256'
                        }],
                        'name': 'LastSalePriceChanged',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistedAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistedRemoved',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistAdminAdded',
                        'type': 'event'
                    }, {
                        'anonymous': false,
                        'inputs': [{'indexed': true, 'name': 'account', 'type': 'address'}],
                        'name': 'WhitelistAdminRemoved',
                        'type': 'event'
                    }],
                vendingContractV2: null,
                pricePerBuildingInWei: null,
                pricePerBuildingInEth: null,
                lastPricePerBuildingInEth: null,
                blocknumber: null,
                lastSaleBlock: null,
                totalEth: null,
                totalEthV2: null,
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
