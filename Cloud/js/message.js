/**
 * Created by zuo on 2017/5/6.
 */
(function ($) {

    class Message extends $.Drag {
        constructor(options) {
            super();
            this.newOptions = {
                id: 'confirm',
                className: 'dialog dialog-confirm dialog-gray',
                style: {display: 'block', width: 400, visibility: 'visible', zIndex: 54},
                title: '删除文件',
                content: '<div style="text-align:center;padding:40px 22px 22px 22px;">确认要把所选文件删除吗？</div>',
                okValue: '确定',
                cancelValue: '取消',
                okFun: function () {
                    console.log('确定了')
                },
                cancelFun: function () {
                    console.log('取消了')
                    this.dialog.remove();
                    $('#module-shade').css({display:'none'});
                }
            }
            $.extend(true, this.newOptions, options);
            this._init(); //生成弹框之后

        }

        _init() {
            $('#module-shade').css({display:'block'});
            this.dialog = this._createDialog();
            this.dialogBody = this.dialog.find('.dialog-body');
            this.dialog.appendTo('body');
            this.dialog.css({
                top: ($(window).height() - this.dialog.height()) / 2,
                left: ($(window).width() - this.dialog.width()) / 2,
            });
            this._addEvent();
            this.dragInit(this.dialog);
        }

        // 组件的模板
        _html() {
            return `
                    <div class="dialog-header dialog-drag">
                        <h3>
                            <span class="dialog-header-title">
                                <em class="select-text">${this.newOptions.title}</em>
                            </span>
                        </h3>
                    </div>
                    <div class="dialog-body">
                        ${this.newOptions.content}
                    </div>
                    <div class="dialog-footer g-clearfix">
                        <a class="g-button g-button-blue-large" href="javascript:void(0);" style="padding-left: 50px;">
                            <span class="g-button-right" style="padding-right: 50px;">
                                <span class="text" style="width: auto;">
                                    ${this.newOptions.okValue}
                                </span>
                            </span>
                        </a>
                        <a class="g-button g-button-large" href="javascript:void(0);" style="padding-left: 50px;">
                            <span class="g-button-right" style="padding-right: 50px;">
                                <span class="text" style="width: auto;">
                                    ${this.newOptions.cancelValue}
                                </span>
                            </span>
                        </a>
                    </div>`
        }

        _createDialog() {
            var dialog = document.createElement('div');
            $(dialog).addClass(this.newOptions.className);
            $(dialog).attr('id', this.newOptions.id);
            $(dialog).css(this.newOptions.style);
            dialog.innerHTML = this._html();
            return $(dialog);
        }

        // 对弹框进行定位
        _positionDialog() {


        }

        _addEvent() {
            // this -> 实例
            this.dialog.find('.dialog-footer .g-button-blue-large').on('click', this.newOptions.okFun.bind(this));
            this.dialog.find('.dialog-footer .g-button-large').on('click', this.newOptions.cancelFun.bind(this));
        }

    }
    $.Message = function (options) {
       return new Message(options)
    };


})(jQuery)
