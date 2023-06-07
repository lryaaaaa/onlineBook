import { defineStore } from "pinia"
import { reactive } from "vue"
import {HomeList} from '../api/index'
// import user from ''

export const useHomeStore=defineStore('home',()=>{
   let state=reactive({
            hotbooks:[],
            novels:[],
            wenxue:[],
            baike:[],
            jiaofu:[],
            tongshu:[],
            jinji:[],
            chuyi:[],
            yishu:[]


    })

    const LoadHome=()=>{
        HomeList().then(res=>{
            console.log(res,'123321')
            state.hotbooks=res.data[0];
            state.novels=res.data[1];
            state.wenxue=res.data[2];
            state.baike=res.data[3];
            state.jiaofu=res.data[4];
            state.tongshu=res.data[5];
            state.jinji=res.data[6];
            state.chuyi=res.data[7];
            state.yishu=res.data[8];
        })
        
        
    }

    return {
        state,
        LoadHome
    }
})