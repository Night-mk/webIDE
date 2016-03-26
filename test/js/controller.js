/**
 * Created by Catter on 2016/3/11.
 */

/* ========================================================================
 * webIDE:controller
 * 模态框模块
 * ======================================================================== */
(function($){
    //模态框显示、消失模块
    function modalSet(){
        $("div[data-role='Modal']").each(function(){
            var trigger = $(this);
            var set_modal = $("#"+ trigger.data("target"));
            var modal_box = set_modal.find(".modal-box");
            var modal_close = set_modal.find(".modal-close");
            var modal_cancel = set_modal.find(".modal-cancel");
            var modal_sure = set_modal.find(".modal-sure");
            var modal_text = set_modal.find(".modal-input");

            var modal_1 = $(".modal-1");
            if(!set_modal.length){return true;}

            trigger.click(function(){
                $("body").addClass("modal-open");
                modal_1.show('fast');
                set_modal.fadeIn("fast", function(){
                    if(modal_text.val() != ''){
                        modal_text.val("");
                    }
                    set_modal.addClass("in");
                });
                return false;
            });

            modal_close.click(function(){
                $("body").removeClass("modal-open");
                modal_1.hide();
                set_modal.fadeOut("fast", function(){
                    set_modal.removeClass("in");
                });
            });

            modal_cancel.click(function(){
                modal_close.trigger("click");
            });
            modal_sure.click(function(){
                if(trigger.data("target")==="set-modal"){
                    modal_close.trigger("click");
                }
            });
            //阻止其他修改事件
            modal_box.click(function(e){
                e.stopPropagation();
            });
        });
    }

    modalSet();

    //模态框确定事件，
    $.fn.modalSure = function(options){
        var defaults = {
            id: "",//点击的文件夹的id
            mode: ""//模式：创建文件、创建文件夹、删除、重命名
        };

        var setting = $.extend({}, defaults, options);

        var modal_sure = $(this);

        modal_sure.bind("click", function(){
            //创建文件、文件夹、重命名
            var filename = $("#file-create").find(".modal-input").val();
            var sureData = null,
                requestUrl = null;
            if(setting.mode!=="delete"){
                sureData = {
                    id: setting.id[0],
                    filename: filename,
                    mode: setting.mode
                };
                if(setting.mode!=="rename"){//创建
                    requestUrl = "";
                }else{//重命名
                    requestUrl = "";
                }
            }else{//删除
                sureData = {
                    id: setting.id
                };
                requestUrl = "";
            }

            $.ajax({
                type: "post",
                url: requestUrl,
                data: sureData,
                success: function(data){
                    //重新初始化树目录
                    var data1 = eval("("+data+")");
                    if(data1===2){
                        alert("操作失败");
                    }else{
                        $.fn.tree(data1, {
                            treeBox: "tree-view",
                            treeViewNode: "tree-view-node"
                        });
                        $.fn.rClickAddListener();
                    }
                },
                error: function(){
                    alert("服务器出错啦~~~");
                }
            });
        });
    }

})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 选项卡模块
 * 代码选项卡：data-role="tabItem"
 * terminal选项卡：data-role="termTabItem"
 * ======================================================================== */
