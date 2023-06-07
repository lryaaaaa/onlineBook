<template>
    <div>
        <!-- <Header :isShow="state.islogin" :user="state.user"  @vShow0="Show1"></Header> -->
        <h4 class="title" v-if="list.length>0">{{ list[0].cate }}</h4>
        <div class="list">
        <bookList v-for="(item,index) in list" :key="index" :book="item" @click="detailStore.ASD(item)"/>
        </div>
        
    </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { onMounted,reactive,computed ,watchEffect} from 'vue';
import bookList from '../components/bookList.vue';
import { useListStore } from '../store/list';
import {useDetailStore} from '../store/detail';
import { useRouter } from 'vue-router';
const router=useRouter()
const detailStore=useDetailStore()
const listStore=useListStore()
const list=computed(()=>listStore.state.list)

watchEffect(()=>{
    // console.log(router.currentRoute.value.params)
    listStore.LoadList(router.currentRoute.value.params)
})
</script>

<style  scoped>
.list{
    display: flex;
    flex-wrap: wrap;
    background-color: #FFFACD;
}
.title{
    text-align: center;
}
</style>