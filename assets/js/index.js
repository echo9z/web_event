$(function (){
    getUserInfo();//获取用户基本信息
    $('#btnLogOut').on('click',loginOut); //用户退出
});

let layer = layui.layer;
//获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method: "get",
        url: '/my/userinfo',
        //获取登录成功时，将服务端响应的token值存放在localStorage中取出,统一添加
        // headers: {Authorization:localStorage.getItem('token') || ''},
        success: function (response) {
            if(response.status !== 0){
                return layer.msg(response.message);
            }
            console.log(response);
            //调用renderAvatar函数渲染用户头像
            renderAvatar(response.data);
        },
        /* complete:function(response){//ajax 无论请求是否存在都执行complete函数
            console.log(response);
            //在complete回调函数中，可以使用res.responseJSON拿到服务器响应的数据
            if(response.responseJSON.status === 1 && response.responseJSON.message ==="身份认证失败！"){
                //1.强制清空token
                localStorage.removeItem('token');
                //2.强制跳转到登录页面
                location.href = '/login.html';
            }
        }  */
    });
}

//根据服务器响应用户信息，是否有头像
function renderAvatar(userData){
    //1.如果用户有昵称，优先渲染昵称，没有显示用户名
    let name = userData.nickname || userData.username;
    $('#welcome').html('欢迎 '+name);//2.渲染欢迎文本用户名
    //3.如果用户的没有头像。隐藏img图片，渲染文字图像
    if(userData.user_pic !== null){//3.1有头像，渲染图像
        $('#layui-nav-img').attr('src',userData.user_pic).show();
        $('.text-avatar').hide();
    }else{ //没有图片图像，渲染文字图像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();//用户名的第一次字符
        $('.text-avatar').html(first).show();
    }
}

//用户退出
function loginOut(){
    //layer中的confirm函数，'弹出信息框提示信息',{图标, 提示框头}
    layer.confirm('确认退出登录吗？', {icon: 3, title:'提示'}, function(index){
        //用户点击确认，执行回调函数
        //1.清空本地存储的token
        localStorage.removeItem('token');
        //2.跳转到登录页面
        location.href = "/login.html";
        //关闭 confirm 询问提示框
        layer.close(index);
    });
}