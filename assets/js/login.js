$(function (){
    //一、点击去注册链接 切换到登录
    $('#link_reg').on('click',function (){
        $('.login-box').hide(); //隐藏登录div，显示注册div
        $('.register-box').show(); 
    });
    //点击去登录链接 切换到注册
    $('#link_login').on('click',function (){
        $('.login-box').show();  //显示登录div，隐藏注册div
        $('.register-box').hide();
    });

    //二、自定义form表的验证规则，依赖于layui.js
    //1.从layui中获取form对象
    let form = layui.form;
    //2.通过 form.verify()函数自定义校验规则
    form.verify({
        //用户名校验规则
        username:function (value,item){
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\·]+$").test(value)){
                return '用户名不能有特殊字符和空格';
              }
        },
        //密码的校验规则
        password:[/^[\S]{6,16}$/,'密码必须8到16位，且不能出现空格'],
        //校验两次密码是否一致
        repwd:function (value){
            //value形参时确认密码的框中内容 
            let pwd = $('.register-box [name=password]').val();// 使用属性选择器查找 $('.register-box [name=password]')
            if(pwd !== value){ //两次密码不一致，return提示消息
                return '两次输入密码不一致';
            }
        }
    });

    //三、监听注册表单的提交事件
    // 3.使用layer提示消息
    let layer = layui.layer;   
    $('#form_register').on('submit',function (e){
        e.preventDefault(); //1.阻止表单默认表单跳转
        $.ajax({ //2.发起ajax请求
            method: "post",
            url: "/api/reguser",
            data: {
                username:$('#form_register [name=username]').val(),  //获取用户名
                password:$('#form_register [name=password]').val()  //获取用户
            },
            success: function (response) {
                if(response.status !== 0){
                    //4.使用layui 内置提示层
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                $('#link_login').click(); //5.注册成功，切换至登录表单
            }
        });
    });

    //四、监听登录表的提交时间
    $('#form_login').on('submit',function (e){
        e.preventDefault(); //1.阻止表单默认表单跳转
        $.ajax({ //2.发起ajax请求
            method: "post",
            url: "/api/login",
            data: $(this).serialize(),  //jq中快速获取登录框的用户和密码
            success: function (response) {
                if(response.status !== 0){
                    //4.使用layui 内置提示层
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                console.log(response.token);
                //5.将用户 token 令牌认证，存储到本地localStorage 中
                localStorage.setItem('token',response.token)
                //6.跳转后台首页
                location.href = '/index.html';
                console.log(location.href);
            }
        });
    });


});