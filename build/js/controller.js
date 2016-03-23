/**
 * Created by Catter on 2016/3/11.
 */

/* ========================================================================
 * webIDE:controller
 * 模态框模块
 * ======================================================================== */
(function($){
   $("div[data-role='Modal']").each(function(){
       var trigger = $(this);
       var set_modal = $("#"+ trigger.data("target"));
       var modal_box = set_modal.find(".modal-box");
       var modal_close = set_modal.find(".modal-close");
       var modal_cancel = set_modal.find(".modal-cancel");
       var modal_sure = set_modal.find(".modal-sure");
       var modal_1 = $(".modal-1");
       if(!set_modal.length){return true;}

       trigger.click(function(){
           $("body").addClass("modal-open");
           modal_1.show('fast');
           set_modal.fadeIn("fast", function(){
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
           //确定设置的逻辑

           modal_close.trigger("click");
       });
       //阻止其他修改事件
       modal_box.click(function(e){
           e.stopPropagation();
       });
   });
})(jQuery);

/* ========================================================================
 * webIDE:controller
 * 选项卡模块
 * ======================================================================== */
(function($){
    //在添加卡片的时候绑定事件
    $.fn.tab = function(){
        var tabItem = $(this);
        var tabClose = tabItem.find(".tab-close");
        var Tab = {
            //点击卡片
            tabClick: function(){
                tabItem.bind("click",function(){
                    $("li[data-role='tabItem']").each(function(){
                        var tab1 = $(this);
                        if(tab1.hasClass("active") && tabItem!==tab1){
                            tab1.removeClass("active");
                        }
                    });
                    tabItem.addClass("active");
                });
            },
            //删除卡片
            closeClick: function(){
                tabClose.bind("click",function(){
                    var itemClose =  $("li[data-role='tabItem']").find(".tab-close");
                    itemClose.each(function(){
                        //判断点击的卡片是否被选中
                        if($(this).is(tabClose)  && $(this).parent().parent().hasClass("active")){
                            if($(this).is(itemClose.last())){//删除的是最后一个元素
                                tabItem.remove();
                                $("li[data-role='tabItem']:last").addClass("active");
                            }else{//删除的不是最后一个
                                var count = 0;
                                itemClose.each(function(){
                                    if($(this).is(tabClose)){return false;}
                                    else count++;
                                });
                                tabItem.remove();
                                $("li[data-role='tabItem']").eq(count).addClass("active");
                            }
                        }else{
                            tabItem.remove();
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

    function setTab(){
        $.ajax({
            type:"POST",
            url:"template/tab.html",
            success: function(data){
                //添加卡片
                $(".tab-select-header").append(data);
                console.log(data);
                var tab_item =  $("li[data-role='tabItem']:last");
                tab_item.tab();
            }
        })
    }

    $("#aaaaaaa").click(function(){
        setTab();
    });

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
                if(x>180 && x<500 && isDown){
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
    $.fn.extend(function(){

    });
})(jQuery);