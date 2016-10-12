
//事件监听兼容
function addEvent(elem, type, func) {
	if (elem.addEventListener) {
		elem.addEventListener(type, func);
	} else if (elem.attachEvent) {
		elem.attachEvent("on" + type, func);
	} else {
		elem["on" + type] = func;
	}
} 
// 简化获取id
function $(id){
	return document.getElementById(id);
}

//检查表单的函数
var check=(function(){
	var nameArr=["名称不为空","名称不包含除中、英文及数字以外的字符","名称过短","名称过长","名称可用"]
	var passwordArr=["密码不为空","密码不包含除英文及数字以外的字符","密码过短","密码过长","密码可用"]
	var againArr=["两次密码不同","请正确输入第一次密码","密码正确"];
	var emailArr=["名称不为空","邮箱格式错误","邮箱格式正确"];
	var phoneArr=["手机号码不为空","手机号码格式错误","手机号码格式正确"]
	var nowPassword="";
	var passwordRight=false;
	
	//表单开始配置
	function formList(name,func,rule){
			this.label=name;
			this.validator=func;
			this.rules=rule;
	}
	
	
	formList.prototype.type='input';
	formList.prototype.success='格式正确';
	formList.prototype.fail='名称不为空';
	
	return {
		//验证名称输入
		checkName:function (str){
			var count=0;
			if(str==="") return nameArr[0];
			else if(/[^0-9a-z\u4e00-\u9fa5]/i.test(str)) return nameArr[1];
			else {
				for(var i=0;i<str.length;i++){
					if(/[a-z0-9]/i.test(str[i])) count++;
					else count+=2;
				}
				if(count<4)return nameArr[2];
				if(count>18)return nameArr[3];
			}
			return nameArr[4];
		},
		//验证密码输入
		checkPassword:function(str){
			var count=0;
			passwordRight=false;
			if(str==="") return passwordArr[0];
			else if(/[^0-9a-z]/gi.test(str)) return passwordArr[1];
			else {
				if(str.length<9)return passwordArr[2];
				else if(str.length>24)return passwordArr[3];
				else {
					passwordRight=true;
					nowPassword=str;
					return passwordArr[4];
				}
			}
		},
		//再次验证密码重新输入
		checkAgain:function(str){
			if(passwordRight){
				if(nowPassword===str)return againArr[2];
				else return againArr[0];
			}
			else return againArr[1];
		},
		checkEmail:function(str){
			if(str==="")return emailArr[0];
			else if(/^[\w]+@([a-z0-9]+\.)+[a-z0-9]{2,4}$/i.test(str))return emailArr[2];
			else return emailArr[1];
		},
		checkPhone:function(str){
			if(str==="")return phoneArr[0];
			else if(/^\d{11}$/.test(str))return phoneArr[2];
			else return phoneArr[1];
		}
	}
})();


//开始工厂模式
//表单配置
function FormList(name,type,func,rules,success){
	this.label=name;
	this.type=type;
	this.validator=func;
	this.rules=rules;
	this.success=success;
};


//实例化
var nameInput=new FormList("name","text",check.checkName,"必填，长度为4~16个字符，只允许输入中、英文及数字,中文占2个字符","名称可用");
var passwordInput=new FormList("password","password",check.checkPassword,"必填，长度为9~24个字符，只允许输入英文和数字","密码可用");
var againInput=new FormList("passwordAgain","password",check.checkAgain,"重复输入密码,两次密码需相同","密码正确");
var emailInput=new FormList("email","text",check.checkEmail,"必填，请输入正确的邮箱地址","邮箱格式正确");
var phoneInput=new FormList("phone","text",check.checkPhone,"必填，请输入正确的手机号码","手机号码格式正确");
var labelObj={
	"name":"名称",
	"password":"密码",
	"passwordAgain":"确认密码",
	"email":"电子邮箱",
	"phone":"手机号码"
}

function toString(obj){
	return "<tr><td><label for=\"" + obj.label + "\">" + labelObj[obj.label] + "</label></td><td><input type=\"" + obj.type + "\" placeholder=\"请输入" + labelObj[obj.label] + "\" id=\"" + obj.label + "\" name=\"" + obj.label + "\"><span id=\"" + obj.label + "Warn\"></span></td></tr>";
}

