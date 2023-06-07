const express = require('express')
const router = express.Router()
const conn = require('../js/conn')
// import { nanoid } from 'nanoid'
const { nanoid } = require('nanoid')
// import { encrypt,decrypt  } from "../js/encrypt";
const { encrypt,decrypt  } = require("../js/encrypt.js");
const jwt=require('jsonwebtoken')

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false}))




//获取用户信息
router.get('/home',(req,res)=>{
	let token=req.headers.authorization
	if(token){
		jwt.verify(token,'twgdhbtzky',(err,rs)=>{
			if (err) {
				if(err.name=='TokenExpiredError'){
					//token 过期
					res.json({
						msg:'登录以过期，请重新登录',
						status:400,
					})
				}else if(err.name='JsonWebTokenError'){
					//无效token
					res.json({
						msg:'登录错误，请重试',
						status:401
					})
				}
			}

			if(rs){
				conn.query(`select * from user where account='${rs.name}'`,(err,rs)=>{
					if (err) throw err;
					res.json({
						msg:'获取用户信息成功',
						status:200,
						data:rs[0]
					})
				})
			}
		})
	}
	else{
		res.json({
		msg:'未登录',
		status:0
	})
	}
	
})
//图书详情
router.post('/bookdetail',(req,res)=>{
	let data=req.body
	if(data.id){
		conn.query(`select * from books where bookName='${data.id}'`,(err,rs)=>{
			if(err) throw err;
			if(rs){
				// console.log(rs,'123')
				rs[0].avatar='http://localhost:8080/images/'+rs[0].avatar+'.jpg'
				res.json({
					msg:'请求成功',
					status:200,
					data:rs[0]
				})
			}
		})
	}
})

//用户登录接口
router.post('/userlogin',(req,res)=>{
	let data=req.body
	//验证
	if(data.account && data.pwd){
		let userpwd=encrypt(data.pwd)
		console.log(userpwd,'123')
		conn.query(`select * from user where account='${data.account}' and password='${userpwd}'`,(err,rs)=>{
			console.log(rs,'1233')
			if(err) throw err;
			if(rs.length=0){
				res.json({
					msg:'用户名或密码错误',
					status:400
				})
			}
			else{
				//验证成功 返回token
				const token=jwt.sign({id:1,name:data.account},'twgdhbtzky',{expiresIn:60*60*24*10})
				res.json({
					msg:'登录成功',
					status:200,
					data:{
						token:token
					}
				})
			}
		})
	}else{
		res.json({
			msg:'请输入用户名和密码',
			status:0
		})
	}
})
// 用户注册接口
router.post('/userregister', (req, res) => {
    let data = req.body;
    console.log("注册接收的数据",data);
  
    if (!data) {
      res.json({
        msg: '没有提交数据！',
        status: 0
      })
      return false;
    }
    // 用户名非空校验
    if (!data.name) {
      res.json({
        msg: 'user不能为空',
        status: 0
      })
      return false;
    }

    if (!data.pwd) {
      res.json({
        msg: '密码不能为空',
        status: 0
      })
      return false;
    }
    // 加密密码
    let userPwd = encrypt(data.pwd)
	let account=Math.round(Math.random()*100000000)
    // 手机号格式验证
    // const regexp = /^(\+\d{2,3}-)?\d{11}$/;
    // if (!regexp.test(data.phone)) {
    //   res.json({
    //     msg: '手机号格式错误',
    //     status: 0
    //   })
    //   return false;
    // }
    conn.query(`select * from user where account='${account}'`, (err, rs) => {
      if (err) throw err;
      // 注册前先校验该账号是否已经注册过
      if (rs.length > 0) {
		let account1=Math.round(Math.random()*100000000)
		conn.query(`select * from user where account='${account}'`,(err,rs)=>{
			if (err) throw err;
			conn.query(`insert into user values(0,'${data.name}','${userPwd}','${account1}',sysdate(),0)`,(err,rs)=>{
				//注册成功后自动登录
				const token=jwt.sign({id:1,name:account1},'twgdhbtzky',{expiresIn:60*60*24*10})
				res.json({
					msg:'注册成功',
					status:200,
					data:{
						account:account1,
						token:token
					}
				})
			})
		})
        // res.json({
        //   msg: '该user已经注册过！',
        //   status: 0
        // })
        console.log("注册：",rs)
      } else {
        conn.query(`insert into user values(0,'${data.name}','${userPwd}','${account}',sysdate(),0)`, (err, rs) => {
          if (err) throw err;
		  const token=jwt.sign({id:1,name:account},'twgdhbtzky',{expiresIn:60*60*24*10})
          res.json({
            msg: '注册成功',
            status: 200,
			data:{
				account:account,
				token:token
			}
          })
        })
      }
    })
  })