(function($){
    //在添加卡片的时候绑定事件
    $.fn.tab = function(test, options){
        var defaults = {
            id: "",//文件卡片目录模板里的id，目录id加工之后的id
            filename: ""
        };

        var setting = $.extend({}, defaults, options);

        //文件卡片和terminal卡片
        function setfileTab(){
            var data = $("#fileTab").html().format(setting.id, setting.filename);
            //添加卡片
            $(".tab-select-header").append(data);
            //添加具体代码内容
            $(".editor-content").append();
            var tab_item =  $("li[data-role='tabItem']:last");
            $("li[data-role='tabItem']").each(function(){
                if($(this).hasClass("active") && $(this)!==tab_item){
                    $(this).removeClass("active");
                }
            });
            tab_item.addClass('active');
            return tab_item;
        }
        function setTermTab(){
            //添加terminal卡片
            var data = $("#termTab").html().format(setting.id, setting.filename);
            $(".terminal-tab-header").append(data);
            var tab_item =  $("li[data-role='termTabItem']:last");
            $("li[data-role='termTabItem']").each(function(){
                if($(this).hasClass("active") && $(this)!==tab_item){
                    $(this).removeClass("active");
                }
            });
            tab_item.addClass('active');
            return tab_item;
        }

        var tabItem = $(this);

        if(test==="tabItem"){
            tabItem = setfileTab();
        }else if(test==="termTabItem"){
            tabItem = setTermTab();
        }

        var tabClose = tabItem.find(".tab-close");
        var Tab = {
            //点击卡片
            tabClick: function(){
                tabItem.bind("click",function(){
                    $("li[data-role='"+test+"']").each(function(){
                        var tab1 = $(this);
                        if(tab1.hasClass("active") && tabItem!==tab1){
                            tab1.removeClass("active");
                        }
                    });
                    tabItem.addClass("active");

                    //显示代码内容
                    $(".editor-box").children().each(function(){
                        var codeObj = $(this);
                        if("fileTab_"+setting.id === codeObj.attr("id")){
                            codeObj.css({"display":"block"});
                        }else{
                            codeObj.css({"display":"none"});
                        }
                    });
                });

            },
            //删除卡片
            closeClick: function(){
                tabClose.bind("click",function(){
                    var itemClose =  $("li[data-role='"+test+"']").find(".tab-close");
                    itemClose.each(function(){
                        //判断点击的卡片是否被选中
                        if($(this).is(tabClose)  && $(this).parent().parent().hasClass("active")){
                            if($(this).is(itemClose.last())){//删除的是最后一个元素
                                tabItem.remove();
                                $("li[data-role='"+test+"']:last").addClass("active");
                            }else{//删除的不是最后一个
                                var count = 0;
                                itemClose.each(function(){
                                    if($(this).is(tabClose)){return false;}
                                    else count++;
                                });
                                tabItem.remove();
                                $("li[data-role='"+test+"']").eq(count).addClass("active");
                            }
                        }else{
                            tabItem.remove();
                        }
                    });

                    //删除对应的代码部分
                    $(".editor-box").find("#"+tabItem.data("target")).remove();

                    //显示当前选中的代码
                    $("#"+$("li[data-role='"+test+"']").data("target"));
                    $("li[data-role='"+test+"']").each(function(){
                        if($(this).hasClass("active")){

                        }
                    });
                });
            },
            init: function () {
                this.tabClick();
                this.closeClick();
            }
        };

        Tab.init();
    };

    //function setTab(){
    //    $.ajax({
    //        type:"POST",
    //        url:"template/tab.html",
    //        success: function(data){
    //            //添加卡片
    //            $(".tab-select-header").append(data);
    //            var tab_item =  $("li[data-role='tabItem']:last");
    //            $("li[data-role='tabItem']").each(function(){
    //                if($(this).hasClass("active") && $(this)!==tab_item){
    //                    $(this).removeClass("active");
    //                }
    //            });
    //            tab_item.addClass('active');
    //            var test = 'tabItem';
    //            tab_item.tab(test);
    //        }
    //    });
    //}
})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 左右拖动条模块
 * ======================================================================== */
(function($){
    $.fn.extend({
        sliderLine : function(){
            var slider = $(this);
            var doc = document;
            //当前窗口可视区域的宽度
            var wholeWidth = $(doc).width();
            //var rightWidth = wholeWidth - leftWidth - 5;
            var leftMain = $(".main-left");
            var rightMain = $(".main-right");
            var isDown = false;
            slider.mousedown(function(e){
                isDown = true;
            });
            $(doc).mousemove(function(e){
                var x = e.pageX;
                if(x>10 && x<500 && isDown){
                    //leftMain.css({'width':x});
                    leftMain.width(x+"px");
                    slider.css({'left':x+5});
                    rightMain.css({'margin-left':x,'width':wholeWidth-x-5});
                }
            });
            $(doc).mouseup(function(e){
                isDown = false;
                e.cancelBubble = true;
            });
            return $(this);
        }
    });

    $(".content-slide-line").sliderLine();
})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 右键点击菜单模块
 * ======================================================================== */
