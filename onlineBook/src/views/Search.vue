<template>
    <div class="list">
        <bookList v-for="(item,index) in list" :key="index" :book="item" @click="detailStore.ASD(item)"/>
        </div>
</template>

<script setup>
import bookList from '../components/bookList.vue'
import { onMounted,reactive,computed ,watchEffect} from 'vue';
import { useSearchStore } from '../store/search';
import { useRouter } from 'vue-router';
const router=useRouter()
const searchStore=useSearchStore()
const list=computed(()=>searchStore.state.list)

watchEffect(()=>{
    // console.log(router.currentRoute.value.params)
    searchStore.LoadSearch(router.currentRoute.value.params)
})
</script>

<style  scoped>

.list{
    display: flex;
    flex-wrap: wrap;
    background-color: #FFFACD;
}
</style>