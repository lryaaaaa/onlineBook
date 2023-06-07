<template>
    <div class="header">
        <h2>网上书店</h2>
        <router-link class="shoye" to="/">首页</router-link>
        <input class="search" type="text" @keyup.enter.native="Search()" v-model.lazy="searchval" placeholder="请输入搜索的书名/作者">
        <!-- <router-link class="gouwuche" to="/cart">
            <img src="../../public/images/svg/gouwuche.svg" alt="">
        </router-link> -->
        <van-button class="gouwuche" @click="Cart">
            <img src="../../public/images/svg/gouwuche.svg" alt="">
        </van-button>
        <div class="denglu" v-if="isShow===false">
        <van-button type="primary" @click="SignUp1">注册</van-button>&nbsp;&nbsp;&nbsp;
        <van-button type="success" @click="SignIn1">登录</van-button>
        </div>
        <van-btton class="yonghu" v-else  @click="router.push('/user')"> <p>你好,{{ user.name }}</p>
            <img class="toux" src="../../public/images/svg/touxiang.svg" alt="">
        </van-btton>
        <van-button v-if="tuichu" class="tuichu" @click="tuchu">退出 <img src="../../public/images/svg/tuichu.svg" alt=""></van-button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive ,toRefs,defineProps,defineEmits,ref} from 'vue';
import { useListStore } from '../store/list';
import {showToast} from 'vant'
const router=useRouter()
const listStore=useListStore()
const props=defineProps({
    isShow:Boolean,
    user:Object,
    tuichu:Boolean
})
let searchval=ref(null)
// let tuichu=ref(false)
const {isShow}=toRefs(props)
const {user}=toRefs(props)
console.log(user.value,'222222')
const tuchu=()=>{
    localStorage.removeItem('token');
    window.location.reload();

}
let token=localStorage.getItem('token') || ''
const Cart=()=>{
    if(token!==''){
        router.push({
            path:'/cart'
        })
    }
    else{
        showToast('你还没有登录，请登录在操作')
    }
}
console.log(isShow.value,'222222222')
const emit=defineEmits(['vShow0','search'])
// const emit0=defineEmits(['search'])
const SignUp1=()=>{
    emit('vShow0',1)
}
const SignIn1=(e)=>{
    emit('vShow0',2)
} 
const Search=()=>{
    emit('search',searchval)
}
</script>

<style scoped>
.header{
    width: 800px;
    background-color: #ffbb98;
    height: 100px;
    /* position: absolute; */
    /* top:0; */
    /* left:0; */
    margin: 0 auto;
    display: flex;
    text-align: center;
    justify-content: center;
}
.yonghu,.denglu,.gouwuche,.tuichu{
    float: right;
    background-color: #ffbb98;
    margin: auto 0;
    border:none
}
.yonghu{
    display: flex;
}
h2{
    margin: auto 50px;
}
p{
    margin: auto 0;
}
.shoye,.gouwuche,.denglu,.tuichu{
    margin: auto 10px;
}
.input{
    width:100px
}
.gouwuche img{
    width: 30px;
}
.search{
    height: 50px;
    margin: auto 0;
}
.toux{
    width :50px;
}
.tuichu img{
    width:20px
}
</style>