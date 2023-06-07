<template>
    <div class="xx" >
        <!-- <Header :isShow="state.islogin" :user="state.user"  @vShow0="Show1"></Header> -->
        <h3>个人信息</h3>
        <pre> <h4> 昵称   :   {{user.name  }}</h4></pre>
        <pre><h4>  账号   :   {{ user.account }}</h4></pre>
        <pre><h4>               注册时间 : {{ user.date }}</h4></pre>
        <pre><h4>购买次数: {{ user.buys }}</h4></pre>
        <!-- <router-link to="/order">查看我的订单</router-link> -->
        <van-button type="success" @click="router.push({path:'/order'})">查看我的订单</van-button>&nbsp;&nbsp;&nbsp;
        <van-button type="primary" @click="ADDress">查看我的地址信息</van-button>
        <van-button class="button" type="danger" @click="fixed">修改个人信息</van-button>
        <form action="" v-if="state.show0==true" method="post" class="fixed">
            <div class="tables" v-if="state.show3">
                <label for="">昵称:</label>
            <input type="text" v-model.lazy="state.nicheng" placeholder="请输入你要修改的昵称"><br><br>
            
            

            <van-button class="button" type="primary" @click="Change2">取消</van-button>
            <van-button class="button"  type="success" @click="Submit1">提交</van-button><br><br>
            <van-button  class="button" type="danger" @click="Change">修改密码</van-button><br><br></div>
            <div class="tables" v-if="state.show1===true">
                <label for="">当前密码:</label>
                <input  type="password"  v-model.lazy="state.pwd1" placeholder="请输入当前密码"><br><br>
                 <van-button class="button"  type="primary" @click="Change2">取消</van-button>
                <van-button class="button"  type="success" @click="Submit2">提交</van-button><br><br>
             </div>   
                <div class="tables" v-if="state.show4===true">
                    <label for="">修改后密码:</label>
                <input  type="password"  v-model.lazy="state.pwd2" placeholder="请输入修改后密码"><br><br>
                <label for="">确认密码:</label>
                <input  type="password"  v-model.lazy="state.pwd3" placeholder="请确认修改后密码"><br><br>
                <van-button class="button"  type="primary" @click="Change2">取消</van-button>
                <van-button class="button"  type="success" @click="Submit3">提交</van-button><br><br>
                </div>
                
            
           
            
        </form>
        <div class="address" v-if="state.address">
            <h4>收件信息</h4>
            <div class="ress-item" v-if="address.length>0" v-for="(item,index) in address" :key="index">
                <p>收件地址{{ index+1 }}</p>
                <p>收件人:{{ item.ad_addressee }}</p>
                <p>电话:{{ item.ad_phone }}</p>
                <p>地址:{{ item.ad_address }}</p>
                <van-button  type="danger" @click="deleteADD(item.adid)">删除</van-button>
            </div>
            <div v-else>你还没有添加收件人</div><br><br>
            <van-button class="address-add" type="primary" @click="ADDadd">添加收件人</van-button>&nbsp;&nbsp;&nbsp;
            <van-button type="primary" @click="state.address=false">关闭</van-button>
        </div>
        <form class="address" action="" method="post" v-if="state.ress">
            <h4>添加收件人</h4>
            <label for="addressee">收件人姓名:</label>
            <input type="text" v-model="addressee" placeholder="请输入收件人姓名"><br><br>
            <label for="phone">收件人电话:</label>
            <input type="number" v-model="phone" placeholder="请输入电话"><br><br>
            <label for="address">收件人地址:</label>
            <input type="text" v-model="address1" placeholder="请输入地址"><br><br>
            <van-button type="primary" @click="state.ress=false">取消</van-button>&nbsp;&nbsp;&nbsp;
            <van-button type="success" @click="ADDaddress(user.account)">提交</van-button>
        </form>
    </div>
</template>

<script setup>

import { onMounted ,computed,ref,reactive} from 'vue';
import { useUserStore } from '../store/use';
import { Fixed,Signin,addAddress,Delete} from '../api/index'
import qs from 'qs'
import  router  from '../router/index';
import{showToast} from 'vant'
const useStore=useUserStore()
const user=computed(()=>useStore.state.user)
const address=computed(()=>useStore.state.address)
const state=reactive({
    show0:false,
    show1:false,
    show3:true,
    show4:false,
    nicheng:'',
    pwd1:'',
    pwd2:'',
    pwd3:'',
    showW:true,
    address:false,
    ress:false
})
const addressee=ref(null)
const phone=ref(null)
const address1=ref(null)
//地址
const ADDress=()=>{
    state.address=true;
    useStore.getAddress()
}
//打开添加地址
const ADDadd=()=>{
    state.ress=true
}
//提交地址
const ADDaddress=(data0)=>{
    let data={
        account:data0,
        name:addressee.value,
        address:address1.value,
        phone:phone.value
    }
    console.log(data)
    addAddress(qs.stringify(data)).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            state.ress=false
            // useStore.getAddress()
        }
    })
}
//删除地址
const deleteADD=(data)=>{
    let dataObj={
        uid:data
    }
    console.log(dataObj)
    Delete(qs.stringify(dataObj)).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            window.location.reload()

        }
    })
}
//修改功能
const fixed=()=>{
    state.show0=true
    // console.log(state.show0)
    
}
const Change=()=>{
    state.show1=true
    state.show3=false
}
const Change1=()=>{
    state.show1=false
}
const Change2=()=>{
    state.show0=false
    state.show1=false
    state.show3=true
}
//提交
const Submit1=()=>{
    let data={
        // account:user.value,
        name:state.nicheng
    }
    // console.log(data,'bbbbb')
    Fixed(qs.stringify(data)).then(res=>{
        // console.log(res)
        // Change2()
        if(res.status===200){
            alert(res.msg)
            window.location.reload();
        }
    })


}
const Submit2=()=>{
    let data={
        pwd:state.pwd1
    }
    console.log(data,'bbbbb')
    Fixed(qs.stringify(data)).then(res=>{
        if(res.status===200){
            alert(res.msg)
            state.show4=true
            state.show1=false

        }
        else{
            alert(res.msg)
            state.nicheng=''
        }
    })
}
const Submit3=()=>{
    if(!state.pwd2===state.pwd3){
        alert('前后两次密码不一致')
    }
    if(state.pwd2===state.pwd3){
       let data={
        pwd2:state.pwd2
       } 
       Fixed(qs.stringify(data)).then(res=>{
        if(res.status===200){
            alert(res.msg)
            localStorage.removeItem('token');
            window.location.reload()
            alert('未登录,请登录!')
            // state.showW=false
        }
       })
    }
}
onMounted(()=>{
    // let token=localStorage.getItem('token')
    // if(token){
    //     state.showW=true
    // }
})
</script>

<style  scoped>
h3{
    text-align: center;
    margin: 30px 0;
}
/* p{
    margin:30px 30px;
} */
pre{
    margin:30px 30px;
    font-family: 'Courier New', Courier, monospace;
}
.xx{
    text-align: center;
}
.button{
    margin: 20px 20px;
}
.tables{
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
.address{
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
.ress-item{
    display: flex;
}
.ress-item p{
    margin-right: 30px;
}
</style>