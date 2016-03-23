/**
 * Created by Catter on 2016/3/9.
 */
(function(){
    function Menu(){}

    //菜单栏下拉效果
    Menu.prototype.clickMenuList = function(){
        var obj = document.getElementsByClassName("menuItem");
        for(var i=0; i<obj.length; i++){
            obj[i].addEventListener("click",function(){
                var objF = null;
                for(var j=0; j<obj.length; j++){
                    if(hasClass(obj[j],"menu-active")){
                        removeClass(obj[j], "menu-active");
                        addClass(obj[j], "menu-collapse");
                        objF = obj[j];
                    }
                }
                if(hasClass(this, "menu-collapse") && objF!==this){
                    removeClass(this, "menu-collapse");
                    addClass(this, "menu-active");
                }else{
                    removeClass(this, "menu-active");
                    addClass(this, "menu-collapse");
                }
            });
        }
    };

    var menu = new Menu();
    menu.clickMenuList();
})();


