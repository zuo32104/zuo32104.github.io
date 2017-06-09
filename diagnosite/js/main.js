var diag = {};


diag.init = function () {

    diag.timeScroll = null;

    diag.currentStep = 'step1';

    diag.resize(); //设置每一屏的高度和top值

    diag.events();//配置事件

    $('body').height(8500);

    diag.configIntAnimate();//配置导航栏

    diag.button3D('.start', '.state1', '.state2', 0.3);//导航栏里面的button
    diag.button3D(".button1", ".state1", ".state2", 0.3);
    diag.button3D(".button2", ".state1", ".state2", 0.3);

    //设置每一屏中img的百分比
    diag.imgWidth($(".scene img"));

    diag.configTimeScroll(); //全屏的动画滚动

    twoAnimate.init();//第二屏里面的小动画

    threeAnimate.init();//第三屏里面的小动画

    fiveAnimate.init();//第五屏里面的小动画


}

$(document).ready(diag.init);

//切换整屏并且计算滚动条滚动的距离
diag.changeStep = function (value) {
    if (value === 'next') {
        // console.log('next')
        //当前的时间
        var currentTime = diag.timeScroll.getLabelTime(diag.currentStep);
        //获取下一个状态
        var afterStep = diag.timeScroll.getLabelAfter(currentTime);

        if (!afterStep) return;
        diag.fnScrollMove(afterStep)
    } else {
        // console.log('prve')
        //当前的时间
        var currentTime = diag.timeScroll.getLabelTime(diag.currentStep);
        //获取下一个状态
        var beforeStep = diag.timeScroll.getLabelBefore(currentTime);
        if (!beforeStep) return;
        diag.fnScrollMove(beforeStep)
    }

}

//滚动条滚动同步事件
diag.fnScrollMove = function (step) {
    //获取总的时长
    var totalTime = diag.timeScroll.totalDuration();
    //获取下一个状态的时间
    var currentTypeTime = diag.timeScroll.getLabelTime(step);
    //获取滚动条滚动的最大距离
    var MaxH = $('body').height() - $(window).height();

    //计算出滚动条滚动的距离
    var positionY = currentTypeTime / totalTime * MaxH;

    var d = Math.abs(diag.timeScroll.time() - currentTypeTime)
    var scrollAnimate = new TimelineMax();
    scrollAnimate.to('html,body', d, {scrollTop: positionY})
    // //运动到下一个状态
    // diag.timeScroll.tweenTo(step);
    //记录下一个状态
    diag.currentStep = step;
}

