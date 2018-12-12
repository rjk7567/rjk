const express = require("express");
const http = express();
const bodyParser = require("body-parser")
const Db = require("../js/db.js")
const db = new Db("hopes")
http.listen(8080, () => {
	console.log("run")
})
http.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
})
http.use(bodyParser.urlencoded({
	extended: false
}));
//提交愿望
http.post("/add", (req, res) => {
	let data = req.body;
	db.find("myHope", {
		query: {
			hope: data.hope
		}
	}, (err, data1) => {
		if(data1.length == 0) {
			data.timer = new Date().getTime();
			data.statics = "white";
			db.insertOne("myHope", data, (err, hopeData) => {
				if(err) throw err;
				res.send({
					status: "1",
					statusText: "许愿成功"
				})
			})
		} else {
			res.send({
				status: "-1",
				statusText: "愿望重复，请重新输入"
			})
		}

	})
})
http.get("/msg", (req, res) => {
	db.find("myHope", {}, (err, data) => {
		if(data.length == 0) {
			res.send({
				status: "0",
				statusText: "快来许愿吧！！！"
			})
		} else {
			randSort(data)
			if(data.length > 8) {
				let newArr = data.slice(0, 8)
				res.send({
					status:"8",
					newArr
				})
			}else{
				res.send({
					status:"5",
					data
				})
			}
		}
	})
})
//随机排序
function randSort(arr) {
	var temp;
	for(var i = 0; i < arr.length; i++) {
		var randIndex = parseInt(Math.random() * (arr.length));
		temp = arr[randIndex];
		arr[randIndex] = arr[i];
		arr[i] = temp
	}
	return arr;
}
http.get("/del", (req, res) => {
	let data = req.query;
	db.deleteById("myHope", data._id, (err, data1) => {
		if(err) throw err;
		res.send("删除成功")
	})
})
http.get("/ch", (req, res) => {
	let data = req.query;
	//	console.log(data)
	db.findById("myHope", data._id, (err, data1) => {
		if(data1.statics == "white") {
			db.updateById("myHope", data1._id, {
				statics: data.statics
			}, (err, data1) => {
				if(err) throw err;
				res.send({
					status: "2"
				})
			})
		} else {
			res.send({
				status: "-2"
			})
		}
	})
})