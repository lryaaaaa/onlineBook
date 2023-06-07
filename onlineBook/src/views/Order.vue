<template>
    <div>
        <h3>我的订单</h3>
        <ul v-for="(item,index) in state.list" :key="index">
            <li class="order">
                <div class="x1">
                    <p >订单编号:{{ item.uid }}</p>
                    <p>收件人:{{ item.addressee }}</p>
                    <p>电话:{{ item.phone }}</p>
                </div>
                <div class="x2">
                     <p>地址:{{ item.address }}</p><br>
                     <p>订单内容:</p>
                <div class="content" v-for="(item,index) in item.goods" :key="index">
                    <p style="text-align: center;">{{ item.bookname }} x {{ item.count }}</p>
                </div>
                </div>   
                <p style="color:#FF4500; margin-bottom: 20px;">订单金额:￥{{ item.total }}</p>
                <div class="van">
                    <van-button v-if="item.status===0" type="primary" @click="Submit(item.uid)">待确认</van-button>&nbsp;&nbsp;&nbsp;
                <van-button v-if="item.status===1" disabled type="success">已确认</van-button>
                <van-button v-if="item.status===2" disabled type="success">已揽收</van-button>
                <!-- <van-button v-if="item.status===3" disabled type="success">已收货</van-button> -->
                <van-button v-if="item.status===0" type="danger" @click="Cancel(index)">取消订单</van-button>
                </div>
                
            </li>
        </ul>
    </div>
    <div class="tip" v-if="state.show">
        <h4>确认取消该订单吗？</h4><br><br><br>
        <van-button type="primary" @click="state.show=false">取消</van-button>&nbsp;&nbsp;&nbsp;
        <van-button type="danger" @click="orderCancel()">确认</van-button>
    </div>
</template>

<script setup>
import { onMounted,reactive } from 'vue';
import {Getorder,orderOk,Cancelorder} from '../api/index'
import qs from 'qs'
import{showToast} from 'vant'

const state=reactive({
    list:[],
    ok:true,
    show:false,
    cancel:{}
})
const Submit=(data)=>{
    console.log(data)
    orderOk(qs.stringify({uid:data})).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            state.ok=false
            window.location.reload()
        }
    })
}
const Cancel=(data)=>{
    state.show=true
    // console.log(state.list[data])
    state.cancel=state.list[data]
}
//取消订单
const orderCancel=()=>{
    Cancelorder(qs.stringify(state.cancel)).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            window.location.reload()
        }
    })
}
onMounted(()=>{
    Getorder().then(res=>{
        console.log(res,'123')
        if(res.status===200){
            let len1=res.data.rs1.length
            let len2=res.data.rs2.length
            for(let i=0;i<len1;i++){
                Reflect.set(res.data.rs1[i],'goods',[])
                for(let j=0;j<len2;j++){
                    if(res.data.rs1[i].uid===res.data.rs2[j].uid){   
                        res.data.rs1[i].goods.push(res.data.rs2[j])
                    
                    }
                }
            }
            state.list=res.data.rs1;

        }

    })
})
</script>

<style  scoped>
.order{
    /* display: flex; */
    background-color: #FFE7BA;
    border-radius: 20px;
    margin:30px auto;
    text-align: center;
}
.x1{
    display: flex;
    margin-top: 20px;
}
.x1 p{
    margin-top: 20px;
}
 p{
    margin: 10px;
}
.van{
    /* float:right; */
    margin-top:20px;
    margin-right:20px;
}
.tip{
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
</style>