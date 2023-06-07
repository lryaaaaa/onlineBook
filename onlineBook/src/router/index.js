import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            redirect: '/home'
        },
        {
            path:'/home',
            name:'home',
            component:Home
        },{
            path:'/detail/:id',
            name:'detail',
            component:import('../views/Detail.vue')
        },
        {
            path:'/user',
            name:'user',
            component:import('../views/User.vue')
        },
        {
            path:'/order',
            name:'order',
            component:import('../views/Order.vue')
        },
        {
            path:'/cart',
            name:'cart',
            component:import('../views/Cart.vue')
        },
        {
            path:'/list/:cate',
            name:'list',
            component:import('../views/List.vue')
        },
        ,
        {
            path:'/search/:name',
            name:'search',
            component:import('../views/Search.vue')
        }
        // {
        //     path:'/signin',
        //     name:'signin',
        //     component:import('../views/Signin.vue')
        // },
    ]
})

export default router