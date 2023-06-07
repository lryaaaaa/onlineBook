const express = require('express')
const fs=require('fs')
const router = express.Router()
const conn = require('../js/conn')
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
const nodemailer = require("nodemailer");
const { nanoid } = require('nanoid')
const { encrypt,decrypt  } = require("../js/encrypt.js");

//添加管理员账号
router.post('/register',(req,res)=>{
	let data=req.body
	console.log(data,'123')
	if(!data.name){
		res.json({
			msg:'用户名不能为空',
			status:0
		})
	}
	if(!data.password){
		res.json({
			msg:'密码不能为空',
			status:0
		})
	}
	else{
		conn.query(`select * from admin where id='${data.name}'`,(err,rs)=>{
			let dt=rs || []				
			if(dt.length==0){
				conn.query(`insert into admin values('${data.name}','${data.password}')`)
				res.send({
					msg:'添加成功',
					status:200
				})
			}else{
				res.json({
					msg:'该账号已被使用',
					status:0
				})
			}
		})
	}
})
// 添加评论 管理员
router.post('/addcomment', (req, res) => {
	let data = req.body;
	 data.readName=data.readName+'(书店管理员)';
	let commentId = nanoid();//随机生成一个唯一值
	conn.query(`insert into comment values('${commentId}','${data.readName}','${data.bookName}',sysdate(),'${data.content}',0,1)`)
	res.send({
	  msg: '评论成功！',
	  status: 200
	})
  })
//删除评论
router.post('/auditcomment',(req,res)=>{
	let data=req.body;
	conn.query(`update comment set status=0 where commentId='${data.commentId}'`)
	res.send({
		msg:'评论删除成功',
		status:200
	})
})


// 人员管理
// 管理员获取人员信息
// router.post('/initreaderlist', (req, res) => {
// 	conn.query(`select * from orders where status=1`, (err, rs) => {
// 		let data = rs || []
// 		if (data.length == 0)
// 			res.json({
// 				msg: '管理员请求人员记录为空',
// 				status: 0,
// 			})
// 		else
// 			res.json({
// 				msg: '管理员请求人员记录成功',
// 				status: 200,
// 				data: data
// 			})

// 	})
// })
//管理员修改订单信息
router.post('/modifyorder',(req,res)=>{
	let data=req.body
	switch(data.cate){
		case '1':{
			conn.query(`update orders set addressee='${data.val}' where uid='${data.uid}'`)
			res.send({
				status: 200,
				msg: '修改收件人成功！'
			})
			break;
		}
		case '2' :{
			conn.query(`update orders set phone='${data.val}' where uid='${data.uid}'`)
			res.send({
				status: 200,
				msg: '修改电话成功！'
			})
			break
		}
		case '3' :{
			conn.query(`update orders set address='${data.val}' where uid='${data.uid}'`)
			res.send({
				status: 200,
				msg: '修改地址成功！'
			})
			break
		}
		default :break;
	}
})
// 管理员提交订单
router.post('/submitorder', (req, res) => {
	let data = req.body;
	console.log(data,'123')
	conn.query(`update orders set status=2 where uid='${data.uid}'`)
	res.send({
		msg: '订单提交成功！',
		status: 200
	})
})

//订单列表 管理员
router.get('/orderlist',(req,res)=>{
	conn.query(`select * from orders where status=1`,(err,rs)=>{
		let data=rs || []
		// console.log(rs,'123')
		if(data.length>0){
			conn.query(`select * from orderdetails where status=1`,(err,rs1)=>{
				if(err) throw err;
				if(rs1){
					res.json({
				msg:'订单列表请求成功',
				status:200,
				data:{
					rs1:data,
					rs2:rs1
				}
			})
				}
			})
			
		}else{
			res.json({
				status:0,
				msg:'暂无需提交的订单'
			})
		}
	})
})
// 图书管理
// 管理员添加图书
router.post('/adminaddbooks', (req, res) => {

	let data = req.body

	conn.query(`select * from books where bookName='${data.bookName}'`,(err,rs)=>{
		if(rs.length===1){
			res.json({
				msg:'添加失败，该书已入库！',
				status:0
			})
		}else{
			let base64Data=data.url.replace(/^data:image\/\w+;base64,/,"")
			let dataBuffer=new Buffer(base64Data,'base64')
			let imgName=Number(Math.random().toString().substring(3)).toString(36)+Date.now()
			let upload= new Promise((resolve,reject)=>{
				fs.writeFile('./public/images/'+imgName+'.jpg',dataBuffer,err=>{
					//如果上传过程中出现问题
					if(err){
						res.json={
							msg:'图片上传失败',
							status:500
						}
						reject(false)
					}
					resolve(true)
				})
				
			})
			if(upload){
				conn.query(`insert into books values('${nanoid()}','${data.bookName}','${imgName}','${data.cate}','${data.author}','${data.amount}','${data.price}','${data.press}',0)`)
				res.send({
					msg:'书籍上架成功',
					status:200,

				})
			}
		}
	})
})
// 管理员修改图书信息
router.post('/changebookinfo', (req, res) => {
	let data = req.body
	let status = data.status
	switch (status) {
		case '1': {
			// 修改书名
			conn.query(`update books set bookName='${data.value}' where bookId='${data.bookId}'`)
			res.send({
				status: 200,
				msg: '修改书名成功！'
			})
			break;
		}
		case '2': {
			// 修改作者
			conn.query(`update books set author='${data.value}' where bookId='${data.bookId}'`)
			res.send({
				status: 200,
				msg: '修改作者成功！'
			})
			break;
		}
		case '3': {
			// 修改fenlei
			conn.query(`update books set cate='${data.value}' where bookId='${data.bookId}'`)
			res.send({
				status:200,
				msg:'分类修改成功'
			})
			break;
		}
		case '4': {
			// 修改当前库存
			conn.query(`update books set amount='${data.value}' where bookId='${data.bookId}'`)
			// 修改总库存
			// conn.query(`update book set totalAmount=totalAmount + '${data.difference}' where bookId='${data.bookId}'`)
			res.send({
				status: 200,
				msg: '修改当前库存成功！'
			})
			break;
		}
		case '5':{
			conn.query(`update books set press='${data.value}' where bookId='${data.bookId}'`)
			res.send({
				status:200,
				msg:'修改出版社成功'
			})
			break;
		}
		case '6':{
			conn.query(`update books set price='${data.value}' where bookId='${data.bookId}'`)
			res.send({
				status:200,
				msg:'修改价格成功'
			})
			break;
		}
		default: break;
	}
})
// 管理删除图书
router.post('/delbook', (req, res) => {
	let data = req.body
	// console.log(data,'123')
	// conn.query(`update books set status=0 where bookId='${data.bookId}'`)
	conn.query(`delete from books where bookId='${data.bookId}'`)
	res.send({
		msg: '删除图书成功',
		status: 200
	})
})
//搜索用户信息
router.post('/searchuser',(req,res)=>{
	let data=req.body;
	conn.query(`select * from user where account='${data.account}'`,(err,rs)=>{
		if(err) throw err;
		if(rs.length>0){
			res.json({
				msg:'用户信息查询成功',
				status:200,
				data:rs
			})
			
		}
		else{
			res.json({
				msg:'查无此人',
				status:400
			})
		}
	})
})

module.exports = router