import requests from "./config";
//所有接口都在这里


//注册接口
export const Signup=(dataObj)=>requests({
    url:'/userregister',
    method:'post',
    data:dataObj
})
//获取登录信息
export const GetInfo=()=>requests({
    url:'/home',
    method:'get'
})
//登录接口
export const Signin=(dataObj)=>requests({
    url:'/userlogin',
    method:'post',
    data:dataObj
})
//搜索图书
export const Searchbook=(data)=>requests({
    url:'/searchbook',
    method:'post',
    data:data
})
//加载图书列表 分类页
export const booksList=(data)=>requests({
    url:'/bookslist',
    method:'post',
    data:data
})

//首页加载图书
export const HomeList=()=>requests({
    url:'/homelist',
    method:'get'
})
//加载图书详情
export const bookDetail=(data)=>requests({
    url:'/bookdetail',
    method:'post',
    data:data
})
//加载评论区 传书名
export const commit=(data)=>requests({
    url:'/bookamount',
    method:'post',
    data:data
})
//添加评论
export const ADDcomment=(data)=>requests({
    url:'/addcomment1',
    method:'post',
    data:data
})
//修改用户昵称、密码
export const Fixed=(data)=>requests({
    url:'/fixeduser',
    method:'post',
    data:data
})
//获取地址列表
export const ADDress=()=>requests({
    url:'/address',
    method:'get'
})
//添加地址
export const addAddress=(data)=>requests({
    url:'/addaddress',
    method:'post',
    data:data
})
//删除地址
export const Delete=(data)=>requests({
    url:'/deleteress',
    method:'post',
    data:data
})

//添加购物车
export const addCart=(data)=>requests({
    url:'/addcart',
    method:'post',
    data:data
})
//获取购物车
export const CartList=()=>requests({
    url:'/cart',
    method:'get'
})
//删除购物车上的某一项
export const deleteCart=(data)=>requests({
    url:'/deletecart',
    method:'post',
    data:data

})
//取消订单
export const Cancelorder=(data)=>requests({
    url:'/cancelorder',
    method:'post',
    data:data
})
//添加订单 购物车
export const ADDorder=(data)=>requests({
    url:'/addorder',
    method:'post',
    data:data
})
//直接购买
export const Addorder1=(data)=>requests({
    url:'/addorder1',
    method:'post',
    data:data
})
//获取订单列表
export const Getorder=()=>requests({
    url:'/getorder',
    method:'get'
})
//用户确认订单
export const orderOk=(data)=>requests({
    url:'/orderok',
    method:'post',
    data:data
})
//点赞接口
export const Dianzan=(data)=>requests({
    url:'/addpraise',
    method:'post',
    data:data
})