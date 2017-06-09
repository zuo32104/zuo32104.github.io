/**
 * Created by zuo on 2017/4/22.
 */
;(function ($) {
    class yunFolder {
        //取消状态
        cancelStatus(obj) {

        }

        isNewFolder() {
            if (oStatus) {
                oStatus.focus();
                return true;
            }
            return false;
        }

        //名字重复后加后缀
        newFolderName(eles, name) {
            let re2 = /\(\d+\)$/;
            let gz = '^' + name.replace(re2, function ($0, $1, $2) {
                    return $0.replace(/^\(|\)$/g, function ($0) {
                        return '\\' + $0;
                    })
                }) + '$';
            let re1 = new RegExp(gz);
            for (let i = 0, len = eles.length; i < len; i++) {
                if (re1.test(eles[i].name || eles[i])) {
                    if (re2.test(name)) {
                        let newN = name.replace(re2, function ($0) {
                            return $0.replace(/\d+/, function ($0) {
                                return $0 * 1 + 1
                            })
                        });
                        name = this.newFolderName(eles, newN);
                    } else {
                        name = this.newFolderName(eles, name + '(1)');
                    }
                    break;
                }
            }
            return name;
        }

        //判断名字是否重复
        isNameRepetition(childs, name) {
            let isRepetition = false;
            for (let i = 0, len = childs.length; i < len; i++) {
                if (childs[i].name === name) {
                    isRepetition = true;
                    break;
                }
            }
            return isRepetition;
        }

        //缩略图视图重新渲染
        RenderingFolder(childs, type, width) {
            var n = Math.floor(width / 128);
            var arr = [];
            let dd = null;
            if (type === 'newFolder') {
                for (let i = 0, len = childs.length; i < len; i++) {
                    if (i % (i === 0 ? n - 1 : n) === 0) {
                        dd = document.createElement('dd');
                        arr.push(dd);
                    }
                    childs.eq(0).css({'margin-left': 130});
                    childs.eq(i).appendTo(dd);
                }
            } else {
                for (let i = 0, len = childs.length; i < len; i++) {
                    if (i % n === 0) {
                        dd = document.createElement('dd');
                        arr.push(dd);
                    }
                    childs.eq(0).css({'margin-left': 6});
                    childs.eq(i).appendTo(dd);
                }
            }
            return arr;
        }

        //时间戳 格式化 日期
        format(shijianchuo) {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
        }

        add0(num) {
            return num < 10 ? '0' + num : '' + num;
        }

        //判断大小 大于1024 添加M
        fileSize(num) {
            return num > 1024 ? Number.parseFloat(Number.parseFloat(num).toFixed(1)) + 'M' : num + 'KB';
        }

        //--------碰撞检测---------------------
        duang(current, target) {
            let curTop = this.rect(current, 'top'), curRight = this.rect(current, 'right'),
                curBottom = this.rect(current, 'bottom'), curLeft = this.rect(current, 'left');
            let tarTop = this.rect(target, 'top'), tarRight = this.rect(target, 'right'),
                tarBottom = this.rect(target, 'bottom'), tarLeft = this.rect(target, 'left');
            if (curTop < tarBottom && curRight > tarLeft && curBottom > tarTop && curLeft < tarRight) {
                return true;
            }
            return false;
        };

        //--------获取元素的位置-------------
        rect(obj, type) {
            let num = obj.getBoundingClientRect();
            switch (type) {
                case 'top':
                    return num.top;
                    break;
                case 'right':
                    return num.right;
                    break;
                case 'bottom':
                    return num.bottom;
                    break;
                case 'left':
                    return num.left;
                    break;
            }
        };


    }
    $.yunTool = new yunFolder();
    $.fn.yunTool = new yunFolder();

})(jQuery)


