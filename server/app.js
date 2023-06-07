const express = require('express')
const app = express();
const conn = require('./js/conn')
const fs=require('fs')
const { encrypt, decrypt } = require("./js/encrypt.js");
const { nanoid } = require('nanoid')
const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: false }))
const admin = require('./order/admin.js')
const user = require('./order/user.js')
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));
app.use(admin)
app.use(user)
app.use(express.static('public')); //静态资源库 图片等

// app.use(express.json({limit: '10mb'}))
// 公共接口
// 登录接口
app.post('/login', (req, res) => {
  let data = req.body;
  // data = JSON.stringify(data)
  // data = JSON.parse(data)
  console.log("登录接收的数据", data);

  // 判断接收数据是否为空
  if (!data) {
    res.json({
      msg: '没有提交数据！',
      status: 0
    })
    return false;
  }
  // 管理员/学生验证
  // 电话号码非空校验
  if (!data.phone) {
    res.json({
      msg: '账号不能为空',
      status: 0
    })
    return false;
  }
  // 密码非空校验
  if (!data.password) {
    res.json({
      msg: '密码不能为空',
      status: 0
    })
    return false;
  }
  // 管理员：
  if (data.isAdmin == 'admin') {
    conn.query(`select * from admin where id = '${data.phone}' and password='${data.password}'`, (err, rs) => {
      // console.log(rs,'/////')
      if (err) throw err;
      // console.log("管理员信息：",rs);
      if (rs.length > 0) {
        res.json({
          msg: '管理员登录成功',
          status: 200,
          userName: data.phone,
          isAdmin: true
        })
      } else {
        res.json({
          msg: '管理员账号或密码错误！',
          status: 0
        })
      }
    })
  } else {

    // 电话号码格式验证
    // const regexp = /^(\+\d{2,3}-)?\d{11}$/;
    // if (!regexp.test(data.phone)) {
    //   res.json({
    //     msg: '请输入正确的手机号',
    //     status: 0
    //   })
    //   return false;
    // }
    // 加密密码
    // let userLoginPwd = encrypt(data.password)
    // 检测是否已有账号以及密码的验证

    //超管登录
    conn.query(`select * from AAdmin where id='${data.phone}' and password='${data.password}'`, (err, rs) => {
      if (err) throw err;
      // console.log("学生信息：",rs);
      if (rs.length > 0) {
        res.json({
          msg: '登录成功',
          status: 200,
          readerId:rs[0].id,
          // readerId: rs[0].readerId,
          // readerName: rs[0].readerName,
          // readerPhone: rs[0].phone,
          // borrowTimes: rs[0].borrowTimes,
          // ovdTimes: rs[0].ovdTimes,
          isAdmin: false
        })
      } else {
        res.json({
          msg: '账号密码错误或该用户未注册！',
          status: 0
        })
      }
    })
  }
})
// 图书接口
app.post('/books', (req, res) => {
  conn.query(`select * from books`, (err, rs) => {
    let data = rs || []
    if (data.length > 0) {
      //把图片的地址赋值给avatar
      for(let i=0;i<data.length;i++){
        data[i].avatar='http://localhost:8080/images/'+data[i].avatar+'.jpg'
      }
      res.json({
        msg: '书籍请求成功',
        status: 200,
        data: rs
      })
    } else {
      res.json({
        msg: '书籍请求数据为空',
        status: 0,
      })
    }

  })
})
// 评论接口
app.post('/comments', (req, res) => {
  conn.query(`select * from comment where status=1`,(err,rs)=>{
    let data=rs || [];
    if(data.length>0){
      res.json({
        msg:'评论区请求成功',
        status:200,
        data:rs
      })
    }else{
      res.json({
        msg:'评论区数据为空',
        status:0
      })
    }
  })
})

