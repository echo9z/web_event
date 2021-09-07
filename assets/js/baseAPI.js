// 每次调用 $.get() 或 $.post $.ajax()时候，都会调用ajaxPrefilter()函数
// 这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options){
    //在发起ajax请求之前，统一请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net'+ options.url;
    // options.url = 'http://www.liulongbin.top:3008'+ options.url;

    //统一为有权限的接口，设置 headers 请求头
    if(options.url.indexOf('/my/') != -1){
        options.headers = {Authorization:localStorage.getItem('token') || ''}
    }
    console.log(options.url);

    //设置全局统一挂在complete回调函数
    options.complete = function (response){//ajax 无论请求是否存在都执行complete函数
        //console.log(response);
        //在complete回调函数中，可以使用res.responseJSON拿到服务器响应的数据
        if(response.responseJSON.status === 1 && response.responseJSON.message ==="身份认证失败！"){
            //1.强制清空token
            localStorage.removeItem('token');
            //2.强制跳转到登录页面
            location.href = '/login.html';
        }
    }
});