//配置整屏切换
diag.configTimeScroll = function () {

    var time = diag.timeScroll ? diag.timeScroll.time() : 0;
    if (diag.timeScroll) {
        console.log('qingchu')
        diag.timeScroll.clear();
    }
    diag.timeScroll = new TimelineMax();

    //第二屏切换到第一屏的时候 叫第二屏里面的时间为0
    diag.timeScroll.to('.scene1', 0, {
        onReverseComplete: function () {
            twoAnimate.timeline.seek(0, false);
        }
    })
    diag.timeScroll.add('step1');
    //第二屏
    diag.timeScroll.to('.scene2', 0.8, {top: 0, ease: Cubic.easeInOut});
    diag.timeScroll.to({}, 0.1, {
        onComplete: function () {
            menu.changeMenu("menu_state2");
        }, onReverseComplete: function () {
            menu.changeMenu("menu_state1");
        }
    }, '-=0.2');
    //切换到第二屏上的时候,翻转第二屏
    diag.timeScroll.to({}, 0, {
        onComplete: function () {
            twoAnimate.timeline.tweenTo('state1')
        }
    }, '-=0.2')
    diag.timeScroll.add('step2');

    //第二瓶小动画
    diag.timeScroll.to({}, 0, {
        onComplete: function () {
            twoAnimate.timeline.tweenTo("state2");
        }, onReverseComplete: function () {
            twoAnimate.timeline.tweenTo("state1");
        }
    });
    diag.timeScroll.to({}, 0.4, {});

    diag.timeScroll.add("point1");

    diag.timeScroll.to({}, 0, {
        onComplete: function () {
            twoAnimate.timeline.tweenTo("state3");
        }, onReverseComplete: function () {
            twoAnimate.timeline.tweenTo("state2");
        }
    });
    diag.timeScroll.to({}, 0.4, {});
    diag.timeScroll.add("point2");

    diag.timeScroll.to({}, 0, {
        onComplete: function () {
            twoAnimate.timeline.tweenTo("state4");
        }, onReverseComplete: function () {
            twoAnimate.timeline.tweenTo("state3");
        }
    });
    diag.timeScroll.to({}, 0.4, {});
    diag.timeScroll.add("point3");

    //第三屏
    diag.timeScroll.to('.scene3', 0.8, {
        top: 0,
        ease: Cubic.easeInOut,
        onReverseComplete: function () {
            threeAnimate.timeline.seek(0, false)
        }
    });
    diag.timeScroll.to({}, 0.1, {
        onComplete: function () {
            menu.changeMenu("menu_state3");
        }, onReverseComplete: function () {
            menu.changeMenu("menu_state2");
        }
    }, '-=0.2');
    diag.timeScroll.to({}, 0.1, {
        onComplete: function () {
            threeAnimate.timeline.tweenTo("threeSate1");
        }
    }, '-=0.2')

    diag.timeScroll.add('step3');
    //配置第三屏小动画
    diag.timeScroll.to({}, 0, {
        onComplete: function () {
            threeAnimate.timeline.tweenTo("threeSate2");
        }, onReverseComplete: function () {
            threeAnimate.timeline.tweenTo("threeSate1");
        }
    });

    diag.timeScroll.to({}, 0.4, {});
    diag.timeScroll.add("threeSate");

    // 主动画中配置第三屏的小动画 end


    diag.timeScroll.to('.scene4', 0.8, {top: 0, ease: Cubic.easeInOut});
    //当可视区域大于950，那么就让导航条隐藏起来


    diag.timeScroll.to(".menu_wrapper", 0.8, {top: -110, ease: Cubic.easeInOut}, "-=0.8");

    $(".menu_wrapper").css("top", 0);

    // diag.timeScroll.to(".menu_wrapper", 0.8, {top: -110, ease: Cubic.easeInOut}, "-=0.8");
    diag.timeScroll.add('step4');
    //滚动到第五屏的时候，要让第四屏滚出屏幕外

    diag.timeScroll.to(".scene4", 0.8, {top: -$(window).height(), ease: Cubic.easeInOut});
    diag.timeScroll.to('.scene5', 0.8, {
        top: 0,
        ease: Cubic.easeInOut, onReverseComplete: function () {
            fiveAnimate.timeline.seek(0, false)
        }
    }, '-=0.8');
    diag.timeScroll.to({}, 0.1, {
        onComplete: function () {
            fiveAnimate.timeline.tweenTo('fiveState')
        }
    }, '-=0.2')
    diag.timeScroll.add('step5');

    diag.timeScroll.to(".scene5", 0.5, {top: -$(".footer").height(), ease: Cubic.easeInOut});
    diag.timeScroll.to(".footer", 0.5, {
        top: $(window).height() - $(".footer").height(),
        ease: Cubic.easeInOut
    }, "-=0.5");

    diag.timeScroll.add("footer");
    diag.timeScroll.stop()

    diag.timeScroll.seek(time)
}

//导航条中的动画
diag.nav = function () {
    var navAnimete = new TimelineMax()
    $('.nav a').on('mouseenter', function () {
        var w = $(this).width();
        var l = $(this).offset().left;
        navAnimete.clear();
        navAnimete.to('.line', 0.4, {opacity: 1, left: l, width: w})
    });

    $('.nav a').on('mouseleave', function () {
        navAnimete.clear();
        navAnimete.to('.line', 0.4, {opacity: 0})
    })

    //language显示
    var languageAnimate = new TimelineMax();

    $('.language').on('mouseenter', function () {
        languageAnimate.clear();
        languageAnimate.to('.dropdown', 0.5, {opacity: 1, 'display': 'block'})
    })

    $('.language').on('mouseleave', function () {
        languageAnimate.clear();
        languageAnimate.to('.dropdown', 0.5, {opacity: 0, 'display': 'none'})
    })

    //左侧导航栏

    $('.btn_mobile').click(function () {
        var m_animete = new TimelineMax();
        m_animete.to('.left_nav', 0.5, {left: 0})
    })

    $('.l_close').click(function () {
        var l_animate = new TimelineMax();
        l_animate.to('.left_nav', 0.5, {left: -300})
    })

};