//添加图书
app.post('/adminaddbooks', (req, res) => {
	// console.log(req,'123')
	let data = req.body
	// console.log(data,'12345')
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
	// const deal=0;
	// const bookId=nanoid();
	// conn.query(`select * from books where bookName = '${data.bookName}'`, (err, rs) => {
	// 	if (rs.length > 0) {
	// 		res.send({
	// 			msg: '该书已入库，请不要重复导入!',
	// 			status: 0
	// 		})
	// 	} else {
	// 		conn.query(`insert into books values('${nanoid()}','${data.bookName}','${data.cate}','${data.author}','${data.amount}','${data.price}','${data.press}',0)`)
	// 		res.send({
	// 			msg: '添加书籍成功！',
	// 			status: 200
	// 		})
	// 	}
	// })
})
// 添加评论 
// app.post('/addcomment', (req, res) => {
//   let data = req.body;
//   console.log(data,'123')
//    data.readName=data.readName+'(书店管理员)';
//   let commentId = nanoid();//随机生成一个唯一值
//   conn.query(`insert into comment values('${commentId}','${data.readName}','${data.bookName}',sysdate(),'${data.content}',0,1)`)
//   res.send({
//     msg: '评论成功！',
//     status: 200
//   })
// })
// 点赞
app.post('/addpraise', (req, res) => {
  let data = req.body
  conn.query(`update comment set praise = praise+1 where commentId='${data.commentId}'`)
  res.send({
    msg: '点赞成功！',
    status: 200
  })
})
// 书籍查询接口
app.post('/searchbook', (req, res) => {
  let data = req.body
  conn.query(`select * from books where bookName like '%${data.name}%'`, (err, book) => {
    book = book || []
    conn.query(`select * from books where author like '%${data.name}%'`, (err, author) => {
      const data = [...new Set(book.concat(author))]
      if (data.length > 0){
        for(let i=0;i<data.length;i++){
          data[i].avatar='http://localhost:8080/images/'+data[i].avatar+'.jpg'
        }
        res.json({
          msg: '查询成功！',
          data: data,
          status: 200
        })
      }
      
        
      else{
        res.json({
          msg: '查询结果为空！',
          status: 0
        })
      }
        
    })

  })
})
//查询订单
app.post('/searchorder',(req,res)=>{
  let data=req.body;
  // console.log(data,'123')
  conn.query(`select * from orders where account='${data.account}'`,(err,rs)=>{
    data=rs||[]
    if(rs.length===0){
      res.json({
        msg:'查询结果为空',
        status:0
      })
    }else{
      res.json({
        msg:'查询成功',
        status:200,
        data:data
      })
    }
  })
})
// 获取评论最多的人员
app.post('/amountmax', (req, res) => {
  conn.query(`select count(*) as amount,readerName from reader left join comment on reader.readerId=comment.readerId GROUP BY reader.readerId ORDER BY amount desc limit 1`, (err, rs) => {
    rs = rs || []
    res.send({
      status: 200,
      msg: '请求成功！',
      data: rs
    })
  })
})
// 获取评论数量
app.post('/amount', (req, res) => {
  conn.query(`select count(*) as mytotal from comment`, (err, rs) => {
    rs = rs || []
    res.send({
      status: 200,
      msg: '请求成功！',
      data: rs
    })
  })
})

//查询书籍相关评论
app.post('/bookamount',(req,res)=>{
 
  let data=req.body 
  // console.log(data.name,'213')
  if(data.name){//评论status=0 表示已删除
    conn.query(`select * from comment where bookName='${data.name}' and status=1`,(err,rs)=>{
    if(err) throw err;
    let data=rs||[];
    // console.log(data,'111')
    if(rs.length===0){
      res.json({
              msg: '查询结果为空！',
              status: 0
                })
    }else{
      res.json({
        msg:'查询成功',
        status:200,
        data:data
      })
    }
  })
  }
  if(data.id){
    conn.query(`select * from comment where bookName='${data.id}'`,(err,rs)=>{
      if(err) throw err;
      let data=rs||[];
      // console.log(data,'111')
      if(rs.length===0){
        res.json({
                msg: '查询结果为空！',
                status: 0
                  })
      }else{
        res.json({
          msg:'查询成功',
          status:200,
          data:data
        })
      }
    })
  }
  
})
// 端口监听
app.listen(8080, (err) => {
  if (!err) console.log('服务器启动成功!');

})

