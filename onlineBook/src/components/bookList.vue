<template>
    <div class="item">
        <img :src="book.avatar" alt="">
            <div class="name">{{ book.bookName }}</div>
            <div class="price">￥{{ book.price}}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props=defineProps({
    book:{
        type:Object
    }
})
</script>

<style scoped>
.item{
    width :25%;
    background-color: #FFFACD;
    height: 200px;
    margin: 20px;
    text-align: center;
}
img{
    text-align: center;
    width: 60%;
    height: 130px;
    margin: 0 20px;
}
.name,.price{
    margin: 10px 0;
    text-align: center;
    color: #999;
}
</style>