import { defineStore } from "pinia"
import { reactive } from "vue"
import{commit,bookDetail,addCart} from '../api/index'
import qs from 'qs'
import router from "../router"
import { showToast } from 'vant'
export const useDetailStore=defineStore('detail',()=>{
    let state=reactive({
        data:{

        },
        comment:[]
    })
    const LoadDetail=(data)=>{
        console.log(data,'3333')
       bookDetail(qs.stringify(data)).then(res=>{
        // console.log(res,'0000')
        state.data=res.data
        })
        commit(qs.stringify(data)).then(res=>{
                console.log(res,'///')
                state.comment=res.data
            })
    }
    const ASD=(data)=>{
        router.push({
            path:`/detail/${data.bookName}`
        })
        
        
    }
    const toCart=(data)=>{
        let dataObj={
            account:data,
            price:state.data.price,
            bookname:state.data.bookName,
            avatar:state.data.avatar
        }
        addCart(qs.stringify(dataObj)).then(res=>{
            console.log(res,'pppp')
            if(res.status===200){
                showToast(res.msg)
            }
        })

    }
    return{
        state,
        ASD,
        LoadDetail,
        toCart

    }
})