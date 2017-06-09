/**
 * Created by zuo on 2017/5/6.
 */
(function ($) {
    class Drag {
        // element 要传入的是jq对象
        dragInit(element) {
            this.element = element;

            this.element.on('mousedown', '.dialog-drag', this.downFn.bind(this))
        }

        downFn(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            // this -> 实例
            this.disX = ev.pageX - this.element.offset().left;
            this.disY = ev.pageY - this.element.offset().top;

            $(document).on('mousemove', this.moveFn.bind(this))
            $(document).on('mouseup', this.upFn.bind(this))
            console.log('anxiale')
            //发布事件
            // this.element.trigger("down");
        }

        moveFn(ev) {
            this.limit(ev)
            this.element.css({
                left: this.Left,
                top: this.top
            });

            // this.element.trigger("move");
        }

        upFn() {
            $(document).off('mousemove mouseup');
            this.element.trigger("up");
        }

        limit(ev) {
            this.Left = ev.pageX - this.disX;
            this.top = ev.pageY - this.disY;
            if (this.Left < 0) this.Left = 0;
            if (this.top < 0) this.top = 0;
            if (this.Left > $(window).width() - this.element.width()) {
                this.Left = $(window).width() - this.element.width()
            }
        }
    }

    $.Drag = Drag;

})(jQuery);
