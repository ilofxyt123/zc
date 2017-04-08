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

    var main = function(){
        this.isEnd;//活动结束标志
        this.havePay;//付款标记,也是参与活动的标志
        this.isVip;//会员标记
        this.guanzhu;//关注标记
        this.FromTuiSong;//从推送进入页面
        this.prizeType;//奖品类型，0代表未参与过活动，1代表188新品券，2代表4999旅行

        this.touch={
            ScrollObj:undefined,
            isScroll:false,
            limit:0,
            overlimit:false,
            StartY:0,
            NewY:0,
            addY:0,
            scrollY:0,
        };

        this.picUrl = "images/";//图片路径
        this.ImageList = [
            this.picUrl+"bg1.jpg",
            this.picUrl+"bg2.jpg",
            this.picUrl+"bg3.jpg",
            this.picUrl+"bird_small.png",
            this.picUrl+"load-pic.png",
            this.picUrl+"logo.png",
            this.picUrl+"music_btn.png",
            this.picUrl+"over.png",
            this.picUrl+"over-noPay.jpg",
            this.picUrl+"over-pay.jpg",
            this.picUrl+"p1_pic01.png",
            this.picUrl+"p1_pic02.png",
            this.picUrl+"p1_pic03.png",
            this.picUrl+"p1_pic04.png",
            this.picUrl+"p1_pic05.png",
            this.picUrl+"p1_pic08.png",
            this.picUrl+"p1_pic09.png",
            this.picUrl+"p1_pic10.png",
            this.picUrl+"p1_pic11.png",
            this.picUrl+"p1_pic12.png",
            this.picUrl+"p1_pic13.png",
            this.picUrl+"p1_pic14.png",
            this.picUrl+"p1_pic15.png",
            this.picUrl+"p1_pic16.png",
            this.picUrl+"p1_pic17.png",
            this.picUrl+"p1_pic18.png",
            this.picUrl+"p1_pic18.png",
            this.picUrl+"p1_pic19.png",
            this.picUrl+"p1_pic20.png",
            this.picUrl+"p1_pic21.png",
            this.picUrl+"p1_pic22.png",
            this.picUrl+"p1_pic23.png",
            this.picUrl+"p1_pic24.png",
            this.picUrl+"p1_pic25.png",
            this.picUrl+"p1_pic26.png",
            this.picUrl+"p1_pic27.png",
            this.picUrl+"p1_pic28.png",
            this.picUrl+"p1_pic29.png",
            this.picUrl+"p1_pic30.png",
            this.picUrl+"p2_pic01.png",
            this.picUrl+"p2_pic02.png",
            this.picUrl+"p2_pic03.png",
            this.picUrl+"p2_pic04.png",
            this.picUrl+"p2_pic05.png",
            this.picUrl+"p2_pic06.png",
            this.picUrl+"p2_pic07.png",
            this.picUrl+"p2_pic08.png",
            this.picUrl+"p2_pic09.png",
            this.picUrl+"p2_pic10.png",
            this.picUrl+"p2_pic11.png",
            this.picUrl+"p2_pic12.png",
            this.picUrl+"p2_pic13.png",
            this.picUrl+"p3.0_png1.png",
            this.picUrl+"p3.0_png2.png",
            this.picUrl+"p3.0_png3.png",
            this.picUrl+"p3.0_png4.png",
            this.picUrl+"p3.0_png5.png",
            this.picUrl+"p3_pic01.png",
            this.picUrl+"p3_pic02.png",
            this.picUrl+"p3_pic03.png",
            this.picUrl+"p3_pic04.png",
            this.picUrl+"p3_pic05.png",
            this.picUrl+"p3_pic06.png",
            this.picUrl+"p3_pic07.png",
            this.picUrl+"p3_pic08.png",
            this.picUrl+"p3_pic09.png",
            this.picUrl+"p3_pic10.png",
            this.picUrl+"p3_pic11.png",
            this.picUrl+"p3_pic12.png",
            this.picUrl+"p3_pic13.png",
            this.picUrl+"p3_pic14.png",
            this.picUrl+"p3_pic15.png",
            this.picUrl+"p3_pic16.png",
            this.picUrl+"p3_pic17.png",
            this.picUrl+"p3_pic18.png",
            this.picUrl+"p3_pic19.png",
            this.picUrl+"p3_pic20.png",
            this.picUrl+"p3_pic21.png",
            this.picUrl+"p3_pic22.png",
            this.picUrl+"p4_pic01.png",
            this.picUrl+"p4_pic02.png",
            this.picUrl+"p4_pic03.png",
            this.picUrl+"p4_pic04.png",
            this.picUrl+"p4_pic05.png",
            this.picUrl+"p4_pic06.png",
            this.picUrl+"p4_pic07.png",
            this.picUrl+"p4_pic08.png",
            this.picUrl+"p4_pic09.png",
            this.picUrl+"p4_pic10.png",
            this.picUrl+"p4_pic11.png",
            this.picUrl+"p4_pic12.png",
            this.picUrl+"p4_pic13.png",
            this.picUrl+"p4_pic14.png",
            this.picUrl+"p4_pic15.png",
            this.picUrl+"p4_pic16.png",
            this.picUrl+"p4_pic17.png",
            this.picUrl+"p4_pic18.png",
            this.picUrl+"p4_pic19.png",
            this.picUrl+"p4_pic20.png",
            this.picUrl+"p4_pic21.png",
            this.picUrl+"p4_pic22.png",
            this.picUrl+"p4_pic23.png",
            this.picUrl+"p4_pic24.png",
            this.picUrl+"p4_pic25.png",
            this.picUrl+"p4_pic26.png",
            this.picUrl+"p4_pic27.png",
            this.picUrl+"p4_pic28.png",
            this.picUrl+"p4_pic29.png",
            this.picUrl+"p4_pic30.png",
            this.picUrl+"p4_pic31.png",
            this.picUrl+"p4_pic32.png",
            this.picUrl+"p4_pic33.png",
            this.picUrl+"p4_pic34.png",
            this.picUrl+"p4_pic35.png",
            this.picUrl+"p4_pic36.png",
            this.picUrl+"p4_pic37.png",
            this.picUrl+"phone.png",
            this.picUrl+"rule_btn.png",
            this.picUrl+"tip.png",
            this.picUrl+"weile.png",

        ];
        this.init();
    };
    main.prototype = {
        init:function(){
            this.isEnd = $("#is_end").val();
            this.havePay = $("#havePay").val();
            this.isVip = $("#is_vip").val();
            this.guanzhu = $("#have_guanzhu").val();
            this.FromTuiSong = $("#FromTuiSong").val();
            this.prizeType = $("#FromTuiSong").val();

            ///////////////////套后台后可删除///////////////////
            this.isEnd = !!Number(this.isEnd);
            this.havePay = !!Number(this.havePay);
            this.isVip = !!Number(this.isVip);
            this.guanzhu = !!Number(this.guanzhu);
            this.FromTuiSong = !!Number(this.FromTuiSong);
            ///////////////////套后台后可删除///////////////////
        },
        start:function(){
            Utils.preloadImage(this.ImageList,this.startCallback.bind(this),true);
        },
        startCallback:function(){

            ///////////////活动结束///////////////
            if(this.isEnd){
                if(this.havePay){//已经参与过活动
                    this.pend_pay();
                    return;
                }
                if(!this.havePay){//如果没参与过活动
                    this.pend_noPay();
                    return;
                }
            }
            ///////////////活动结束///////////////

            ///////////////活动未结束///////////////
            this.top();
            this.loadleave();
            if(!this.guanzhu){//未关注公众号
                this.pcode();
                return;
            }
            if(this.havePay){//已经支付过
                $(".has").removeClass("none");
                this.pact();
                return;
            }
            $(".havent").removeClass("none");
            this.p1();
            ///////////////活动未结束///////////////
        },
        top:function(){
            $(".music-btn,.rule-btn").removeClass("none");
        },
        loadleave:function(){
            $(".P_loading").fadeOut();
        },
        p1:function(){
            $(".P1").fadeIn();
        },
        p1leave:function(){
            $(".P1").fadeOut();
        },
        pvip1:function(){
            $(".P_Vip1").fadeIn(function(){
                $(".select-ban").addClass("none");
            });
        },
        pvip1leave:function(){
            $(".P_Vip1").fadeOut();
        },
        pvip2:function(){
            $(".P_Vip2").fadeIn();
        },
        pvip2leave:function(){
            $(".P_Vip2").fadeOut();
        },
        pnotvip:function(){},
        pnotvipleave:function(){},
        pchaxun:function(){
            $(".P_chaxun").fadeIn();
        },
        pchaxunleave:function(){
            $(".P_chaxun").fadeOut();
        },
        pact_mask:function(){
            $(".P_mask").fadeIn();
        },
        pact_maskleave:function(){
            $(".P_mask").fadeOut();
        },
        pact:function(){
            $(".P_active").fadeIn();
        },
        pactleave:function(){
            $(".P_active").fadeOut();
        },
        plist:function(){
            $(".P_List").fadeIn();
        },
        plistleave:function(){
            $(".P_List").fadeOut();
        },
        pend_pay:function(){
            $(".P_end-Pay").fadeIn();
        },
        pend_noPay:function(){
            $(".P_end-noPay").fadeIn();
        },
        pcode:function(){
            $(".P_code").fadeIn();
        },
        addEvent:function(){
            var _self = this;
            /////////p1//////////
            $(".p1-point").on("touchend",function(){
                _self.p1leave();
                if(_self.isVip){
                    _self.pvip1();
                    return;
                }
                _self.pnotvip();
            });
            /////////p1//////////

            /////////vip1//////////
            $(".vip-point").on("touchend",function(){
                _self.pvip1leave();
                _self.pvip2();
            });
            /////////vip1//////////

            /////////vip2//////////
            $(".P_Vip2").on({
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
                        _self.pvip2leave();
                        _self.pact_mask();
                        _self.pact();

                    }
                }
            });
            /////////vip2//////////

            /////////pmask//////////
            $(".mask-point").on("touchend",function(){
                _self.pact_maskleave();
            });
            /////////pmask//////////

            /////////pact//////////
            $(".go-btn").on("touchend",function(){
               window.location.href = "game.html"
            });
            $(".chaxun-btn").on("touchend",function(){
                
                _self.pactleave();
                _self.pchaxun();
            });
            $(".travel-list-btn").on("touchend",function(){
                _self.pactleave();
                _self.plist();
            });
            /////////pact//////////

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
        },
    };
    window.main = main;
/*-----------------------------事件绑定--------------------------------*/
}(window);
$(function(){
    var Main = new main();
    Main.addEvent();
    Main.start();

    /////////测试输出/////////
    window.test = Main;
    console.log(test)
    /////////测试输出/////////

    // var main = output.main,
    //     media = output.media,
    //     utils = output.utils;
    // media.WxMediaInit();
    // utils.E(window,"touchstart",function(){media.MutedPlay("video");console.log(1)})
});
window.onload = function(){




};