//3d翻转
diag.button3D = function (obj, element1, element2, d) {
    var button3DAnimate = new TimelineMax();
    button3DAnimate.to($(obj).find(element1), 0, {
        rotationX: 0,
        transformPerspective: 600,
        transformOrigin: 'center bottom'
    })
    button3DAnimate.to($(obj).find(element2), 0, {
        rotationX: -90,
        transformPerspective: 600,
        transformOrigin: 'top center'
    })

    $(obj).on('mouseenter', function () {
        var enterAnimete = new TimelineMax();
        var ele1 = $(this).find(element1);
        var ele2 = $(this).find(element2);

        enterAnimete.to(ele1, d, {rotationX: 90, top: -ele1.height(), ease: Cubic.easeInOut}, 0)
        enterAnimete.to(ele2, d, {rotationX: 0, top: 0, ease: Cubic.easeInOut}, 0)
    })

    $(obj).on('mouseleave', function () {
        var leaveAnimate = new TimelineMax();
        var ele1 = $(this).find(element1);
        var ele2 = $(this).find(element2);
        leaveAnimate.to(ele1, d, {rotationX: 0, top: 0, ease: Cubic.easeInOut}, 0)
        leaveAnimate.to(ele2, d, {rotationX: -90, top: ele2.height(), ease: Cubic.easeInOut}, 0)
    })


}

//配置导航栏动画
diag.configIntAnimate = function () {

    var iAnimate = new TimelineMax();

    iAnimate.to('.menu', 0.5, {opacity: 1})
    iAnimate.to('.menu', 0.5, {left: 22}, '-=0.3')
    iAnimate.to('.nav', 0.5, {opacity: 1})

    /*首屏动画*/
    iAnimate.to('.scene1_logo', 0.5, {opacity: 1})
    iAnimate.staggerTo('.scene1_1 img', 2, {opacity: 1, rotationX: 0, ease: Bounce.easeOut}, 0.2)
    iAnimate.to('.light_left', 0.7, {rotationZ: 0, dase: Expo.easeOut}, '-=2')
    iAnimate.to('.light_right', 0.7, {rotationZ: 0, dase: Expo.easeOut}, '-=2')
    iAnimate.to('.controls', 0.5, {bottom: 20, opacity: 1}, '-=0.7');

    iAnimate.to('body', 0, {'overflow-y': 'scroll'});
};


//设置一些事件
diag.events = function () {

    $(window).resize(diag.resize);
    diag.nav(); //导航条的鼠标移入的动画

    diag.events1();

}

diag.events1 = function () {





    //禁止滚轮的默认行为

    if (!$._data($('.wrapper')[0], "events")) {

        $(window).on('scroll', fnScroll);//刷新也面后防止记录滚动条的位置
        function fnScroll() {
            $(window).scrollTop(0)
        }

        //滚动条滚动的过程中,计算页面到哪一个页面
        $(window).on('scroll', diag.scrollStatus)


        $(window).on('mousedown', function () {
            $(window).off('scroll', fnScroll);
        })

        //当mouseup的时候,让当前这一屏到达某个状态


        $(window).on('mouseup', diag.mouseupfn)
        $('.wrapper').on('mousewheel', function (ev) {
            ev.preventDefault();
        })

        $('.wrapper').one('mousewheel', mousewheelfn)
        function mousewheelfn(ev, direction) {
            $(window).off('scroll', fnScroll);
            if (direction < 1) {//向下滚动
                diag.changeStep('next');
            } else {//向上滚动
                diag.changeStep('prev');
            }
            mousewheelfn.timer = mousewheelfn.timer || null;
            clearTimeout(mousewheelfn.timer);
            mousewheelfn.timer = setTimeout(function () {
                $('.wrapper').one('mousewheel', mousewheelfn);
            }, 1200)
        }
    }
}

//
diag.mouseupfn = function () {
    var scale = diag.scale();//滚动过程中的比例
    var times = scale * diag.timeScroll.totalDuration();//计算出滚动条位置的当前时间

    var prevStep = diag.timeScroll.getLabelBefore(times);//上一个状态
    var nextStep = diag.timeScroll.getLabelAfter(times);//下一个状态

    var prevTime = diag.timeScroll.getLabelTime(prevStep);//上一个时间
    var nextTime = diag.timeScroll.getLabelTime(nextStep);//下一个时间

    //计算差值
    var prevDvalue = Math.abs(prevTime - times);
    var nextDvalue = Math.abs(nextTime - times);

    var step = '';
    if (scale === 0) {
        step = 'step1'
    } else if (scale === 1) {
        step = 'footer'
    } else if (prevDvalue < nextDvalue) {
        step = prevStep
    } else {
        step = nextStep
    }

    //diag.timeScroll.tweenTo(step);
    //--鼠标松开的时候滚动条的位置------------------------------------------------
    diag.fnScrollMove(step)

}


