/**
 * @author 罗冲
 */

//express 架构
var express = require('express');
//http
var http = require("http");
//http 请求客户端
//var client = require("./client");
var fs = require("fs");
var url = require("url");
var path = require("path");
var querystring = require("querystring");

var app = express();
 
//静态资源
app.use(express.static(path.resolve(__dirname, "..")));

//转发get请求到后台服务器获取数据
app.get("/*", function(req, res) {
	
	var options = route(req.url);
	if (!options) {
		res.send("不转发请求");
		return;
	}
	var request = http.request(options, function(response) {
		response.setEncoding("utf-8");
		var resData = "";
		response.on("data", function(data) {
			resData += data;
		})
		
		response.on("end", function() {
			console.log("request get url: %s\nrequest get response: %s", options.path, resData);
			res.send(resData);
		})
	});
	request.end();
	
	request.on("error", function(err) {
		console.log("request get url: %s\n错误详情：%s", options.path, err);
		res.send("请求失败: " + err);
	});
})

//转发post请求到后台服务器获取数据
app.post("/*", function(req, res) {
	
	var options = route(req.url);
	if (!options) {
		res.send("不转发请求");
		return;
	}
	
	var body = "";
	req.on("data", function(chunk) {
		body += chunk;
	});
	
	req.on("end", function() {
		options.method = "POST";
		options.headers = {
			"Content-Type":"application/x-www-form-urlencoded",
			"Content-Length":body.length
		};
		
		if (options.name == "/buyer" || options.name == "/redpig") {
			options.headers = {
				"Content-Type":"application/x-www-form-urlencoded",
				"Content-Length":body.length,
				"User-Agent": "Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255",
				"Referer": "https://mp.weixin.qq.com"
			};
		}
		
		console.log(options);
		
		var request = http.request(options, function(response) {
			response.setEncoding("utf-8");
			var resData = "";
			response.on("data", function(data) {
				resData += data;
			})
			
			response.on("end", function() {
				console.log("request post url: %s\nrequest post body:%s\nrequest post response: %s", req.url, body, resData);
				res.send(resData);
			})
		});
		
		request.write(body);
		request.end();
		
		request.on("error", function(err) {
			console.log("request post url: %s\n错误详情：%s", req.url, err);
			res.send("请求失败: " + err);
		});
	})
})

var optionsArray = [
	{
		name: "/order",
		host: "localhost",
		port: "9078"
	},
	{
		name: "/config",
		host: "localhost",
		port: "9077"
	},
	{
		name: "/integral",
		host: "192.168.1.105",
		port: "9077"
	},
	{
		name: "/duobei",
		host: "192.168.1.105",
		port: "9077"
	},
	{
		name: "/yibao",
		host: "192.168.1.105",
		port: "9077"
	},
//	{
//		name: "/integral",
//		host: "192.168.1.5",
//		port: "9078"
//	},
//	{
//		name: "/duobei",
//		host: "192.168.1.5",
//		port: "9078"
//	},
//	{
//		name: "/yibao",
//		host: "192.168.1.5",
//		port: "9078"
//	},
	{
		name: "/user",
		host: "192.168.1.133",
		port: "9077"
	},
	{
		name: "/buyer",
		host: "192.168.1.20",
		port: "7097"
	},
	{
		name: "/redpig",
		host: "192.168.1.20",
		port: "7097"
	}
]

function route(url) {
	for (var item in optionsArray) {
		if (url.search(optionsArray[item].name) != -1) {
			var options = {};
			options.host = optionsArray[item].host;
			options.port = optionsArray[item].port;
			options.path = url;
			return options;
		}
	}
}

//app.get("/*.html", function(req, res) {
//	console.log(req.url);
//	var pathname = url.parse(req.url).pathname;
//	var filepath = path.resolve(__dirname, "..");
//	console.log(filepath);
//	pathname = filepath + "\\" + pathname.substr(1);
//	console.log(pathname);
//	res.writeHead(200, {'Content-type': 'text/html'});
//	fs.readFile(pathname, function(err, data) {
//		if (err) {
//			console.log(err);
//			res.writeHead(404, {'Content-type': 'text/html'});
//			res.send(err);
//		} else {
//			
//			res.send(data);
//		}
//	})
//})

var server = app.listen(8881, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

console.log("应用启动完毕");
