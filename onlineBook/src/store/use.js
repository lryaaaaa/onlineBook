import { defineStore } from "pinia"
import { reactive } from "vue"
import{ADDress} from '../api/index'
export const useUserStore=defineStore('user',()=>{
    let state=reactive({
        user:{

        },
        address:[]
    })
    const getUser=(data)=>{
        console.log(data,'lllll')
        state.user=data
    }
    const getAddress=()=>{
        ADDress().then(res=>{
            console.log(res,'111')
            state.address=res.data
        })
    }
    return {
        state,
        getUser,
        getAddress
    }
})