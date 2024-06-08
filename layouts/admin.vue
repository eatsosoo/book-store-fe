<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="bg-primary">
                <v-list-item prepend-avatar="https://cdn.dribbble.com/userupload/6810642/file/original-45a54e0571ae13ce154f565f49615607.png?resize=400x0" title="BOOKIE" nav>
                    <template v-slot:append>
                        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
                    </template>
                </v-list-item>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <NuxtLink to="/admin" class="Link">
                        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
                    </NuxtLink>
                    <NuxtLink to="/admin/products" class="Link">
                        <v-list-item prepend-icon="mdi-package-variant-closed" title="Products" value="products"></v-list-item>
                    </NuxtLink>
                    <NuxtLink to="/admin/add" class="Link">
                        <v-list-item prepend-icon="mdi-plus-box-multiple" title="New" value="new_product"></v-list-item>
                    </NuxtLink>
                </v-list>
            </v-navigation-drawer>
            <v-main class="BgMain">
                <v-row>
                    <v-col cols="12">
                        <div class="Bar">
                            <v-icon class="IconBar">mdi-account</v-icon>
                        </div>
                    </v-col>
                </v-row>
                <v-container>
                    <div class="Wrapper">
                        <slot />
                    </div>
                </v-container>
            </v-main>
        </v-layout>
    </v-card>
</template>
<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
</script>

<style lang="scss" scoped>
.Link {
    text-decoration: none;
    color: inherit;

    i {
        color: #a287d7;
    }
}
.IconBar {
    font-size: 20px;
    padding: 20px;
    border: 1px solid #a287d7;
    border-radius: 50%;
    color: #fff;
    background-color: #a287d7;
    cursor: pointer;
}
.Bar {
    border-bottom: 1px solid #E4E4E4;
    height: 57px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 20px;
    background: white;
}
.BgMain {
    background-color: #f5f5f5;
    height: 100vh;
}
.Wrapper {
    max-width: 1440px;
    margin: 0 auto;
}
</style>