//首页加载部分数据
router.get('/homelist',(req,res)=>{
	let data=[];
	conn.query(`select * from books order by deal desc limit 6`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let data0=rs
			data.push(data0)
			conn.query(`select * from books where cate='小说'`,(err,rs)=>{
			if(err) throw err;
			if(rs){
				for(let i=0;i<rs.length;i++){
					rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
				  }
				let  data1=[rs[0],rs[1],rs[2]]
				data.push(data1)
				conn.query(`select * from books where cate='文学'`,(err,rs)=>{
				if(err) throw err;
				if(rs){
					for(let i=0;i<rs.length;i++){
						rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
					  }
					let  data2=[rs[0],rs[1],rs[2]]
					data.push(data2)
					conn.query(`select * from books where cate='百科'`,(err,rs)=>{
					if(err) throw err;
					if(rs){
						for(let i=0;i<rs.length;i++){
							rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
						  }
						let  data3=[rs[0],rs[1],rs[2]]
						data.push(data3)
						conn.query(`select * from books where cate='教辅'`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let  data4=[rs[0],rs[1],rs[2]]
			data.push(data4)
			conn.query(`select * from books where cate='童书'`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let  data5=[rs[0],rs[1],rs[2]]
			data.push(data5)
			conn.query(`select * from books where cate='经济'`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let  data6=[rs[0],rs[1],rs[2]]
			data.push(data6)
			conn.query(`select * from books where cate='厨艺'`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let  data7=[rs[0],rs[1],rs[2]]
			data.push(data7)
			conn.query(`select * from books where cate='艺术'`,(err,rs)=>{
		if(err) throw err;
		if(rs){
			for(let i=0;i<rs.length;i++){
				rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
			  }
			let  data8=[rs[0],rs[1],rs[2]]
			data.push(data8)
			// console.log(data,'3222')
			res.json({
				msg:'首页图书加载成功',
				status:200,
				data:data
			})
		}
	})
		}
	})
		}
	})
		}
	})
		}
	})
		}
	})
		}
	})
		}
	})
		}
	})
	
	
	
	
	
	
	
	

	
})

//获取图书列表 分类页
router.post('/bookslist',(req,res)=>{
	let data=req.body;
	if(data.cate==='热销'){
		conn.query(`select * from books order by deal desc limit 10`,(err,rs)=>{
			if(err) throw err;
			if(rs){
				for(let i=0;i<rs.length;i++){
					rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
				  }
				res.json({
					msg:'获取列表成功',
					status:200,
					data:rs
				})
			}
		})
	}
	else{
		conn.query(`select * from books where cate='${data.cate}'`,(err,rs)=>{
			if(err) throw err;
			if(rs){
				for(let i=0;i<rs.length;i++){
					rs[i].avatar='http://localhost:8080/images/'+rs[i].avatar+'.jpg'
				  }
				res.json({
					msg:'加载成功',
					status:200,
					data:rs
				})
			}
		})
	}
})
//修改用户信息
router.post('/fixeduser',(req,res)=>{
	let data=req.body;
	let token=req.headers.authorization;
	console.log(data,token,'.....')
	jwt.verify(token,'twgdhbtzky',(err,rs)=>{
		if(data.name){
			conn.query(`update user set name='${data.name}' where account='${rs.name}'`)
			res.send({
				msg:'修改成功',
				status:200

			})
		}
		if(data.pwd){
			let userpwd=encrypt(data.pwd);
			conn.query(`select password from user where account='${rs.name}'`,(err,rs)=>{
				if(err) throw err;
				if(rs[0].password===userpwd){
					res.json({
						msg:'密码正确',
						status:200
					})

				}
				else{
					res.json({
						msg:'密码错误',
						status:0
					})
				}
			})
		}
		if(data.pwd2){
			let userpwd=encrypt(data.pwd2);
			conn.query(`update user set password='${userpwd}' where account='${rs.name}'`)
			res.send({
				msg:'修改成功',
				status:200
			})
		}
		else{
			// throw err
		}
	})

})
//获取订单列表
router.get('/getorder',(req,res)=>{
	let token=req.headers.authorization;
	
	jwt.verify(token,'twgdhbtzky',(err,rs)=>{
		if(rs.name){
			conn.query(`select * from orders where account='${rs.name}'`,(err,rs1)=>{ 
				if(rs1.length>0){
					conn.query(`select * from orderdetails where account='${rs.name}}'`,(err,rs2)=>{
						if(err) throw err;
						if(rs2){
						res.json({
								msg:'订单列表请求成功',
								status:200,
								data:{
									rs1:rs1,
									rs2:rs2
								}
						})
						}
					})
						
				}
			})
		}
	})
})
//获取订单信息
//取消订单
router.post('/cancelorder',(req,res)=>{
	let data=req.body;
	//库存加回 订单status 3  订单详情删除 用户购买-1
	// console.log(data,'123')
	conn.query(`update user set buys=buys-1 where account='${data.account}'`)
	conn.query(`update orders set status=3 where uid='${data.uid}'`)
	conn.query(`delete from orderdetails where uid='${data.uid}'`)
	for(let i=0;i<data.goods.length;i++){
		conn.query(`update books set count=count+'${data.goods[i].count}',deal=deal-1 where bookName='${data.goods[i].bookname}'`)
	}
	res.send({
		msg:'订单取消成功,请留意退款信息',
		status:200
	})
})
//添加订单 用户购物车购买 
router.post('/addorder',(req,res)=>{
	let data=req.body;
	console.log(data,'123')
	let uid=nanoid()
	//orders表天添加一条数据
	conn.query(`insert into orders values(0,'${uid}','${data.account}','${data.addressee}','${data.address}','${data.phone}','${data.total}','${data.count}',0)`)
	//用户表中的购买次数+1
	conn.query(` update user set buys=buys+1 where account='${data.account}'`)
	for(let i=0;i<data.goods.length;i++){
		//订单详情放入orderdetails
		conn.query(`insert into orderdetails values(0,'${data.account}','${uid}','${data.goods[i].cart_bookname}','${data.goods[i].cart_count}',0)`)
		//生成订单后把购物车的数据删除
		conn.query(`delete from cart where cart_account='${data.goods[i].cart_account}' and cart_bookname='${data.goods[i].cart_bookname}'`)
		//库存减去相应数量
		conn.query(`update books set amount=amount-'${data.goods[i].cart_count}', deal=deal+1 where bookName='${data.goods[i].cart_bookname}'`)
	}
	// amount=amount-'${data.goods[i].cart_count}'
	res.send({
		status:200,
		msg:'购买成功'
	})
})
//用户直接购买
router.post('/addorder1',(req,res)=>{
	let data=req.body
	let uid=nanoid();
	console.log(data)
	//订单
	conn.query(`insert into orders values(0,'${uid}','${data.account}','${data.addressee}','${data.address}','${data.phone}','${data.total}','${data.count}',0)`)
	//用户buys +1
	conn.query(` update user set buys=buys+1 where account='${data.account}'`)
	//订单详情
	conn.query(`insert into orderdetails values(0,'${data.account}','${uid}','${data.good.bookName}','${data.count}',0)`)
	//库存-1 deal+1
	conn.query(`update books set amount=amount-1, deal=deal+1 where bookName='${data.good.bookName}'`)
	res.send({
		status:200,
		msg:'交易成功'
	})
})
//用户确认订单
router.post('/orderok',(req,res)=>{
	let data=req.body;
	conn.query(`update orders set status=1 where uid='${data.uid}'`)
	conn.query(`update orderdetails set status=1 where uid='${data.uid}'`)
	res.send({
		msg:'确认成功',
		status:200
	})

})
//获取地址
router.get('/address',(req,res)=>{
	let token=req.headers.authorization
	jwt.verify(token,'twgdhbtzky',(err,rs)=>{
		console.log(rs,'33333')
		conn.query(`select * from address where ad_user='${rs.name}'`,(err,rs)=>{
			if(err)throw err;
			else{
				res.json({
					msg:'加载地址成功',
					status:200,
					data:rs
			})
			}
			
		})
	})
})
//添加地址
router.post('/addaddress',(req,res)=>{
	let data=req.body
	console.log(data.account,'asd')
	let uid=nanoid()
	conn.query(`insert into address values ('${uid}','${data.account}','${data.phone}','${data.address}','${data.name}')`)
	res.send({
		msg:'添加成功',
		status:200
	})
	
})
//删除地址
router.post('/deleteress',(req,res)=>{
	let data=req.body
	console.log(data,'/////')
	conn.query(`delete from address where adid='${data.uid}'`)
	res.send({
		msg:'删除成功',
		status:200
	})
})