window.onload=function(){
	
	//获取选项，根据选项去生成表单样式
	var nameChose=$("nameList");
	var passwordChose=$("passwordList");
	var emailChose=$("emailList");
	var phoneChose=$("phoneList");
	var style1=$("style1");
	var style2=$("style2");
	var causeFormBtn=$("causeForm");
	var form=$("form");
	var strObj={
		0:[nameInput],
		1:[passwordInput,againInput],
		2:[emailInput],
		3:[phoneInput]
	}
	
	addEvent(causeFormBtn,"click",btnCauseForm);
	//点击按钮生成表单
	function btnCauseForm(){     
		var formArr=[nameChose,passwordChose,emailChose,phoneChose];
		var str="",
			arr=[];
		for(var i=0;i<formArr.length;i++){
			if(formArr[i].checked){
				arr.push(strObj[i]);
			}
		}
		for(var j=0;j<arr.length;j++){
			for(var k=0;k<arr[j].length;k++){
				str+=toString(arr[j][k]);
			}
		}
		
		if(style2.checked){
			str=str.replace(/<input/g,"<input style='width:200px;height:30px;margin-bottom:50px;display:inline-block;margin-right:20px'");
		}
		str+='<tr><td></td><td><input type="button" value="提交" id="submit"></td></tr>';
		form.innerHTML=str;
		
		(function(){
		var names=$("name");
		var nameWarn=$("nameWarn");
		var password=$("password");
		var passwordWarn=$("passwordWarn");
		var passwordAgain=$("passwordAgain")
		var againWarn=$("passwordAgainWarn");
		var email=$("email");
		var emailWarn=$("emailWarn");
		var phone=$("phone");
		var phoneWarn=$("phoneWarn");
		var submit=$("submit");
		function focusIn(input,text){
			text.style.color="#aaa";
			input.style.borderColor="#ccc";
		}
		//表单获取焦点时
		names&&addEvent(names,"focus",function(){
			nameWarn.innerHTML="必填，长度为4~16个字符，只允许输入中、英文及数字,中文占2字符";
			focusIn(names,nameWarn);
		});
		//失去焦点时
		names&&addEvent(names,"blur",function(){
			nameWarn.innerHTML=check.checkName(names.value);
			if(nameWarn.innerHTML=="名称可用"){
				names.style.borderColor="green";
				nameWarn.style.color="green";
			}
			else {
				names.style.borderColor="red";
				nameWarn.style.color="red";
			}
		});	
		
		password&&addEvent(password,"focus",function(){
			passwordWarn.innerHTML="必填，长度为9~24个字符，只允许输入英文字母和数字"
			focusIn(password,passwordWarn);
		});
		
		password&&addEvent(password,"blur",function(){
			passwordWarn.innerHTML=check.checkPassword(password.value);
			if(passwordWarn.innerHTML=="密码可用"){
				password.style.borderColor="green";
				passwordWarn.style.color="green";
			}
			else {
				password.style.borderColor="red";
				passwordWarn.style.color="red";
			}
		});
		passwordAgain&&addEvent(passwordAgain,"focus",function(){
			againWarn.innerHTML="请再次输入密码";
			focusIn(passwordAgain,againWarn);
		});
		passwordAgain&&addEvent(passwordAgain,"blur",function(){
			againWarn.innerHTML=check.checkAgain(passwordAgain.value);
			if(againWarn.innerHTML=="密码正确"){
				passwordAgain.style.borderColor="green";
				againWarn.style.color="green";
			}
			else {
				passwordAgain.style.borderColor="red";
				againWarn.style.color="red";
			}
		});
		email&&addEvent(email,"focus",function(){
			emailWarn.innerHTML="必填，请输入正确的邮箱地址";
			focusIn(email,emailWarn);
		});
		email&&addEvent(email,"blur",function(){
			emailWarn.innerHTML=check.checkEmail(email.value);
			if(emailWarn.innerHTML=="邮箱格式正确"){
				email.style.borderColor="green";
				emailWarn.style.color="green";
			}
			else {
				email.style.borderColor="red";
				emailWarn.style.color="red";
			}
		});
		phone&&addEvent(phone,"focus",function(){
			phoneWarn.innerHTML="必填，请输入正确的手机号码";
			focusIn(phone,phoneWarn);
		});
		phone&&addEvent(phone,"blur",function(){
			phoneWarn.innerHTML=check.checkPhone(phone.value);
			if(phoneWarn.innerHTML=="手机号码格式正确"){
				phone.style.borderColor="green";
				phoneWarn.style.color="green";
			}
			else {
				phone.style.borderColor="red";
				phoneWarn.style.color="red";
			}
		});
		addEvent(submit,"click",function(){
			if((!names||names.style.borderColor=="green")&&(!password||password.style.borderColor=="green")&&(!passwordAgain||passwordAgain.style.borderColor=="green")&&(!email||email.style.borderColor=="green")&&(!phone||phone.style.borderColor=="green")){
				alert("提交成功");
			}
			else alert("输入有误");
		})
	})();
	}
}