(function($){
    var D = $(document).data("func", {});
    $.rClickMenu = $.noop;
    $.fn.rClickMenu = function(data, options){
        var B = $("body");
        var defaults = {
            name: "",
            offsetX: 2,
            offsetY: 2,
            textLimit: 10,
            beforeShow: $.noop,
            afterShow: $.noop
        };

        var setting = $.extend({}, defaults, options);

        var htmlCreateMenu = function(datum){
            var dataMenu = datum || data,//传入的参数
                nameMenu = datum ? Math.random().toString() : setting.name,//ID
                htmlMenu = "",//将要添加的html
                classKey = "r-menu-";
            if($.isArray(dataMenu) && dataMenu.length){
                htmlMenu =  '<div id="rMenu-'+nameMenu+'" class="'+classKey+'box">'+
                                '<div class="'+classKey+'body">'+
                                    '<ul class="'+classKey+'ul">';
                $.each(dataMenu, function(i, arr){
                    if(i){
                        htmlMenu += '<li class="'+classKey+'li-separate"></li>';
                    }
                    if($.isArray(arr)){
                        $.each(arr, function(j, obj){
                            var text = obj.text,//传入的文本内容
                                htmlMenuLi = "",//每一段li的内容
                                rand = Math.random().toString().replace(".","");//用于对应绑定方法

                            if(text){
                                if(text.length> setting.textLimit){
                                    text = text.slice(0, text.textLimit)+'...';
                                }
                                if($.isArray(obj.data) && obj.data.length){
                                    htmlMenuLi +=   '<li class="'+classKey+'li" data-hover="true">'+
                                                    '<a href="javascript:" class="'+classKey+'a" data-key="'+rand+'">'+text+'<i class="'+classKey+'next-icon"></i></a>'+
                                                    htmlCreateMenu(obj.data)+
                                                    '</li>';
                                }else{
                                    htmlMenuLi +=   '<li class="'+classKey+'li">'+
                                                    '<a href="javascript:" class="'+classKey+'a" data-key="'+rand+'">'+text+'</a>'+
                                                    '</li>';
                                }
                                htmlMenu += htmlMenuLi;

                                var objFun = D.data("func");
                                objFun[rand] = obj.func;//func属性
                                D.data("func", objFun);
                            }
                        });
                    }
                });
                htmlMenu += '</ul>'+
                            '</div>'+
                            '</div>';
            }
            return htmlMenu;
        };
        var funRMenu = function(){
            var idKey = "#rMenu-",
                classKey = "r-menu-",
                Menu = $(idKey+setting.name);
            if(!Menu.size()){
                B.append(htmlCreateMenu());

                //绑定点击事件
                $(idKey+setting.name+' a').bind("click", function(){
                    var key = $(this).attr("data-key"),
                        callback = D.data("func")[key];
                    if($.isFunction(callback)){
                        callback.call(D.data("trigger"));
                    }
                    $.rClickMenu.hide();
                    return false;
                });

                //鼠标拂过效果和二级菜单事件
                $(idKey+setting.name+' li').each(function(){
                    var isHover = $(this).attr("data-hover"),
                        classHover = classKey+"li-hover";
                    $(this).hover(function(){
                        var jHover = $(this).siblings("."+classHover);
                        //在移动到没有二级菜单的选项时先隐藏之前可能出现的二级菜单
                        jHover.removeClass(classHover).children("."+classKey+"box").hide();
                        jHover.children("."+classKey+"a").removeClass(classKey+"a-hover");

                        if(isHover){//显示二级菜单
                            $(this).addClass(classHover).children("."+classKey+"box").show();
                            $(this).children("."+classKey+"a").addClass(classKey+"a-hover");
                        }
                    });
                });
                return $(idKey+setting.name);
            }
            return Menu;
        };

        $(this).each(function(){
            //oncontextmenu 事件在元素中用户右击鼠标时触发并打开上下文菜单
            this.oncontextmenu = function(e){
                if($.isFunction(setting.beforeShow)){
                    setting.beforeShow.call(this);
                }
                e = e || window.event;
                e.cancelBubble = true;
                //取消冒泡事件
                if(e.stopPropagation()){
                    e.stopPropagation();
                }
                $.rClickMenu.hide();
                var jMenu = funRMenu();
                var st = D.scrollTop();
                if(jMenu){
                    jMenu.css({
                        display: "block",
                        left: e.clientX+setting.offsetX,
                        top: e.clientY+setting.offsetX+st
                    });
                    D.data("target", jMenu);
                    D.data("trigger", this);
                    //回调
                    if ($.isFunction(setting.afterShow)) {
                        setting.afterShow.call(this);
                    }
                    return false;
                }
            }
        });

        if (!B.data("bind")) {
            B.bind("click", $.rClickMenu.hide).data("bind", true);
        }
    };
    $.extend($.rClickMenu, {
        hide: function(){
            var target = D.data("target");
            if(target && target.css("display")==="block"){
                target.hide();
            }
        }
    });

    //树形结构目录右击事件
    $.fn.rClickAddListener = function (){
        var fileCreate = {
            text: "新建文件",
            func: function() {
                var idfile = new Array();
                idfile.push(this.id);
                $("#fileCreate").click();
                $("#file-create").find(".modal-sure").modalSure({
                    id: idfile,
                    mode: "file"
                });
            }
        },  folderCreate = {
            text: "新建文件夹",
            func: function() {
                var idfile = new Array();
                idfile.push(this.id);
                $("#folderCreate").click();
                $("#folder-create").find(".modal-sure").modalSure({
                    id: idfile,
                    mode: "folder"
                });
            }
        },  fileDelete = {
            text: "删除",
            func: function() {
                var idfile = new Array();
                idfile.push(this.id);
                $("#fileDelete").click();
                $("#file-delete").find(".modal-sure").modalSure({
                    id: idfile
                });
            }
        },  rename = {
            text: "重命名",
            func: function() {
                var idfile = new Array();
                idfile.push(this.id);
                $("#reName").click();
                $("#re-name").find(".modal-sure").modalSure({
                    id: idfile,
                    mode: "rename"
                });
            }
        };

        var rClickData1 = [
            [fileCreate, folderCreate, fileDelete, rename]
        ];
        var rClickData2 = [
            [fileDelete, rename]
        ];
        $(".tree-view-node").rClickMenu(rClickData1,{
            name: "folder"
        });
        $(".tree-view-leaf").rClickMenu(rClickData2,{
            name: "file"
        });
    };

})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 文件目录树模块
 * ======================================================================== */
