$(function (){
    //定义一个查询的参数对象，将来请求数据的时候，将需要的请求参数对象提交到服务器
    let q = {
        pagenum:1, //默认请求第一页的数据
        pagesize:2, //每页显示几条数据，默认显示2条
        cate_id:'', //文章分类的Id
        state:'' //文章发布状态
    };
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage; //分页对象
    //获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (response) {
                if(response.status !==0 ){
                    return layer.msg(response.message);
                }
                console.log(response);
                //使用模版引擎渲染
                template.defaults.imports.dataFormat = function (data){
                    return formatDate(data);
                };
                // template('artList',response.data);
                let strHtml = template('artList',response);//模版引擎渲染html
                // let strHtml = template('artList',dataRec);//模版引擎渲染html
                $('tbody').html(strHtml); //渲染html结构
                //调用渲染分页的方法
                renderPage(response.total);
            }
        });
    }
    initTable();

    //时间格式函数
    function formatDate(strData){
        let time = new Date(strData);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();

        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hours = hours < 10 ? "0" + hours : hours;
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
      }

      //动态获取的文章分类名字id，动态渲染分类选择框
      //初始化文章分类
      function initCate(){
          $.ajax({
              method: "get",
              url: "/my/article/cates",
              success: function (response) {
                if(response.status !== 0){
                    layer.msg(response.message);
                }
                //调用模板引擎渲染分类可选项
                let htmlStr = template('artCate',response);
                $('[name=cate_id]').html(htmlStr); //渲染html
                form.render();//通知layui重新渲染表单区域的ui结构
            }
          });
      }
      initCate();

      //为筛选按钮 添加submit 提交事件
      $('#form-search').on('submit',function (e) {
          e.preventDefault();
          //获取表单中选中的值
          let cate = $('[name=cate_id]').val();//获取分类cate_id
          let state = $('[name=state]').val();//获取状态分类state

          //将cate与state赋值给查询对象q
          q.cate_id = cate;
          q.state = state;
          initTable(); //根据选择条件筛选，重新渲染表格的数据
      });

      //定义渲染分页方法
      //分类表格渲染完毕后，渲染分页功能
      // 总跳数据 /每页显示的条数 = 分页页码数
      function renderPage(total){
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几行数据
            curr: q.pagenum, //设置默认选择的分页
            //layout参数说明
            //count: 一共有多少条数据
            //limit: 分页数，查看每页有几条数据数据
            //prev: 上一页    next: 下一页
            //page: 1-5 的页码值
            //skip: 跳转的第几页
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10], //查看每页有展示的条数
            //分页发生切换，触发调用jump回调，触发jump回调的方式两种：
            //1.点击页码的时候，会触发jump函数:first属性参数为false
            //2.只要调用laypage.render()方法，就只触发jump函数: first属性参数为true
            //通过first的值，来判断是通过那种方式，触发的jump函数，如果是first值为true，证明是方式2触发的，否则就是方式1触发的
            jump: function (obj,first){
                //obj.curr获取选择中的页数值，比如点击5页就获取第五页的值
                q.pagenum = obj.curr;//把最新选中的页面值，赋值到q的pagenum属性
                console.log(first);
                q.pagesize = obj.limit; //把用户选择中
                //q赋值完成，根据q中数据 重新渲染分页数据
                if(!first){ //如果是直接调用render()方法，不执行initTable();，如果是点击的触发render()方法，执行initTable()
                    initTable();
                }
            },
        });
      }
      
      //通过代理的形式，通过点击tbody，让删除按钮执行点击事件
      $('tbody').on('click','#btn-delete',function (){
        let id = $(this).data('id')//文章id
        let len = $('.btn-delete').length; //删除按钮的个数，即每页的条数
        //询问是否要删除数据
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            console.log(id);
            $.ajax({
                method: "get",
                url: "/my/article/delete/"+id,
                success: function (response) {
                    if(response!==0){
                        return layer.msg(response.message);
                    }
                    layer.msg(response.message);
                    //当数据完成后，需要当前页中是否有剩余数据，如果没有则让页面值-1之后，重新渲染文章列表
                    if(len === 1){
                        //len 等于1，即当前也的数据只有一条，当点击删除len 数据-1，数据就为空，当前页面就没有任何数据
                        //判断当前页码值最小值必须等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //重新渲染文章列表
                    initTable();
                }
            });
            layer.close(index); //退出询问框
          });
      });

    //文章编辑功能
    //通过代理的形式，通过点击tbody，让删除按钮执行点击事件
    $('tbody').on('click','#btn-edit',function (){
        //layui的弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['1200px', '600px'],
            content: $('#artPub').html(), //将script转换为文本html文本
            success:function (){
                $('#iframe-ArtPub')[0].window.editArt(id);
            }
        }); 
        let id = $(this).data('id')//文章id
        //通id获取文章
    });

});