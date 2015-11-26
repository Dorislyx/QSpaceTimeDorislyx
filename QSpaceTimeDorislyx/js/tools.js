/*

    JavaScript Document
    Author:Doris_lyx
    Date:2015-07-02

 */


var tools ={


    /*通过id、标签名、类名获取元素:
    * 连个参数：
    * 第一个参数： 选择器名称
    * 第二个参数：选择器范围
    * */
    $ : function (selector,content){
        content = content || document;
        var tag = selector.charAt(),
            arr = [],	//声明一个空数组
            allClassEle = null;//声明一个空标签组
        if( tag === '#'){   // 获取id
            selector = selector.substring(1);
            return content.getElementById(selector);

        }else if( tag === '.'){  // 获取class
            selector = selector.substring(1);
            allClassEle = content.getElementsByTagName('*');//从content里获取所有标签赋值给allClassEle

            for( var i=0; i<allClassEle.length; i++){
                if(selector === allClassEle[i].className){//通过循环比较标签组里的className值是否相等
                    arr.push(allClassEle[i]);	//然后添加进arr数组里
                };
            };
            return arr;
        }else{
            return content.getElementsByTagName(selector); //获取标签
        };

    },





    /*封装getStyle函数  ：  获取浏览器计算后的样式
    只能读 不能写*/
    getStyle : function(obj,attr){  // 元素   属性
        //getStyle返回值：获取元素上的属性对应的值
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
    },





    //自动获取元素属性或属性值封装函数
    css : function(obj,attr,val){//参数1：元素； 参数2：属性； 参数3：属性值；
        if( arguments.length>=3){	//当传的参数的长度大于等于3的时候
            if(attr=='opacity'){	//如果属性是opacity时
                //则opacity等于val除以100；  标准下
                obj.style.opacity=val/100;
                //filter等于val   非标准下
                obj.style.filter='alpha(opacity='+val+')';
            }else{
                obj.style[attr]=val+'px';//如果属性不是opacity时，则当前属性等于val加上'px'
            };
        }else{//当传的参数的长度小于3的时候,直接获取iVal等于当前获取的属性
            var iVal=obj.currentStyle?parseFloat(obj.currentStle[attr]):parseFloat(getComputedStyle(obj)[attr]);
            if(attr=='opacity'){//当属性是opacity时
                iVal*=100;//则iVal等于iVal乘以100；
            };
            return iVal;//然后返回得出的iVal
        };
    },


    /*封装运动函数(第一种)   如果有连个时间处理函数 其中一个时间处理函数没有执行完成
     也可以执行另外一个
     参数1：对象；
     参数2：属性；
     参数3：速度；
     参数4：目标点；
     参数5：执行时间；
     参数6：回调函数；*/
    startMove : function(obj,attr,iSpeed,iTarget,ms,callBack){
        var iNow=tools.css(obj,attr);//声明iNow等于获取当前对象的属性值
        //如果当前的属性值大于目标值时，速度iSpeed是负值，否则就是正值
        iSpeed= iNow>iTarget ? -Math.abs(iSpeed):Math.abs(iSpeed);//Math.abs取绝对值
        clearInterval(obj.oTimer);//当每次执行下面的定时器前首先清除之前定时器
        obj.oTimer=setInterval(function(){
            var iNow=tools.css(obj,attr);//在定时器里重新声明iNow不断获取当前对象的属性值
            if(Math.abs(iTarget-iNow)<Math.abs(iSpeed)){//当目标值减当前属性值小于速度值iSpeed时
                clearInterval(obj.oTimer);	//则清除定时器
                obj.oTimer=0;//同时把定时器重置为0，以便其它的定时器执行
                //obj.style[attr]=iTarget+'px';
                tools.css(obj,attr,iTarget);	//然后当前对象属性值就等于目标值
                callBack&&callBack();	//然后当有回调函数时就执行回调函数
            }else{//如果目标值减当前属性值不小于速度值iSpeed时，
                iNow += iSpeed;//则当前属性值等于当前属性值加速度值iSpeed
                //obj.style[attr]=iNow+'px';
                tools.css(obj,attr,iNow);//然后当前属性值等于加上速度值iSpeed后的iNow
            };
        },ms)
    },





    /*
     *参数：
     * 一：obj 运动的元素
     * 二：attr 运动元素的属性
     * 三：speed 运动的速度
     * 四：target 运动的目标点
     * 五：定时器执行时间
     * 六：回调函数
     * */
    doMove : function (obj,attr,speed,target,ms,callBack){
        if(obj.timer) return;
        var iNowL = parseFloat(tools.getStyle(obj,attr));

        speed = iNowL > target ? -Math.abs(speed) : Math.abs(speed);

        obj.timer = setInterval(function(){
            if(speed > 0 &&  iNowL >= target || speed < 0 &&  iNowL <= target ){
                iNowL=target;
                obj.style[attr] =  iNowL + "px";
                clearInterval( obj.timer );
                callBack && callBack();
                obj.timer = null;
            }else{
                iNowL+=speed;
                obj.style[attr] =  iNowL + "px";
            };
        },ms);
    },






    //封装抖函数
    /*
     参数1：对象；
     参数2：属性；
     参数3：抖动数/抖动频率；
     参数4：抖动时间；
     参数5：回调函数
     */
    shake : function(obj,attr,n,ms,callBack){
        if(obj.oTimer){//如果有定时器执行的时候
            return;//就返回不再执行了
        };
        var arr = [];//声明一个空数组
        var iNow = tools.css(obj,attr);//声明iNow等于自动获取当前的元素属性值
        for( var i=n; i>=0; i-=2){
            arr.push(iNow+i,iNow-i+1);//for循环添加不同数字到数组里
        };
        arr.push(iNow);//for循环完后给数组最后添加最初自动获取的元素属性值iNow
        i = 0;//循环完后，i等于0
        clearInterval(obj.oTimer);//在自动抖动之前先清除一遍定时器
        obj.oTimer=setInterval(function(){
            if(i>arr.length-1){//如果i大于数组的长度减1时
                clearInterval(obj.oTimer);//则清除定时器
                obj.oTimer=0;//而且将定时器重置为0；
                callBack && callBack();//并且当有回调函数时，就执行回调函数；
            }else{//如果i小于数组的长度减1时
                tools.css(obj,attr,arr[i]);//则元素的属性值是数组里的i个
                i++;	//而i则是一直加一的
            };
        },ms);
    },






    //封装indexof方法兼容版 (数组)
    inDexOf : function(arr,attr,serchIndex){//参数1：数组；参数2：要找的值；参数3：要开始找的索引值；
        if(arguments.length<3){
            serchIndex=0;//当传进的参数小于3时，索引值默认为0；
        };
        for(var i=serchIndex; i<arr.length; i++){
            if(arr[i]===attr){//循环数组，i等于所传索引值，当循环到arr里的某位等于所要找的值时
                return i;//则返回当前i
            };//当循环到arr里的某位不等于所要找的值时，并且arr的长度减去索引值小于索引值时
            if(arr[i] != attr && arr.length-serchIndex<serchIndex){
                return -1;//则返回-1；
            };
        };
    },





    //封装选项卡套选项卡函数：Tabs ： 默认事件处理函数==>如果不传入，默认是点击事件处理函数
    /*
     * Tabs：传入的参数
     * 第一个参数：控制元素
     * 第二个参数：被控制元素
     * 第三个参数：元素的class样式
     * 第四个参数：事件处理函数
     * */
    Tabs : function(obj, activeObj,classNams,action){
        for( var i = 0; i < obj.length; i++ ){
            obj[i].index = i;
            obj[i][action || "onclick"] = function (){
                for( var i = 0; i < obj.length; i++ ){
                    activeObj[i].style.display = "none";
                    obj[i].className = "";
                };
                activeObj[this.index].style.display = "block";
                obj[this.index].className = classNams;
            };
        }
    },
/*-------------------------------------------- 上面的是常用的封装函数end ---------------------------------------------------------*/


/*----------------------------------------------常用DOM封装方法str------------------------------------------------------------*/

    /*封装获取元素节点函数兼容版
    * getLast : 元素的最后一个子节点
    * getFirst:  元素的第一个子节店
    * getPrev:  元素当前节点的上一个兄弟节点
    * getNext:  元素当前节点的下一个兄弟节点
    * */

    //元素的最后一个子节点
    getLast:function ( obj ){
        //如果没传参数或当前参数的最后一个子节点为空取反时，就返回空；
        if( !obj || !obj.lastChild )	return null;
        //如果当前对象的最后一个子节点的节点类型等于1时，则返回该节点，否则利用递归传入当前最后一个子节点为参数调用自身
        return obj.lastChild.nodeType === 1 ? obj.lastChild : tools.getPrev( obj.lastChild );
    },

    //元素的第一个子节点
    getFirst:function ( obj ){
        //如果没传参数或当前参数的第一个子节点为空取反时，就返回空；
        if( !obj || !obj.firstChild ) return null;
        //如果当前对象的第一个子节点的节点类型等于1时，则返回该节点，否则利用递归传入当前第一个子节点为参数调用自身
        return obj.firstChild.nodeType ===1 ? obj.firstChild : tools.getNext( obj.firstChild );
    },

    //获取当前节点的上一个兄弟节点
    getPrev:function ( obj ){
        //如果没传参数或当前参数的上一个子节点为空取反时，就返回空；
        if( !obj || !obj.previousSibling )	return null;
        //如果当前对象的上一个兄弟节点的节点类型等于1时，则返回该节点，否则利用递归传入当前节点的上一个兄弟节点为参数调用自身
        return obj.previousSibling.nodeType === 1 ? obj.previousSibling : tools.getPrev( obj.previousSibling );
    },

    //获取当前节点的下一个兄弟节点
    getNext:function ( obj ){
        //如果没传参数或当前参数的上一个子节点为空取反时，就返回空；
        if( !obj || !obj.nextSibling ) return null;
        //如果当前对象的下一个兄弟节点的节点类型等于1时，则返回该节点，否则利用递归传入当前节点的下一个兄弟节点为参数调用自身
        return obj.nextSibling.nodeType === 1 ? obj.nextSibling : tools.getNext( obj.nextSibling );
    },







    /*
    * 获取当前元素到定位父级元素的距离(加边框的)
    * */
    getOffset : function ( obj ){     //获取当前元素到定位父级元素的距离
        var iLeft = 0;    //声明left值为0
        var iTop = 0;	//声明top值为0
        var objBdL = parseInt(tools.getStyle(obj,"borderLeftWidth"));    //获取当前元素的左边边框，用parseInt排除NaN
        var objBdT = parseInt(tools.getStyle(obj,"borderTopWidth"));    //获取当前元素的上边边框，用parseInt排除NaN
        //判断不是NaN，是NaN的话，赋值为0
        objBdL = isNaN( objBdL ) ? 0 : objBdL;
        objBdT = isNaN( objBdT ) ? 0 : objBdT;
        while( obj ){
            var borderL = parseInt(tools.getStyle(obj,"borderLeftWidth"));    //获取当前元素的左边边框，用parseInt排除NaN
            var objBdT = parseInt(tools.getStyle(obj,"borderTopWidth"));    //获取当前元素的上边边框，用parseInt排除NaN
            //判断不是NaN，是NaN的话，赋值为0
            objBdL = isNaN( objBdL ) ? 0 : objBdL;
            objBdT = isNaN( objBdT ) ? 0 : objBdT;
            iLeft += obj.offsetLeft + borderL ;    //iLeft 等于循环中获取的offsetLeft 值加上边框
            iTop += obj.offsetTop + objBdT ;    //iTop 等于循环中获取的offsetTop 值加上边框
            obj = obj.offsetParent;    //重置当前元素好下一次循环
        };
        return {
            T:iTop - objBdT,	//最后返回iTop 减去当前元素的边框值
            L:iLeft - objBdL    //最后返回iLeft 减去当前元素的边框值
        }
    },



    /*
     * 添加class
     * */
    addClass : function( obj,classnames ){
        if( obj.className === "" ){  //如果元素中没有class，那么直接添加
            obj.className = classnames;
            return;
        };
        // "a b c"
        var classArray = obj.className.split(" "); // 通过空格分隔 转换为数组

        for( var i = 0; i < classArray.length; i++ ){ // 循环每一项
            if( classArray[i] === classnames ) return; // 如果相等，就return
        }

        obj.className += " " + classnames; // 否则  " " + classnames
    },


    /*
     * 移除class
     * */
    removeClass : function(obj,classNames){

        if( obj.className === "" ) return; //如果元素中没有class，那么停止

        var classArray = obj.className.split(" "); // 通过空格分隔 转换为数组

        for( var i = 0; i < classArray.length; i++ ){ // 循环数组每一项

            if( classArray[i] === classNames ){
                // splice删除数组的某一个元素，这个数组立马就会发生改变，数组的长度就会少1，当时i值一直在往前加
                classArray.splice(i,1);
                i--; //退回上一个数组索引
            }
        };
        obj.className = classArray.join(" ");
    },



    /*
    * 封装getElementsClassName
    * 三个参数：
    * 第一个参数：指定范围内的所有指定元素
    * 第二个参数：标签名
    * 第三个参数：class
    * */
    getByClass : function (parentObj, tagname, classname) {
            //获取指定范围内的所有指定元素
            var eles = parentObj.getElementsByTagName(tagname);
            //一个用来保存结果的数组
            var result = [];

            //循环遍历选中的元素eles
            for (var i=0; i<eles.length; i++) {

                //把当前循环过程中某个元素的class取出来，并分割成数组（元素可能会有多个class）
                var classes = eles[i].className.split(' ');


                //判断当前这个元素的class中是否有我们要找的class
                if (tools.inArray(classes, classname)) {

                    //如果当前元素中有我们要找的class，则把当前元素保存到结果数组中
                    result.push(eles[i]);
                }

                /*for (var j=0; j<classes.length; j++) {
                 if (classes[j] == classname) {
                 result.push(eles[i]);
                 break;
                 }
                 }*/
            }

            //返回结果数组
            return result;
    },
    inArray : function (arr, v) {
        for (var i=0; i<arr.length; i++) {
            if (arr[i] == v) {
                return true;
            }
        }
        return false;
    },


    /*
    * 可视区域的宽高：
    *标准下：
     window.innerWidth / window.innerHeight;

     ie低版本和标准都有的：
     document.documentElement.clientWidth  document.documentElement.clientHeight
    * */
    view : function (){
        return{
            W:window.innerWidth || document.documentElement.clientWidth,
            H:window.innerHeight || document.documentElement.clientHeight
        }
    },




    /*
     滚动距离height/width：页面被卷去的高度

     标准下：
     window.pageXOffset/window.pageYOffset

     ie低版本：
     document.documentElement.scrollTop
     document.documentElement.scrollLeft

     document.body.scrollTop
     document.body.scrollLeft

     */
    scroll : function (){
        return{
        top:document.body.scrollTop || document.documentElement.scrollTop,

        left:document.body.scrollLeft || document.documentElement.scrollLeft
    }
}














/*----------------------------------------------常用DOM封装方法end------------------------------------------------------------*/
};
