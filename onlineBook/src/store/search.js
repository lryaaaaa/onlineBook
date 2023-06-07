import { defineStore } from "pinia"
import { reactive } from "vue"
import {Searchbook} from '../api/index'
import qs from 'qs'
import router from "../router"
export const useSearchStore=defineStore('search',()=>{
    let state=reactive({
        list:[]
    })
    const Search=(searchval)=>{
        // state.list=[]
        router.push({
            path:`/search/${searchval}`
        })
        // console.log(searchval,'123')
        // if(searchval){
        //     Searchbook(qs.stringify({name:searchval})).then(res=>{
        //         console.log(res.data)
        //         state.list=res.data
        //     })
        // }
        
    }
    const LoadSearch=(data)=>{
            // console.log(data,'123')
            Searchbook(qs.stringify(data)).then(res=>{
                       
                        state.list=res.data
                         console.log(state.list)
                    })
        }
    return {
        state,
        Search,
        LoadSearch
    }
})