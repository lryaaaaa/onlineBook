import { defineStore } from "pinia"
import { reactive } from "vue"
import {booksList,Searchbook} from '../api/index'
import qs from 'qs'
import router from "../router"
export const useListStore=defineStore('list',()=>{
    let state=reactive({
       list:[]
    })
    // const toList=(data)=>{
    //     state.data=data;
    // }
    // const loadComment=(data.bookName)=>{
    //     commit(qs.stringify({name:data.bookName}))
    // }
    const toList=(data)=>{
        router.push({
            path:`/list/${data}`
        })
        // console.log(window.open(`http://localhost:8083/#/list/${data}`),'3333') //打开新页面

        // window.location.reload()
        // let data0={
        //     name:data
        // }
        // console.log(data0)
        // booksList(qs.stringify(data0)).then(res=>{
        //     console.log(res,'///')
        //     state.list=res.data
        // })
    }
    const LoadList=(data)=>{
        booksList(qs.stringify(data)).then(res=>{
            state.list=res.data
            // console.log(res,data,'././')
        })
    }
    const Search=(searchval)=>{
        state.list=[]
        router.push({
            path:`/list/${searchval}`
        })
        // console.log(searchval,'123')
        if(searchval){
            Searchbook(qs.stringify({name:searchval})).then(res=>{
                console.log(res.data)
                state.list=res.data
            })
        }
    }

    return{
        state,
        toList,
        Search,
        LoadList
    }
})