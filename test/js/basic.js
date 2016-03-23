/**
 * Created by Catter on 2016/3/9.
 */
//(function(){

    //js实现hasClass,addClass,removeClass,ToggleClass
    function hasClass(obj, cName){
        return obj.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
    }
    function addClass(obj, cName){
        if(!hasClass(obj, cName)){
            obj.className = obj.className+" "+cName;
        }
    }
    function removeClass(obj, cName){
        if(hasClass(obj, cName)){
            var reg = new RegExp('(\\s|^)' + cName + '(\\s|$)');
            obj.className = obj.className.replace(reg, "");
        }
    }
    function ToggleClass(obj, cName){
        if(!hasClass(obj, cName)){
            addClass(obj, cName);
        }else{
            removeClass(obj, cName);
        }
    }

(function($){
    //字符替换
    $(document).ready(function(){
        if (!String.prototype.format) {
            String.prototype.format = function() {
                var hash = arguments;
                //console.log(arguments.length);
                return this.replace(/{(\w+)}/g, function(match, item) {
                    return typeof hash[item] != 'undefined' ? hash[item] : match;
                });
            };
        }
    });
})(jQuery);


//})();