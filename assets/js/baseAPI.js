// 每次调用 $.get() 或 $.post $.ajax()时候，都会调用ajaxPrefilter()函数
// 这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options){
    //在发起ajax请求之前，统一请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net'+ options.url;
    console.log(options.url);
});
