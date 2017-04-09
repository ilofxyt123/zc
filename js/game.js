!function(a){
    var Main = new function(){//项目主流程
        this.a={
            ImageList:[
                "images/aixin_sl.png",
            ],//图片列表
        };//主参数
        this.f = {
            start : function(){
                Main.Utils.preloadImage(Main.a.ImageList,function(){
                    console.log("图片加载完成");
                    //开始流程中的其他函数
                    this.p1();
                },false)
            },
            p1:function(){
                console.log("显示第一个页面")
            },
        };//主函数
    };
    var Media = new function(){
        this.mutedEnd = false;
        this.WxMediaInit=function(){
            var _self = this;
            if(!Utils.browser("weixin")){
                this.mutedEnd = true;
                return;
            }
            if(!Utils.browser("iPhone")){
                _self.mutedEnd = true;
                return;
            }
            document.addEventListener("WeixinJSBridgeReady",function(){
                var $media = $(".iosPreload");
                $.each($media,function(index,value){
                    _self.MutedPlay(value["id"]);
                    if(index+1==$media.length){
                        _self.mutedEnd = true;
                    }
                });
            },false)
        },
        this.MutedPlay=function(string){
            var str = string.split(",");//id数组
            var f = function(id){
                var media = Utils.g(id);
                media.volume = 0;
                media.play();
                // setTimeout(function(){
                media.pause();
                media.volume = 1;
                media.currentTime = 0;
                // },100)
            };
            if(!(str.length-1)){
                f(str[0]);
                return 0;
            }
            str.forEach(function(value,index){
                f(value);
            })
        },
        this.playMedia=function(id){
            var _self = this;
            var clock = setInterval(function(){
                if(_self.mutedEnd){
                    Utils.g(id).play()
                    clearInterval(clock);
                }
            },20)
        }
    };
    var Utils = new function(){
        this.preloadImage = function(ImageURL,callback,realLoading){
            var rd = realLoading||false;
            var i,j,haveLoaded = 0;
            for(i = 0,j = ImageURL.length;i<j;i++){
                (function(img, src) {
                    img.onload = function() {
                        haveLoaded+=1;
                        var num = Math.ceil(haveLoaded / ImageURL.length* 100);
                        if(rd){
                            $(".num").html("- "+num + "% -");
                        }
                        if (haveLoaded == ImageURL.length && callback) {
                            setTimeout(function(){
                                callback();
                            }, 500);
                        }
                    };
                    img.onerror = function() {};
                    img.onabort = function() {};

                    img.src = src;
                }(new Image(), ImageURL[i]));
            }
        },//图片列表,图片加载完后回调函数，是否需要显示百分比
        this.lazyLoad = function(){
            var a = $(".lazy");
            var len = a.length;
            var imgObj;
            var Load = function(){
                for(var i=0;i<len;i++){
                    imgObj = a.eq(i);
                    imgObj.attr("src",imgObj.attr("data-src"));
                }
            };
            Load();
        },//将页面中带有.lazy类的图片进行加载
        this.browser = function(t){
            var u = navigator.userAgent;
            var u2 = navigator.userAgent.toLowerCase();
            var p = navigator.platform;
            var browserInfo = {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
                weixin: u2.match(/MicroMessenger/i) == "micromessenger",
                taobao: u.indexOf('AliApp(TB') > -1,
                win: p.indexOf("Win") == 0,
                mac: p.indexOf("Mac") == 0,
                xll: (p == "X11") || (p.indexOf("Linux") == 0),
                ipad: (navigator.userAgent.match(/iPad/i) != null) ? true : false
            };
            return browserInfo[t];
        },//获取浏览器信息
        this.g=function(id){
            return document.getElementById(id);
        },
        this.E=function(selector,type,handle){
            $(selector).on(type,handle);
        }
    };
    a.output = {main:Main,media:Media,utils:Utils};

    var game = function(){
        this.nowPeople = parseInt($(".now-people").html());

        this.clockSwitch = undefined;

        this.touch ={
            ScrollObj:undefined,
            isScroll:false,
            limit:0,
            overlimit:false,
            StartY:0,
            NewY:0,
            addY:0,
            scrollY:0
        };

        this.bgm ={
            obj:document.getElementById("bgm"),
            isPlay:false,
            button:$(".music-btn")
        };

        this.gameData = {
            $stampContainer : $(".stampList"),
            stampappend:'<img src="images/p4_pic04.png" class="stamp-staic stamp-move stamp-touch">',
            $goodContainer : $(".good"),
            goodappend:'<img src="images/1.png" class="ani-good">',
            nowTime : 10,
            score : 0,
            $scoreContainer : $(".game-score"),
            gameover:false
        };

        this.init();
    };
    game.prototype = {
        init:function(){
            /////////////处理参与活动页面///////////////
            var percent = this.nowPeople/278;
            $(".progress-bar").css("transform","scaleX("+percent+")");
            /////////////处理参与活动页面///////////////
        },
        playbgm:function(){
            this.bgm.obj.play();
            this.bgm.button.addClass("ani-bgmRotate").removeClass("ani-bgmPause");
            this.bgm.isPlay = true;
        },
        pausebgm:function(){
            this.bgm.obj.pause();
            this.bgm.button.addClass("ani-bgmPause");
            this.bgm.isPlay = false;
        },
        start:function(){
            this.clockSwitch = setTimeout(function(){
                                    $(".P_gameMask").addClass("ani-fadeOut");
                                },3000);
        },
        pgameleave:function(){
            $(".P_game").fadeOut();
        },
        pgameresult:function(){
            $(".P_game_result").fadeIn();
        },
        pgamemaskleave:function(){
            $(".P_gameMask").addClass("ani-fadeOut");
        },
        loadleave:function(){
            $(".P_loading").fadeOut();
        },
        gameStart:function(){
            var nowTime = 10,
                $time = $(".sec"),
                _self = this;
            var clock = setInterval(function(){
                if(nowTime == 0){
                    $(".stampBox").off("touchstart touchmove touchend");
                    $(".stamp-result").html(_self.gameData.score);
                    console.log("游戏结束")
                    setTimeout(function(){
                        _self.pgameleave();
                        _self.pgameresult();
                    },1000);
                    clearInterval(clock);
                    return;
                }
                nowTime -= 1;
                $time.html(nowTime);
            },1000)
        },
        pchaxun:function(){
            $(".P_chaxun").fadeIn();
        },
        pchaxunleave:function(){
            $(".P_chaxun").fadeOut();
        },
        plist:function(){
            $(".P_List").fadeIn();
        },
        plistleave:function(){
            $(".P_List").fadeOut();
        },
        paddress:function(){
            $(".P_Address").fadeIn();
        },
        paddressleave:function(){
            $(".P_Address").fadeOut();
        },
        pshare:function(){
            $(".P_share").fadeIn();
        },
        addEvent:function(){
            var _self = this;

            $(document).on("webkitAnimationEnd",function(e){
                var animationName = e.originalEvent.animationName,
                    $dom = $(e.target);
                switch(animationName){
                    case "ani-fadeOut":
                        $dom.addClass("none").removeClass("ani-fadeOut");
                        break;
                    case "ani-fadeIn":
                        $dom.removeClass("none").removeClass("opacity ani-fadeIn");
                        break;
                }
                animationName = null;
                $dom = null;
            });
            $(".P_gameMask").on("webkitAnimationEnd",function(){
                clearTimeout(_self.clockSwitch);
                _self.gameStart();
            });
            $(".stampBox").on({
                touchstart:function(e){
                    _self.touch.StartY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                },
                touchmove:function(e){

                },
                touchend:function(e){
                    _self.touch.NewY = e.originalEvent.changedTouches[0].pageY;
                    _self.touch.addY = _self.touch.NewY - _self.touch.StartY;
                    if(_self.touch.addY<-30){
                        _self.gameData.$stampContainer.append(_self.gameData.stampappend);
                        _self.gameData.$goodContainer.append(_self.gameData.goodappend);
                        _self.gameData.score+=1;
                        _self.gameData.$scoreContainer.html(_self.gameData.score);
                    }
                }
            });

            $(".P_gameMask").on("touchend",function(){
                _self.pgamemaskleave();
            });
            $(".game-result-btn1").on("touchend",function(){
                _self.paddress();
            });
            $(".game-result-btn2").on("touchend",function(){
                _self.pshare();
            });
            $(".add-xx").on("touchend",function(){
                _self.paddressleave();
            });
            $(".rule-btn").on("touchend",function(){//打开规则
                $(".P_rule").fadeIn();
            });
            $(".P_share").on("touchend",function(){//打开分享
                $(this).fadeOut();
            });
            $(".music-btn").on("touchend",function(){
                if(_self.bgm.isPlay){
                    _self.bgm.isPlay = false;
                    _self.pausebgm();
                }
                else{
                    _self.bgm.isPlay = true;
                    _self.playbgm();
                }
            });
            $(".rulexx").on("touchend",function(){//关闭规则
                $(".P_rule").fadeOut();
            });
            $(window).on("orientationchange",function(e){
                if(window.orientation == 0 || window.orientation == 180 )
                {
                    $(".hp").hide();
                }
                else if(window.orientation == 90 || window.orientation == -90)
                {
                    $(".hp").show();
                }
            });
            document.body.ontouchmove = function(e){e.preventDefault();}
        },
    };
    window.game = game;
/*-----------------------------事件绑定--------------------------------*/
}(window);
$(function(){
    // var main = output.main,
    //     media = output.media,
    //     utils = output.utils;
    // media.WxMediaInit();
    // utils.E(window,"touchstart",function(){media.MutedPlay("video");console.log(1)})
});
window.onload = function(){
    var Game = new game();
    Game.addEvent();
    Game.start();


    /////////测试输出/////////
    window.test = Game;
    console.log(test);
    /////////测试输出/////////
};



