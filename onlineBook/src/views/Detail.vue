<template>

    <div class="page">
        <!-- <Header :isShow="state.islogin" :user="state.user"  @vShow0="Show1"></Header> -->
        <div class="title"><h3>书籍详情页</h3></div>
        <div class="main">
            <img class="img" :src="data.avatar" alt="">
            <div class="shuju">
                <p class="name">{{ data.bookName }}</p>
                <p class="author"> {{ data.author }} &nbsp 著</p>
                <p class="price">售价: ￥{{ data.price }}.00</p>
                <p class="chubanshe">出版社: {{ data.press }}</p>
                <!-- <p class="kucun">库存:{{ data.amount }}</p> -->
                <p class="deal">完成{{ data.deal }} 次付款 </p>
            </div>
        </div>
        <div class="shop">
            <van-button type="danger" @click="toCart(account)">加入购物车</van-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <van-button type="success" @click="Buy(account,data)">直接购买</van-button>
        </div>
        <div class="comment">
            <div class="com-tit"><h4>图书评论</h4></div>
            <div class="pl">
            <input type="text" v-model="state.comment" placeholder="我也要发表">&nbsp;&nbsp;
            <van-button style="margin:auto 0" type="success" @click="Submit(data.bookName,account)">发表</van-button>
            </div>
            
            <div class="content">
                <!-- 放评论 -->
                <div class="comment-item" v-for="(item,index) in comment" :key="index">
                    <div class="comment-info">
                        <img src="../../public/images/svg/touxiang.svg" alt="">&nbsp;&nbsp;
                        <div class="comment-name">{{ item.username }}</div>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div class="comment-date">{{ item.date }}</div>
                    <div class="dianzan">
                        <van-button class="com-van"  @click="dianzan(item)">点赞</van-button>
                        <div class="comment-praise">{{ item.praise}}</div>
                    </div>
                     
                    
                    
                   
                </div>
                    <div class="comment-content">{{ item.content }}</div>
                    
                </div>
            </div>
        </div>
        <div class="buy" v-if="state.show">
            <h5>请使用手机支付宝</h5>
            <p>支付金额为:￥{{ data.price }}</p>
            <br>
            <br>
            <p>请选择地址</p>
            <ul v-for="(item,index) in address" :key="index">
                <li class="shoujian">
                    <input type="radio" @click="select(item)">
                    <p>收件信息{{ index+1 }}</p>
                    <p>收件人:{{ item.ad_addressee }}</p>
                    <p>电话:{{ item.ad_phone }}</p>
                    <p>地址:{{ item.ad_address }}</p>
                </li>
            </ul><br><br>
            <img class="ewm" src="../../public/images/a.png" alt=""><br><br>
            <van-button type="primary" @click="state.show=false">取消</van-button>&nbsp;&nbsp;&nbsp;
            <van-button type="success" @click="Pay">完成支付</van-button>
        </div>
    </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import {onMounted,reactive,ref,computed} from 'vue'
import { useDetailStore } from '../store/detail';
import { Addorder1,Dianzan,ADDcomment} from '../api/index'
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/use';
import { showToast } from 'vant'
import qs from 'qs'
const userStore=useUserStore()
const state=reactive({
    show:false,
    address:{},
    good:{},
    account:0,
    comment:''
})
const token=localStorage.getItem('token') || ''
const address=computed(()=>userStore.state.address)
const router=useRouter();
const detailStore=useDetailStore();
const account=computed(()=>userStore.state.user.account)
const comment=computed(()=>detailStore.state.comment)
const data=computed(()=>detailStore.state.data)
//添加购物车
const toCart=(data)=>{
    if(token!==''){
        detailStore.toCart(data)
    }
    else{
        showToast('你还没有登录，请登录在操作')
    }
    
}
//选中的地址信息
const select=(data)=>{
    state.address=data
}
//点赞
const dianzan=(data)=>{
    if(token!==''){
        Dianzan(qs.stringify({commentId:data.commentId})).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            window.location.reload()
        }
    })
    }else{
        showToast('你还没有登录，请登录在操作')
    }
    
}
//发表评论
const Submit=(data1,data2)=>{
    if(token!==''){
        let data={
        account:data2,
        bookname:data1,
        content:state.comment
    }
     ADDcomment(qs.stringify(data)).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            state.comment=''
        }
    })
    }
    else{
        showToast('你还没有登录，请登录在操作')
    }
    
   
}
//打开支付通道
const Buy=(data1,data2)=>{
    if(token!==''){
        userStore.getAddress()
    state.show=true
    state.account=data1
    // state.book=data2
    state.good=data2
    // console.log(data)
    }
    else{
        showToast('你还没有登录，请登录在操作')
    }
    
}
const Pay=()=>{//生成订单
    console.log(router.currentRoute.value.params,comment,'/////')
    let data={
        account:state.account,
        addressee:state.address.ad_addressee,
        address:state.address.ad_address,
        phone:state.address.ad_phone,
        total:state.good.price,
        count:1,
        good:state.good
    }
    console.log(data)
    Addorder1(qs.stringify(data)).then(res=>{
        if(res.status===200){
            showToast(res.msg)
            alert('订单支付成功，请前往订单页确认认订单信息!')
            window.location.reload();
        }
    })
}
onMounted(()=>{
    detailStore.LoadDetail(router.currentRoute.value.params);
    
})
</script>

<style  scoped>
.content{
    border-radius: 20px;
    margin:auto 20px;
}
.title{
    text-align: center;
}
.com-tit{
    
    margin: 30px 0;
    margin-left: 50px;
}
.comment-item{
    padding-bottom: 5px;
    background-color: #F5F5DC;
    
}
.img{
    width:270px;
    height: 300px;
    margin: 30px 20px;

}
.main{
    display: flex;
}
.dianzan{
    position: relative;

}
.shop{
    text-align: center;
}
p{
    margin-left:20px;
}
.comment-info{
    text-align: center;
    display: flex;
    /* justify-self: center; */
}
.comment-praise{
    background-color: red;
    position: absolute;
    font-size: 17px;
    right: 35px;
    top: 1px;
    color: white;
    min-height: 24px;
    min-height: 24px;
    line-height: 24px;
    text-align: center;
    -webkit-border-radius: 24px;
    border-radius: 24px;		
    padding:2px;
}
.buy{
    text-align: center;
    top:50%;
    left:50%;
    position:fixed;
    z-index:100;
    margin-top: -300px;
    margin-left: -150px;
    background-color: #dcdcdc;
    padding: 20px;
}
.comment-date{
    flex:1
}
.ewm{
    width:200px;
    margin: 0 30px;
}
.comment-name,.comment-date{
    margin:auto 0;
}
.shoujian{
    display: flex;
}
.comment-content{
    margin: 12px 20px;
}
.com-van{
    border-radius: 20px;
    height: 30px;
    margin-top: 10px;
    margin-right: 30px;
}
.pl{
    margin: 30px;
}
.pl input{
    height:40px;
    width:600px
}
</style>