//添加购物车
router.post('/addcart',(req,res)=>{
	let data=req.body;
	conn.query(`select * from cart where( cart_account='${data.account}' and cart_bookname='${data.bookname}')`,(err,rs)=>{
		if(err) throw err;
		if(rs.length===1){
			//该用户已添加过该书，数量加一即可
			conn.query(`update cart set cart_count=cart_count+1 where cart_account='${data.account}' and cart_bookname='${data.bookname}' `)
			res.send({
				msg:'添加成功',
				status:200
			})
		}
		if(rs.length===0){
			//添加一本新书
			conn.query(`insert into cart values(0,'${data.account}','${data.bookname}','${data.price}','${data.avatar}',1)`)
			res.send({
				msg:'添加成功',
				status:200
			})
		}
	})
	

})
//获取购物车数据
router.get('/cart',(req,res)=>{
	let token=req.headers.authorization
	jwt.verify(token,'twgdhbtzky',(err,rs)=>{
		if(err) throw err;
		if(rs){
			conn.query(`select * from cart where cart_account='${rs.name}'`,(err,rs)=>{
				if(err) throw err;
				if(rs){
					res.json({
						msg:'购物车获取成功',
						status:200,
						data:rs
					})
				}
			})
		}
	})
})
//删除购物车数据
router.post('/deletecart',(req,res)=>{
	let data=req.body;
	console.log(data)
	conn.query(`delete from cart where cart_account='${data.account}' and cart_bookname='${data.name}'`)
	res.send({
		msg:'删除成功',
		status:200
	})
})
//用户添加评论
router.post('/addcomment1',(req,res)=>{
	let data=req.body;
	console.log(data)
	let commentId=nanoid()
	conn.query(`insert into comment values('${commentId}','${data.account}','${data.bookname}',sysdate(),'${data.content}',0,1)`)
	res.send({
		msg:'评论添加成功',
		status:200
	})

})
module.exports = router