//计算出当前滚动条top在总的高度里面的比例
diag.scale = function () {
    var scrollT = $(window).scrollTop();
    var MaxH = $('body').height() - $(window).height();
    var s = scrollT / MaxH;
    return s;
}

//滚动条滚动中,叫页面中的动画打到某个时间点上
diag.scrollStatus = function () {
    var times = diag.scale() * diag.timeScroll.totalDuration();

    diag.timeScroll.seek(times, false)
}


//设置每一屏的高度
diag.resize = function () {
    $('.scene').height($(window).height());
    $('.scene:not(":first")').css('top', $(window).height());

    diag.configTimeScroll();

    if ($(window).width() <= 780) {
        $('.wrapper').off();
        $(window).off('mousewheel');
        $(window).off('scroll');
        $(window).off('mousedown');
        $(window).off('mouseup');
        $('body').css('height', 'auto');
        $('body').addClass('r780 r950').css('overflow-y', 'scroll');

        $('.menu').css('top', 0);
        $('.menu').css('transform', 'none');
        $('.menu_wrapper').css('top', 0);

        $(".menu").removeClass("menu_state2");
        $(".menu").removeClass("menu_state3");

    } else if ($(window).width() <= 950) {
        $("body").css("height", 8500);
        $('body').removeClass('r780').addClass('r950');
        $('.menu').css('top', 0);
        $('.menu').css('transform', 'none');
        diag.events1();
    } else {
        $('body').removeClass('r780 r950');
        $('body').css('height', 8500);
        $('.menu').css('top', 22);
        $("body").removeClass("r950");
        $('.left_nav').css('left', -300);
        diag.events1();
    }

}


//导航条3d翻转
var menu = {};

menu.changeMenu = function (stateClass) {
    console.log(stateClass)
    var oldMenu = $('.menu');
    var newMenu = oldMenu.clone();
    newMenu.removeClass('menu_state1').removeClass('menu_state2').removeClass('menu_state3');
    newMenu.addClass(stateClass);
    $('.menu_wrapper').append(newMenu);
    oldMenu.addClass('removeClass');

    //克隆的添加事件
    diag.nav();
    diag.button3D(".start", ".state1", ".state2", 0.3);

    var menuAnimate = new TimelineMax();
    if ($(window).width() > 950) {
        menuAnimate.to(newMenu, 0, {top: 100, rotationX: -90, transformPerspective: 600, transformOrigin: 'top center'})
        menuAnimate.to(oldMenu, 0, {top: 22, rotationX: 0, transformPerspective: 600, transformOrigin: 'center bottom'})

        menuAnimate.to(oldMenu, 0.3, {
            rotationX: 90, top: -55, ease: Cubic.easeInOut, onComplete: function () {
                $('.removeClass').remove();
            }
        })
        menuAnimate.to(newMenu, 0.3, {rotationX: 0, top: 22, ease: Cubic.easeInOut}, '-=0.3')
    }
}

//第二屏里面小动画
var twoAnimate = {}

