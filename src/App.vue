<template>
    <div class="container-fluid">
        <div>
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
        </div>
        <div>
            <router-view/>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';
</style>
