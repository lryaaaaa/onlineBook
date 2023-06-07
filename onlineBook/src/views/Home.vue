<template>
   
    <div class="page">
        
        <div class="main">
        
        <!-- <div style="height: 3000px;"></div> -->
            <p  class="title">---热销榜-------</p>
            <div class="hotsell">
            <!-- 热销榜单 -->
            
            <bookList v-for="(item,index) in hotbooks" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
             <p  class="title">---小说------</p>
            <div class="novel">
           
            <bookList v-for="(item,index) in novels" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---文学------</p>
            <div class="wenxue">
           
            <bookList v-for="(item,index) in wenxue" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---百科------</p>
            <div class="baike">
           
            <bookList v-for="(item,index) in baike" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---经济------</p>
            <div class="jinji">
           
            <bookList v-for="(item,index) in jinji" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---艺术------</p>
            <div class="yishu">
           
            <bookList v-for="(item,index) in yishu" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---厨艺------</p>
            <div class="chuyi">
           
            <bookList v-for="(item,index) in chuyi" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---童书------</p>
            <div class="tongshu">
           
            <bookList v-for="(item,index) in tongshu" :key="index" :book="item" @click="detailStore.ASD(item)"  />
            </div>
            <p class="title">---教辅------</p>
            <div class="jiaofu">
           
            <bookList v-for="(item,index) in jiaofu" :key="index" :book="item" @click="detailStore.ASD(item.bookName)"  />
            </div>
            <van-back-top />
    </div>
    </div>
    
</template>

<script setup>

import bookList from '../components/bookList.vue'
import {reactive,onMounted,ref,computed} from 'vue'
import {useRouter} from 'vue-router'
import {useHomeStore} from '../store/home'
import {useDetailStore} from '../store/detail'
import {useListStore} from '../store/list'
const router=useRouter()
const store=useHomeStore()
const detailStore=useDetailStore();
const listStore=useListStore()
// const abut=ref('false')
const state=reactive({
    
})


const hotbooks=computed(()=>store.state.hotbooks)
const novels=computed(()=>store.state.novels)
const wenxue=computed(()=>store.state.wenxue)
const baike=computed(()=>store.state.baike)
const jinji=computed(()=>store.state.jinji)
const yishu=computed(()=>store.state.yishu)
const chuyi=computed(()=>store.state.chuyi)
const tongshu=computed(()=>store.state.tongshu)
const jiaofu=computed(()=>store.state.jiaofu)
onMounted(()=>{
    store.LoadHome()
    
})


</script>

<style  scoped>
.header{
    width: 800px;
    /* background-color: #ffbb98; */
    height: 300px;
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
.shoye,.gouwuche,.tuichu{
    margin: auto 10px;
}
.input{
    width:100px
}
.hotsell,.novel,.tongshu,.jiaofu,.wenxue,.chuyi,.yishu,.baike,.jinji{
    /* width:30% */
    display: flex;
    flex-wrap: wrap;
    background-color: #FFFACD;
}
.search{
    height: 50px;
    margin: auto 0;
}
.page{
    width:100%;
    display :flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background-color: #fff;
}
.title{
    margin-left:30px;
    font-size: 20px;
}
.main{
    width:800px;
    /* background-color:#94a7ae; */
    margin: 0 auto;
    justify-content:space-between;
    overflow: hidden;
    overflow-y: scroll;
}

.cancel{
    margin-left: 20px;
}
.toux{
    width :50px;
}
</style>