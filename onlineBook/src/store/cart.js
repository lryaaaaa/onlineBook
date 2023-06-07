import {CartList} from '../api/index'
import { defineStore } from "pinia"
import { reactive } from "vue"
import {deleteCart} from '../api/index'
import qs from 'qs'
import { showToast } from 'vant'
export const useCartStore=defineStore('cart',()=>{
    let state=reactive({
        list:[]
    })
    // const getList=()=>{
    //     CartList().then(res=>{
           
    //         if(res.status===200){
    //             for(let i=0;i<res.data.length;i++){
    //                 Reflect.set(res.data[i],'total',res.data[i].cart_count*res.data[i].cart_price)
    //             }
    //             console.log(res.data,'./....')
    //             state.list=res.data
    //         }
    //     })
    // }
    // const deletelist=(data1,data2)=>{
    //    let data={
    //     name:data1,
    //     account:data2
    //    }
    //    console.log(data,'/////')
    // //    deleteCart(qs.stringify(data)).then(res=>{
        
    // //     if(res.status===200){
    // //         showToast(res.msg)
    // //         window.location.reload()
    // //     }
    // //    })
    // }
    return {
        state,
        getList,
        deletelist
    }
})