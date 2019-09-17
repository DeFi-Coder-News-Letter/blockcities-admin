<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="danger">
            <b-navbar-brand to="/">BlockCities Admin</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-item :to="{name:'config'}">Config</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="container-fluid mt-4">
            <router-view/>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';
</style>