(function($){
    //初始化目录树（后台完成）
    //创建文件、文件夹（多叉树添加操作）
    //删除文件夹（将文件夹下的文件一并删除）
    //删除文件
    //在tree-view中添加目录树
    //tree-view-node表示文件夹类
    //tree-view-leaf表示文件类
    /*传输json数组作为参数格式如下
     var fileTreeData = [
     {id:0, pid:-1, type:"folder", name:"webIDE"},
     {id:1, pid:0, type:"folder", name:"html"},
     {id:2, pid:1, type:"file", name:"index.html"},
     {id:3, pid:0, type:"folder", name:"js"},
     {id:4, pid:0, type:"file", name:"style.css"}
     ];
    */

    var Tree = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, $.fn.tree.defaults, options);
    };

    Tree.prototype = {
        constructor: Tree,

        init: function(data){

        },

        //添加目录节点
        addTreeNode: function(type, filename, id){
            var treeNodeHtml = '';
            var treeCl = "tree-view-",
                src = "img/icon/";
            if(type==="folder"){
                treeNodeHtml += '<div id="file_'+id+'" class="'+treeCl+'node">'+
                                    '<img class="file-icon" src="'+src+'file.png"/>'+
                                    '<span class="tree-font">'+filename+'</span>'+
                                '</div>';
            }else if(type==="file"){
                treeNodeHtml += '<div id="file_'+id+'" class="'+treeCl+'leaf">'+
                                    '<img class="file-icon" src="'+src+'doc.png"/>'+
                                    '<span class="tree-font">'+filename+'</span>'+
                                '</div>';
            }

            return treeNodeHtml;
        },

        deleteTreeNode: function(){

        },

        createTreeNode: function(type, filename1, filename2){//filename1：点击的文件夹的名字，filename2：新建文件的名字
            Tree.addTreeNode(type, filename2);
        },

        //为文件树添加事件：点击文件夹变化图片、下拉、收起内容
        addListener: function(obj, objLeaf){
            var imgSrc = "img/icon/";
            var childText = $(".tree-font");
            //点击文件改变颜色
            childText.each(function(){
                var child_text = $(this);
                child_text.bind("click", function(){
                    //点击变色
                    $(".tree-font").each(function(){
                       if($(this).hasClass("node-selected")){
                           $(this).removeClass("node-selected");
                       }
                    });
                    $(this).addClass("node-selected");
                });
            });
            //图片变化，下拉，收起
            obj.each(function(){
                var Obj = $(this);
                var imgObj = $(this).find("img").eq(0);//点击变化图片
                var childObj = $(this).next("span")[0];//文件夹下的内容
                imgObj.bind("click", function(){
                    if(Obj.hasClass("file-open")){
                        $(this).attr("src", imgSrc+"file.png");
                        Obj.removeClass("file-open");
                        if(typeof childObj==='object'){
                            childObj.style.display = "none";
                        }
                    }else{
                        $(this).attr("src", imgSrc+"fileDown.png");
                        Obj.addClass("file-open");
                        if(typeof childObj==='object'){
                            childObj.style.display = "block";
                        }
                    }
                });
            });
            //文件则添加tab
            objLeaf.each(function(){
                var ObjLeaf = $(this);
                ObjLeaf.bind("click", function(){
                    var leafName = $(this).find(".tree-font").text();
                    var leafId = $(this).attr("id");
                    //判断当前点击的文件是否存在
                    //判断
                    if($("#fileTab_"+leafId).length > 0){
                        return false;
                    }else{
                        //显示tab
                        $.fn.tab("tabItem",{
                            id: leafId,
                            filename: leafName
                        });
                        //加载对应的代码内容
                        $.fn.codeText({
                            codeId: "fileTab_"+leafId
                        });
                    }
                });
            });
        }
    };

    $.fn.Tree1 = function(){
        var Tree1 = new Tree();
        return Tree1;
    };

    $.fn.tree = function(data, options){
        var tree = new Tree();
        var defaults = {
            treeBox: null,
            treeViewNode: null,
            treeViewLeaf: null,
            afterBuildTree: $.noop
        };

        var setting = $.extend({}, defaults, options);

        var showTree = function(data){
            var treeNodes = data,
                treeHtml = '',
                treeCl = "tree-view-",
                src = "img/icon/";

            if($.isArray(treeNodes) && treeNodes.length){
                treeHtml += '<div id="file_0" class="'+treeCl+'node">'+
                                '<img class="file-icon" src="'+src+'file.png"/>'+
                                '<span class="tree-font">'+treeNodes[0].name+'</span>'+
                            '</div>';

                //遍历数组添加目录树
                for(var i= 1; i<treeNodes.length; i++){
                    if(treeNodes[i].pid>treeNodes[i-1].pid){//当前pid大于上一个pid，新建一层
                        treeHtml += '<span style="display: none;" class="">'+
                            '<div class="'+treeCl+'children">';
                        treeHtml += tree.addTreeNode(treeNodes[i].type, treeNodes[i].name, treeNodes[i].id);
                    }else if(treeNodes[i].pid<treeNodes[i-1].pid){
                        treeHtml += '</div>'+
                            '</span>';
                        treeHtml += tree.addTreeNode(treeNodes[i].type, treeNodes[i].name, treeNodes[i].id);
                    }else{//相等，在同一父节点下
                        treeHtml += tree.addTreeNode(treeNodes[i].type, treeNodes[i].name, treeNodes[i].id);
                    }
                }
                treeHtml += '</div>'+
                    '</span>';

            }else{
                return "noDataError";
            }
            return treeHtml;
        };

        //调用显示
        $("."+setting.treeBox).append(showTree(data));
        tree.addListener($("."+setting.treeViewNode), $("."+setting.treeViewLeaf));

        //右击事件监听添加
        $.fn.rClickAddListener();
    };
    $.fn.tree.defaults = {
        dataSource: function(options, callback){}
    };
    $.fn.tree.Constructor = Tree;

    //目录树刷新
    $("#refresh").bind("click", function(){
        //var fileTreeData = null;
        //$.ajax({
        //    type: "GET",
        //    url: "http://121.42.27.129/file/dir",
        //    dataType: "JSONP",
        //    success: function(data){
        //        console.log(data);
        //        fileTreeData = eval("("+data+")");
        //    }
        //});
        $(".tree-view").children().remove();
        var fileTreeData = [
            {id:0, pid:-1, type:"folder", name:"webIDE"},
            {id:1, pid:0, type:"folder", name:"html"},
            {id:2, pid:1, type:"file", name:"index.html"},
            {id:3, pid:0, type:"folder", name:"js"},
            {id:4, pid:0, type:"file", name:"style.css"}
        ];
        $.fn.tree(fileTreeData, {
            treeBox: "tree-view",
            treeViewNode: "tree-view-node",
            treeViewLeaf: "tree-view-leaf"
        });
    });

    //递归方式需要传入的参数：
    //根目录的名字：rootName, 后台传回的树形目录数据结构：treeNodes
    /*var treeHtml = "",
        treeCl = "tree-view-",
        rootName = null;

    treeHtml += '<div class="'+treeCl+'node">'+
        '<img class="file-icon" src="../img/icon/file.png"/>'+
        '<span class="tree-font">'+rootName+'</span>'+
        '</div>';
    //递归遍历目录树并添加相应html
    var parseTreeJson = function(treeNodes){
        if(!treeNodes && treeNodes.length){return;}

        for(var i=0, len=treeNodes.length; i<len; i++){
            var childs = treeNodes[i].children;
            var type = treeNodes[i].type;
            var filename = treeNodes[i].name;

            treeHtml += '<span class="">'+
                '<div class="'+treeCl+'children">';

            if(type==="folder"){//文件夹块添加
                treeHtml += '<div class="'+treeCl+'node">'+
                    '<img class="file-icon" src="../img/icon/file.png"/>'+
                    '<span class="tree-font">'+filename+'</span>'+
                    '</div>';

            }else if(type==="file"){//文件添加
                treeHtml += '<div class="'+treeCl+'leaf">'+
                    '<img class="file-icon" src="../img/icon/doc.png"/>'+
                    '<span class="tree-font">'+filename+'</span>'+
                    '</div>';
            }

            if(type==="folder" && childs && childs.length>0){//递归部分
                parseTreeJson(childs);
            }
        }

        treeHtml += '</div>'+
            '</span>';
    };
    */

})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 线性文件目录模块
 * ======================================================================== */
(function($){
    $.fn.fileLine = function(){

        var inlineFile = {//线性文件类
            addFile: function(){
            },
            removeFile: function(){
            }
        }
    }
})(jQuery);


/* ========================================================================
 * webIDE:controller
 * 显示、隐藏terminal
 * ======================================================================== */
(function($){
    var terminalPart = $(".terminal-wrapper");
    var mainContent = $(".main-content-top1");
    $(".terminal-button").click(function(){
        if(terminalPart.hasClass("none")){
            terminalPart.removeClass("none").addClass("active");
            mainContent.css({"height":"60%"});
        }else if(terminalPart.hasClass("active")){
            terminalPart.removeClass("active").addClass("none");
            mainContent.css({"height":"100%"});
        }
    });
})(jQuery);