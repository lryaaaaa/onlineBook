<template>
    <div>
        <!-- <Header :isShow="state.islogin" :user="state.user"  @vShow0="Show1"></Header> -->
        <h3>我的购物车</h3>
        <!-- <div>{{ cartlist}}</div> -->
        <div class="jeisuan">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <van-button type="primary" @click="checkAll">全选</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <van-button type="primary" @click="toggleAll">全不选</van-button>
            <div class="kong"></div>
            <p>合计:￥{{state.total}}</p>
            <van-button class="buy" type="success" @click="Buy()">结算</van-button>
        </div>
        <li class="header">
            <div style="width:183px"></div>
            <p>书名</p>
            <p>单价</p>
            <p>数量</p>
            <p>总价</p>
            <p>操作</p>
        </li>
            
        <!-- <van-checkbox-group v-model="checked" ref="checkboxGroup">  -->
        <li class="cart-item" v-for="(item,index) in state.list" :key="index">
            
           <!-- <van-checkbox v-model="item.select" @click="Select(item.select,item.total)">&nbsp;&nbsp;</van-checkbox> -->
           <input type="checkbox" v-model="item.flag" @click="Select1(item,index)">&nbsp;&nbsp;&nbsp;
            <img :src="item.cart_avatar" alt="">
            <p>{{ item.cart_bookname }}</p>
            <p>￥{{ item.cart_price }}</p>
           <p>{{ item.cart_count }}</p> 
            <p>￥{{ item.total}}</p>
            <van-button class="van" type="danger" @click="Delete(item.cart_bookname,item.cart_account)">删除</van-button>
        
        </li>
    <!-- </van-checkbox-group> -->
        <div class="buys" v-if="state.buy">
            <p>请选择地址</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收件人-----电话------地址</p>
            <ul v-for="(item ,index) in state.address" :key="index">
            <input type="radio"  @click="Select2(item,index)">&nbsp;&nbsp;&nbsp;
            {{ item.ad_addressee }}
            {{ item.ad_phone }}
            {{ item.ad_address }}
            </ul>
            <br>
            <br>
            <p style="color:red">请使用手机支付宝扫二维码</p><br><br>
            <img src="../../public/images/a.png" alt=""><br><br>
            <van-button type="primary" @click="state.buy=false">取消支付</van-button>&nbsp;&nbsp;&nbsp;
            <van-button type="success" @click="Addorder()">支付成功</van-button>
        </div>
        
    </div>
</template>

<script setup>
import { onMounted,reactive} from 'vue';
import {deleteCart,CartList,ADDress,ADDorder} from '../api/index'
import {showToast} from 'vant'
import qs from 'qs'

// const address=computed(()=>userStore.state.address)
const state=reactive({
    show:false,
    user:{},
    total:0,
    list:[],
    tobuy:[],
    buy:false,
    address:[]
})
//添加订单
const Addorder=()=>{
    if(state.user.ad_user){
        let a=0; //计算出订单内件数
        for(let i=0;i<state.tobuy.length;i++){
            a=a+state.tobuy[i].cart_count    
        }
        console.log(state.tobuy)
        let data={
            account:state.user.ad_user,
            addressee:state.user.ad_addressee,
            address:state.user.ad_address,
            phone:state.user.ad_phone,
            total:state.total,
            count:a,
            goods:state.tobuy
            
        }
        ADDorder(qs.stringify(data)).then(res=>{
            if(res.status===200){
                showToast(res.msg);
                window.location.reload()
                alert('订单支付成功，请前往订单页确认认订单信息!')
            }
        })

    
        state.buy=false    
    }else{
        showToast('请先选择收件信息')
    }
    
}
//获取订单地址信息
const Select2=(data1,data2)=>{//1是信息，2是下标
    // console.log(data.ad_phone)
    state.user=state.address[data2]
    console.log(state.user)

    
    
}
//删除商品
const Delete=(data1,data2)=>{
    let data={
        name:data1,
        account:data2
    }
    deleteCart(qs.stringify(data)).then(res=>{
        
        if(res.status===200){
            showToast(res.msg)
            window.location.reload()
        }
       })
}
//勾选其一
const Select1=(data1,data2)=>{

    if(data1.flag===true){

        state.total=state.total-data1.total
        console.log(state.tobuy)

        
    }
    else{
        state.tobuy.push(state.list[data2])
        state.total=state.total+data1.total
        console.log(state.tobuy)
    }
}
//全选
const checkAll=()=>{
    state.tobuy=state.list;
    state.total=0;
    for(let i in state.list){ 
        state.list[i].flag=true
        state.total=state.total+state.list[i].total
     }
     
     //再把数组处理下得到部分属性
}
//全不选
const toggleAll=()=>{
   state.tobuy=[];
   state.total=0;
   for(let i in state.list){
        state.list[i].flag=false

     }
   
}
const Buy=()=>{
    if(state.tobuy.length>0){
        ADDress().then(res=>{
            if(res.status===200){
                state.address=res.data
                console.log(res.data)
            }
        })
        state.buy=true
    }
    else{
        showToast('您还没选择要结算的商品!')
    }
    
}
onMounted(()=>{
    CartList().then(res=>{
        if(res.status===200){
            for(let i=0;i<res.data.length;i++){
                    Reflect.set(res.data[i],'total',res.data[i].cart_count*res.data[i].cart_price)
                    Reflect.set(res.data[i],'flag',false)
                }
            state.list=res.data
        }
    })
})
</script>

<style scoped>
h3{
    text-align: center;
}
.jeisuan{
    display: flex;
}
.kong{
    flex:1
}
.jeisuan p{
    width:100px;
    float: right;
    color:hsla(0, 90%, 52%, 0.859)
}
.buy{
    float:right;
    margin-right: 60px;
}
.cart-item{
    display: flex;
    margin:30px;
    text-align: center;
    justify-content: center;
}
.cart-item p{
    width:120px;
    line-height: 70px;
}
.van{
    margin:auto 0;
}
img{
    width:100px
}
.header{
    display: flex;
    text-align: center;
    justify-content: center;
}
.header p{
    width:120px
}
.buys{
    text-align: center;
    top:50%;
    left:50%;
    position:fixed;
    z-index:100;
    margin-top: -200px;
    margin-left: -150px;
    background-color: #dcdcdc;
    padding: 20px;
}
</style>