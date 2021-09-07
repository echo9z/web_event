$(function (){
    let layer = layui.layer;
    //获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (response) {
                if(response.status !== 0){
                    layer.msg(response.message)
                }
                console.log(response);
                let htmlStr = template('table',response);
                $('.layui-table tbody').html(htmlStr); //渲染html
            }
        });
    }
    initArtCateList();

    //为 添加分类注册点击按钮
    let indexAdd = null;
    $('#btnAddCate').on('click',function (){
        //layui的弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html() //将script转换为文本html文本
        });   
    });
    //添加的按钮中的表单元素
    //监听form_add 表单提交事件，但form_add表单是动态点击按钮添加的
    $('body').on('submit','#form_add',function (e){ //就需要代理事件表单#form_data'
        e.preventDefault();//阻止表单默认提交事件
        $.ajax({
            method: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (response) {
                if(response.status !== 0){
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                initArtCateList();
                 // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    //为渲染模版按钮 编辑按钮添加点击事件
    let form = layui.form;
    let indexEdit = null;
    $('tbody').on('click','.btnEdit',function (){
         //layui的弹出层
         indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html() //将script转换为文本html文本
          });   
         //获取自定义属性data-id值
          let Id = $(this).attr('data-id');

         //根据id获取文章分类数据
         $.ajax({
            method: "get",
             url: "/my/article/cates/"+Id,
             success: function (response) {
                 if(response.status !== 0){
                     return layer.msg(response.message);
                 }
                 //首页layui中的form快速填充表单值，form表单要添加lay-filter属性
                 form.val('form_edit',response.data);
             }
         });
    });

    //点按钮为确认修改按钮注册提交事件
    $('body').on('submit','#form_edit',function (e){ //就需要代理事件表单#form_data'
        e.preventDefault();//阻止表单默认提交事件
        $.ajax({
            method: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (response) {
                if(response.status !== 0){
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                initArtCateList();
                 // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
            }
        });
    });

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btnDel',function (){
        let Id = $(this).attr('data-id');
        //layui 的弹出层 confirm 提示是否用户要删除
        layer.confirm('确认删除吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: "get",
                url: "/my/article/deletecate/"+Id,
                success: function (response) {
                    if(response.status !== 0){
                        return layer.msg(response.message);
                    }
                    layer.msg(response.message);
                    initArtCateList();//重新获取文章分类的列表
                }
            });
            //关闭 confirm 询问提示框
            layer.close(index);
        });
    });

    
});