twoAnimate.timeline = new TimelineMax();
twoAnimate.init = function () {
    twoAnimate.timeline.staggerTo('.scene2_1 img', 1.5, {opacity: 1, rotationX: 0, ease: Elastic.easeOut}, 0.1)
    twoAnimate.timeline.to('.points', 0.2, {bottom: 20}, '-=1');


    twoAnimate.timeline.to(".scene2 .point0 .text", 0.1, {opacity: 1});
    twoAnimate.timeline.to(".scene2 .point0 .point_icon", 0, {"background-position": "right top"});

    //第一个
    twoAnimate.timeline.add('state1');

    twoAnimate.timeline.staggerTo(".scene2_1 img", 0.2, {opacity: 0, rotationX: 90}, 0);

    twoAnimate.timeline.to(".scene2_2 .left", 0.4, {opacity: 1});
    twoAnimate.timeline.staggerTo(".scene2_2 .right img", 0.3, {
        opacity: 1,
        rotationX: 0,
        ease: Cubic.easeInOut
    }, 0, "-=0.4");


    twoAnimate.timeline.to(".scene2 .point .text", 0, {opacity: 0}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point1 .text", 0.1, {opacity: 1});
    twoAnimate.timeline.to(".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point1 .point_icon", 0, {"background-position": "right top"}, "-=0.4");

    //第二个
    twoAnimate.timeline.add('state2');

    twoAnimate.timeline.to('.scene2_2 .left', 0.4, {opacity: 0})
    twoAnimate.timeline.staggerTo('.scene2_2 .right img', 0.3, {
        opacity: 0,
        rotationX: 90,
        ease: Cubic.easeInOut
    }, 0, '-=0.4')
    twoAnimate.timeline.to('.scene2_3 .left', 0.4, {opacity: 1})
    twoAnimate.timeline.staggerTo('.scene2_3 .right img', 0.3, {
        opacity: 1,
        rotationX: 0,
        ease: Cubic.easeInOut
    }, 0, '-=0.4')


    twoAnimate.timeline.to(".scene2 .point .text", 0, {opacity: 0}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point2 .text", 0.1, {opacity: 1});
    twoAnimate.timeline.to(".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point2 .point_icon", 0, {"background-position": "right top"}, "-=0.4");

    //第三个
    twoAnimate.timeline.add('state3')

    twoAnimate.timeline.to('.scene2_3 .left', 0.4, {opacity: 0})
    twoAnimate.timeline.staggerTo('.scene2_3 .right img', 0.3, {
        opacity: 0,
        rotationX: 90,
        ease: Cubic.easeInOut
    }, 0, '-=0.4')
    twoAnimate.timeline.to('.scene2_4 .left', 0.4, {opacity: 1})
    twoAnimate.timeline.staggerTo('.scene2_4 .right img', 0.3, {
        opacity: 1,
        rotationX: 0,
        ease: Cubic.easeInOut
    }, 0, '-=0.4');

    twoAnimate.timeline.to(".scene2 .point .text", 0, {opacity: 0}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point3 .text", 0.1, {opacity: 1});
    twoAnimate.timeline.to(".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4");
    twoAnimate.timeline.to(".scene2 .point3 .point_icon", 0, {"background-position": "right top"}, "-=0.4");
    //第四个
    twoAnimate.timeline.add('state4');

    twoAnimate.timeline.stop();
}

//第三屏里面小动画
var threeAnimate = {};
threeAnimate.timeline = new TimelineMax();

threeAnimate.init = function () {
    //第三屏里面所有图片翻转90度,透明度为0
    threeAnimate.timeline.to('.scene3 .step img', 0, {
        rotationX: -90,
        opacity: 0,
        transformPerspective: 600,
        transformOrigin: 'center center'
    })
    threeAnimate.timeline.staggerTo('.step3_1 img', 0.2, {opacity: 1, rotationX: 0, ease: Cubic.saseInOut}, 0.1)
    threeAnimate.timeline.add("threeSate1");
    threeAnimate.timeline.to('.step3_1 img', 0.3, {opacity: 0, rotationX: -90, ease: Cubic.easeInOut});
    threeAnimate.timeline.to('.step3_2 img', 0.3, {opacity: 1, rotationX: 0, ease: Cubic.easeInOut});
    threeAnimate.timeline.add('threeSate2');
    threeAnimate.timeline.stop();
}


//第五屏里面小动画

var fiveAnimate = {};

fiveAnimate.timeline = new TimelineMax();
fiveAnimate.init = function () {
    //把所有的图片和button翻转90度,透明度为0,scene5_img的top初始为-220
    fiveAnimate.timeline.to('.scene5 .area_content img, .scene5 .button1,.scene5 .button2', 0, {
        rotationX: -90,
        transformPerspective: 600,
        transformOrigin: "center center"
    });

    fiveAnimate.timeline.to('.scene5 .scene5_img', 0, {top: -220});
    fiveAnimate.timeline.to('.scene5 .scene5_img', 0.5, {top: 0, ease: Cubic.easeInOut});
    fiveAnimate.timeline.staggerTo('.scene5 .area_content img,.scene5 .button1,.scene5 .button2', 1.2, {
        rotationX: 0,
        opacity: 1,
        ease: Cubic.easeInOut
    }, 0.2)

    fiveAnimate.timeline.to('.scene5 .lines', 0.5, {opacity: 1});
    fiveAnimate.timeline.add('fiveState');
    fiveAnimate.timeline.stop();

}

//设置img的百分比

diag.imgWidth = function (elementImg) {
    elementImg.each(function () {
        var width = $(this).width();
        $(this).css({
            width: "100%",
            "max-width": width,
            height: "auto"
        })
    })
}