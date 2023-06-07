<script setup>
import Header from './components/Header.vue'
import { onMounted,reactive,ref } from 'vue';
import {GetInfo} from './api/index'
import { useListStore } from './store/list';
import {Signin,Signup} from './api/index'
import qs from 'qs'
import { showToast } from 'vant'
import {useUserStore} from './store/use'
import { useSearchStore } from './store/search';
const listStore=useListStore()
const useStore=useUserStore()
const searchStore=useSearchStore()
const state=reactive({
    show:false,
    case:0,
    islogin:false,
    user:{},
    tuichu:false
})
let name=ref(null)
let account=ref(null)
let password=ref(null)

onMounted(()=>{
    let token0=localStorage.getItem('token')
    if(token0){
        GetInfo().then(res=>{
            console.log(res,'123333')
            if(res.status===400 || res.status===401){
                //登陆信息失效，需要重新登陆
                localStorage.removeItem('token')
                window.location.reload();
            }else{
                state.islogin=true;
                state.user=res.data;
                state.tuichu=true
                useStore.getUser(res.data)
            }
        })
    }
})
const toUser=()=>{

}

const Login=()=>{
    let data={
    account:account.value,
    pwd:password.value
    
   }
   console.log(data,'123')
   Signin(qs.stringify(data)).then(res=>{
    console.log(res)
    if(res.status==0){
        // message({
        //     type: "fail",
        //     message: res.msg,
        //   });
        showToast(`${res.msg}`)
    }
    if(res.status==400){
        showToast(`${res.msg}`)
    }
    if(res.status==200){
        showToast(`${res.msg}`)
        console.log(res,'444')
        localStorage.setItem('token',res.data.token)
        window.location.reload();
    }
    
   })
}
const Cancel=()=>{
    state.show=false
}
// const SignUp1=()=>{
//    state.show=true
//    state.case=1

// }
const Submit=()=>{
    let data={
    name:name.value,
    pwd:password.value   
   }
    // console.log(data,'321')
    Signup(qs.stringify(data)).then(res=>{
        console.log(res.data.account,'123')
        localStorage.setItem('token',res.data.token)
        //res中带有account ,token
        window.location.reload();

    })
}
const Show1=(data)=>{
    state.show=true
    state.case=data

}
const vShow=()=>{
    return state.show
}
const Search=(data)=>{
    searchStore.Search(data.value)
}
</script>

<template>
  <div class="page">

  <Header :isShow="state.islogin" :user="state.user" @search="Search" :tuichu="state.tuichu"  @vShow0="Show1"></Header>
  <div class="titlebar">
            <van-button @click="listStore.toList('热销')">热销榜</van-button>
            <van-button @click="listStore.toList('小说')">小说</van-button>
            <van-button @click="listStore.toList('文学')">文学</van-button>
            <van-button @click="listStore.toList('百科')">百科</van-button>
            <van-button @click="listStore.toList('经济')">经济</van-button>
            <van-button @click="listStore.toList('艺术')">艺术</van-button>
            <van-button @click="listStore.toList('厨艺')">厨艺</van-button>
            <van-button @click="listStore.toList('童书')">童书</van-button>
            <van-button @click="listStore.toList('教辅')">教辅</van-button>
            <!-- 头部导航 -->    
        </div>
  <div class="signUpIn" v-if="vShow()" >
        <h3 v-if="state.case===1">注册</h3>
        <h3 v-else>登录</h3>
        <form method="post" >
            <div v-if="state.case===1" >
                <label for="name">昵称:</label>
        <input class="name" type="text" v-model="name" id="name" name="name"><br><br>
            </div>
        <div v-else>
            <label  for="account">账号:</label>
        <input  class="account" v-model="account" name="account" type="number"><br><br>
        </div>
        
        <label for="password">密码:</label>
        <input class="pwd" type="password" v-model="password" id="password" name="password"><br><br>
        <input type="submit" v-if="state.case===1" value="注册" @click.prevent="Submit">
        <input type="submit" v-else value="登录" @click.prevent="Login">
        <input type="submit" class="cancel"  value="取消" @click.prevent="Cancel">

        </form>
    </div>
  <body>
    
    <router-view></router-view>
  </body>
    
  </div>
</template>

<style  scoped>
.page{
    width:100%;
    display :flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background-color: #fff;
  }
  .titlebar{
    width: 800px;
    margin: 0 auto;
    /* background-color: #94a7ae; */
  }
body{
  
    width:800px;
    /* background-color:#94a7ae; */
    margin: 0 auto;
    justify-content:space-between;
    overflow: hidden;
    overflow-y: scroll;

}
.signUpIn{
    text-align: center;
    top:50%;
    left:50%;
    position:fixed;
    z-index:100;
    margin-top: -100px;
    margin-left: -150px;
    background-color: #dcdcdc;
    padding: 20px;
}
.cancel{
  margin-left:20px
}
  
</style>
