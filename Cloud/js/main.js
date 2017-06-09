/**
 * Created by zuo on 2017/4/22.
 */
//结构生成

//添加事件
;(function ($) {

    window.oGridView = $('.frame-main .grid-view-container .grid-view');//缩略图变量
    window.oListView = $('.frame-main .list-view-container .list-view');//列表变量
    window.oBreadCrumb = $('.frame-main .historylistmanager-history ');//面包屑

    window.oStatus = null;//新建文件夹或者重命名是的状态


    window.state = {
        displayMode: 'grid',
        arrangementMode: 'name'
    };

    window.oFrameMain = $('.frame-main');//右侧菜单

    let oFrameMainWidth = oFrameMain[0].offsetWidth;//右侧菜单的宽度

    //缩略图和列表切换 按钮
    let listSwitch = $('.frame-main .default-dom .list-switch');
    let gridSwitch = $('.frame-main .default-dom .grid-switch');
    // 文件模式-下面
    let viewContainerType = $('#view-container-type');
    let gridViewContainer = $('.grid-view-container');
    let listviewContainer = $('.list-view-container');


    //导航栏 模式信息
    let gridCols = $('.module-list .list-view-header .grid-cols');
    let listCols = $('.module-list .list-view-header .list-cols');

    //切换缩略图或者列表
    listSwitch.on('click', fnTabTypeFolder);
    gridSwitch.on('click', fnTabTypeFolder);
    function fnTabTypeFolder(type) {
        if (type === 'grid') {
            listSwitch.removeClass('show');
            gridSwitch.addClass('show');
            gridViewContainer.addClass('show');
            listviewContainer.removeClass('show');
            $('.module-list .grid-cols').addClass('show');
            $('.module-list .list-cols').removeClass('show');
            state.displayMode = 'grid';
            return;
        }

        if (type === 'list') {
            listSwitch.addClass('show');
            gridSwitch.removeClass('show');
            gridViewContainer.removeClass('show');
            listviewContainer.addClass('show');
            $('.module-list .grid-cols').removeClass('show');
            $('.module-list .list-cols').addClass('show');
            state.displayMode = 'list';
            return;
        }

        listSwitch.toggleClass('show');
        gridSwitch.toggleClass('show');
        gridViewContainer.toggleClass('show');
        listviewContainer.toggleClass('show');
        $('.module-list .grid-cols').toggleClass('show');
        $('.module-list .list-cols').toggleClass('show');
        state.displayMode = !gridSwitch.hasClass('show') ? 'grid' : 'list';
    }

    //------------------------------------------------------------------------------------
    //文件夹选中事件委托
    gridViewContainer.on('click', '.checkgridsmall', fnFolderChecked);
    listviewContainer.on('click', 'dd', fnFolderChecked);
    //文件夹选中关联
    function fnFolderChecked(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        //文件夹子集
        let folderChilds = fnFolderCheckedChilds();
        //获取到文件
        let parent = $(this).is('span') ? $(this).parent().parent() : $(this);
        let _position = parent.attr('_position');
        let isType = !folderChilds[0].eq(_position).hasClass('item-active') ? 'addClass' : 'removeClass';
        folderChilds[0].eq(_position)[isType]('item-active');
        folderChilds[1].eq(_position)[isType]('item-active');
        let isAll = fnIsAllchecked(folderChilds[0]) ? 'addClass' : 'removeClass';
        $('.check-icon')[isAll]('all-folder');
        fnFolderCheckedInfo()//选中信息
    }

    //全选文件夹
    $('.frame-main .grid-cols .check-icon').on('click', fnFolderAllChecked);
    $('.frame-main .list-cols .check-icon').on('click', fnFolderAllChecked);

    //缩略图新建文件夹
    let moduleEdite = $('.module-edit-name');

    function fnFolderAllChecked() {

        if (!$(this).hasClass('all-folder')) {
            $('.check-icon').addClass('all-folder');
        } else {
            $('.check-icon').removeClass('all-folder');
        }
        fnAllChecked(this);
        fnFolderCheckedInfo()//选中信息
    }

    //全选或全不选
    function fnAllChecked(obj) {
        let folderChilds = fnFolderCheckedChilds();
        let isAll = '';
        if ($(obj).hasClass('all-folder')) {
            isAll = 'addClass';
        } else {
            isAll = 'removeClass';
        }
        for (let i = 0, len = folderChilds[0].length; i < len; i++) {
            folderChilds[0].eq(i)[isAll]('item-active');
            folderChilds[1].eq(i)[isAll]('item-active');
        }
        fnFolderCheckedInfo()
    }

    //判断是否全选
    function fnIsAllchecked(obj) {
        return obj.length === obj.filter(function (index, item) {
                return $(item).hasClass('item-active');
            }).length;
    }

    //判断选中的是几个
    function fnFolderCheckedNum(obj) {
        return obj.filter(function (index, item) {
            return $(item).hasClass('item-active');
        }).length;
    }

    //全选或者选中的时候显示
    function fnFolderCheckedInfo() {
        //文件夹子集
        let folderChilds = fnFolderCheckedChilds();
        let checkedNum = fnFolderCheckedNum(folderChilds[0]);
        fnRenameState(checkedNum)//重名状态
        let listViewHeader = $('.frame-main .list-view-header');
        let ischeckedInfo = checkedNum !== 0 ? 'addClass' : 'removeClass';
        listViewHeader[ischeckedInfo]('list-header-operatearea');
        listViewHeader.find('.list-header .list-header-operatearea').html(`已选中${checkedNum}个文件/文件夹`)
    }


    //获取当前视图的childs文件
    function fnFolderCheckedChilds() {
        let gridViewChilds = gridViewContainer.find('.grid-view-item');
        let listviewChilds = listviewContainer.find('dd');
        return [gridViewChilds, listviewChilds]
    }

    //取消全选状态
    function fnCancelAllForder() {
        $('.frame-main .list-view-header').removeClass('list-header-operatearea');
        $('.frame-main .grid-cols .check-icon').removeClass('all-folder');
    }

    //重名名状态
    function fnRenameState(num) {
        let upRename = $('.frame-main .button-box-mark a').eq(3);
        if (num !== 1) {
            upRename.addClass('g-disabled')
        } else {
            upRename.removeClass('g-disabled')
        }
    }


    //-------------------------------------------------------------------------------------------------------

    //文件夹双击进入文件夹或打开文件事件委托

    gridViewContainer.on('dblclick', '.grid-view-item', fnDblclickChecked);
    listviewContainer.on('dblclick', 'dd', fnDblclickChecked);
    function fnDblclickChecked(event) {
        let id = $(this).data('id');
        let Suffix = $(this).find('.filename').attr('title')
        let type = Suffix.lastIndexOf('.') === -1 ? 'folder' : Suffix.slice(Suffix.lastIndexOf('.') + 1);

        switch (type) {
            case 'folder':
                fnEnterFolder(id, Suffix)
                break;
        }
    }

    //进入文件夹
    function fnEnterFolder(id) {
        fnCancelAllForder();
        currentData = createHtml(id);
    }

    //面包屑事件委托
    oBreadCrumb.on('click', 'a', fnbreadCrumbInfo);
    function fnbreadCrumbInfo(event) {
        let lastId = oBreadCrumb.find('a');
        let lid = lastId.last().data('id');
        let pid = lastId.last().prev().prev().data('id')
        let deep = $(this).data('deep');
        let id = $(this).data('id');

        if (deep >= 0  && id >= 0) {
            currentData = createHtml(id);
        } else {
            currentData = createHtml(pid);
        }
    }

    //----------------------------------------------------------------------------------------
    //新建文件夹

    $('.frame-main .bar .tools a').last().on('click', fnNewFolder);
    function fnNewFolder() {
        if ($.yunTool.isNewFolder()) return false;
        let type = gridViewContainer.hasClass('show') ? 'grid' : 'list';
        let oInput = moduleEdite.find('input');
        oStatus = oInput;
        oInput.val('新建文件夹');
        if (type === 'grid') {
            moduleEdite.addClass('show');
            moduleEdite.addClass('module-edit-name-grid');
            moduleEdite.addClass('grid-dir-large');
            fnCancelNEW(fnGridChilds(), 'newFolder', oFrameMainWidth)//添加后渲染页面
        } else {
            moduleEdite.addClass('show')
            let newFolder = fnCreateFolder(type)
            oListView.prepend(newFolder)
        }
        oInput.focus();
    }

    //取消新建文件夹
    moduleEdite.find('.cancel').on('click', fnCancel);
    function fnCancel() {
        if (moduleEdite.hasClass('module-edit-name-grid')) {
            moduleEdite.removeClass('show');
            moduleEdite.removeClass('module-edit-name-grid');
            moduleEdite.removeClass('grid-dir-large');
            fnCancelNEW(fnGridChilds(), '', oFrameMainWidth)//重新渲染页面
        } else {
            moduleEdite.removeClass('show');
            oListView.find('dd:first').remove();
        }
        oStatus = null;
        fnTip('取消新建文件夹')
    }


    //缩略模式取消文件夹 重新计算
    function fnCancelNEW(childs, type, Width) {
        oGridView.html('');
        let ele = $.yunTool.RenderingFolder(childs, type, Width);
        for (let i = 0; i < ele.length; i++) {
            oGridView.append(ele[i])
        }
    }

    //确定新建文件夹
    moduleEdite.find('.sure').on('click', function () {
        let value = $(this).prev().val().trim();
        if (value === '') {
            fnCancel();
            return;
        }
        let id = fnCurrentViewId();
        //判断名字是否重复了
        if ($.yunTool.isNameRepetition(currentData, value)) {
            console.log('重复了');
            let newName = $.yunTool.newFolderName(currentData, value)
            fnNewFolderAdd(id, newName)
        } else {
            fnNewFolderAdd(id, value)
        }

    });
    //-------------------------------------------------------------------------------------
    //删除文件
    $('.frame-main .button-box-mark a').eq(2).on('click', fnDleFolder);

    function fnDleFolder() {
        let checks = fnGridChilds().filter(function (index, item) {
            return $(item).hasClass('item-active')
        });

        if (checks.length) {
            let idInfo = checks.map(function (index, item) {
                return $(item).data('id')
            });
            let del = $.Message({
                okFun: function () {
                    fnDleFolderAffirm(idInfo);
                    this.dialog.remove();
                    $('#module-shade').css({display:'none'});
                }
            });
        }


        //console.log(del)
    }

    //确认删除
    function fnDleFolderAffirm(info) {
        let curId = fnCurrentViewId();
        let newInfo = OperationData.delFoderData(info, curId)
        if (newInfo) {
            currentData = createHtml(curId);
            fnCancelAllForder();
            fnTip('删除成功')
        }
    }

    //------------------------------------------------------------------------------------
    //重命名

    $('.frame-main .button-box-mark a').eq(3).on('click', fnReFolder);

    function fnReFolder(ev) {
        let ele = null;
        let type = gridViewContainer.hasClass('show') ? 'grid' : 'list';
        let children = fnGridChilds().filter(function (index, item) {
            return $(item).hasClass('item-active');
        });
        if (children.length === 1) {
            if (type === 'grid') {
                ele = children.eq(0);
            } else {
                ele = fnListChilds().filter(function (index, item) {
                    return $(item).hasClass('item-active');
                }).eq(0);
            }
            let id = ele.data('id');
            let fileName = ele.find('.file-name');
            fileName.addClass('rename');
            let oInput = ele.find('.filename-input');
            let oName = ele.find('.filename').html().trim();
            let oCancel = ele.find('.filename-cancel');
            let oConfirm = ele.find('.filename-confirm');
            oInput.val(oName);
            oInput.select();
            oInput.focus();
            oStatus = oInput;
            oCancel.on('click', fnCancelRenameFolder.bind(fileName));
            oConfirm.on('click', fnNewNameFolder.bind(fileName, oInput, oName, id));

        }
    }

    function fnCancelRenameFolder() {
        this.removeClass('rename');
        fnTip('取消重命名')
        oStatus = null;
    }

    function fnNewNameFolder(oInput, oldName, id) {
        let newName = oInput.val().trim();
        if (newName === '' || newName === oldName) {
            this.removeClass('rename');
            fnTip('取消文件重命名')
            oStatus = null;
            return;
        }

        let repetition = false;

        let children = fnGridChilds().map(function (index, item) {
            return $(this).find('.filename').html().trim()
        });
        for (let i = 0, len = children.length; i < len; i++) {
            if (children[i] === newName) {
                repetition = true;
                break;
            }
        }
        if (repetition) {
            fnRepetitionNameFolder(children, newName, id);
            return false;
        }

        let state = OperationData.renameFolder(newName, id);
        if (state) {
            fnTip('修改文件名字成功')
            currentData = createHtml(fnCurrentViewId());
            oStatus = null;
        }
    }

    function fnRepetitionNameFolder(children, newName, id) {
        let repetitionNameTip = $.Message({
            title: '温馨提示',
            content: '<div style="text-align:center;padding:40px 22px 22px 22px;">检测到本文件夹下文件名字有重复!</div>',
            okValue: '保留两个',
            okFun: function () {
                fnNewRepetitionName(children, newName, id);
                this.dialog.remove();
            }
        });


    }

    function fnNewRepetitionName(children, newName, id) {
        let oNewName = $.yunTool.newFolderName(children, newName);
        let state = OperationData.renameFolder(oNewName, id);
        if (state) {
            fnTip('修改文件名字成功')
            currentData = createHtml(fnCurrentViewId());
            oStatus = null;
        }
    }

    //--------------------------------------------------------------------------------------
    //移动到
    $('.frame-main .button-box-mark a').eq(5).on('click', fnMoveFolder);
    function fnMoveFolder() {
        let folderInfo = fnGridChilds().filter(function (index, item) {
            return $(item).hasClass('item-active')
        });

        if (folderInfo.length) {
            fnMoveFolderMessage(folderInfo)
        } else {
            return false;
        }

    }

    function fnMoveFolderMessage(folderInfo) {
        let fileTree = `
                <div class="file-tree-container">
                   <ul class="treeview treeview-content ">
                       ${fnMoveFolderMessageHtml(data, 0)}
                   </ul>
                </div>
                 `;
        let moveTip = $.Message({
            id: 'fileTreeDialog',
            title: '移动文件',
            content: fileTree,
            okFun: function () {
                fnMoveFolderConfirm(this);
            }
        });
        fnMoveFolderEvent(moveTip)
    }

    function fnMoveFolderEvent(moveTip) {
        //添加 列表选中事件
        moveTip.dialogBody.on('click', '.treeview-node', function () {
            $(this).trigger('checked', this);
        });

        moveTip.dialogBody.on('checked', function (ev, ele) {
            moveTip.prv = moveTip.prv || moveTip.dialogBody.find('.treeview-node:first');
            if (moveTip.prv[0] === ele) {
                if ($(ele).hasClass('treeview-root')) {
                    if (!$(ele).hasClass('treenode-empty')) $(ele).removeClass('treeview-root')
                    $(ele).find('em').removeClass('minus');
                    $(ele).next().addClass('treeview-collapse')
                } else {
                    if (!$(ele).hasClass('treenode-empty')) $(ele).addClass('treeview-root')
                    $(ele).find('em').addClass('minus')
                    $(ele).next().removeClass('treeview-collapse')
                }
            } else {
                $(ele).addClass('treeview-node-on');
                moveTip.prv.removeClass('treeview-node-on');
                if (!$(ele).hasClass('treenode-empty')) {
                    $(ele).addClass('treeview-root')
                    $(ele).find('em').addClass('minus')
                    $(ele).next().removeClass('treeview-collapse')
                }
                moveTip.prv = $(ele);
            }
        });

        moveTip.dialogBody.on('mouseenter', '.treeview-node', function (event) {
            if (!$(this).hasClass('treeview-node-on')) {
                $(this).addClass('treeview-node-hover')
            }
        });

        moveTip.dialogBody.on('mouseleave', '.treeview-node', function (event) {
            if ($(this).hasClass('treeview-node-hover')) {
                $(this).removeClass('treeview-node-hover')
            }
        });
    }

    function fnMoveFolderConfirm(ele) {
        let id = ele.prv ? ele.prv.data('id') : 0;
        let curId = fnCurrentViewId();
        let childsInfo = fnGridChilds().filter(function (index, item) {
            return $(item).hasClass('item-active')
        }).map(function (index, item) {
            return {
                id: $(item).data('id'),
                name: $(item).find('.filename').html().trim(),
                pId: $(item).data('pid')
            }
        });

        let isSeif = OperationData.isFolderseif(id, childsInfo);
        if (isSeif) {
            fnTip(isSeif);
            return false;
        }
        fnMoveFolderRepeat(childsInfo, curId, id, ele);
    }

    //检测名字重复
    function fnMoveFolderRepeat(childsInfo, curId, id, ele) {
        let IsDuplicationName = OperationData.IsDuplicationName(id, childsInfo);
        if (IsDuplicationName) {
            if (ele) ele.dialog.remove();
            cutTip = $.Message({
                title: '温馨提示',
                content: `
                            <div style="text-align:center;padding:40px 22px 22px 22px;">
                                检测到本文件夹下以下文件名字相同:
                                <br/>
                                ${fnMoveFolderRename(IsDuplicationName)}
                            </div>`,
                okValue: '保留两个',
                okFun: function () {
                    fnMoveRepetitionName(IsDuplicationName, childsInfo);
                    this.dialog.remove();
                    $('#module-shade').css({display:'none'});
                }
            })
        } else {
            for (let i = 0; i < childsInfo.length; i++) {
                childsInfo[i].pId = id;
            }
            let isState = OperationData.moveRepetitionName(childsInfo, curId, id);
            if (isState) {
                if (ele) ele.dialog.remove();
                currentData = createHtml(curId);
                fnTip('移动文件成功')
                $('#module-shade').css({display:'none'});
            }
        }
    }

    function fnMoveFolderRename(IsDuplicationName) {
        let str = '';
        for (let i = 0; i < IsDuplicationName.isRepetition.length; i++) {
            str += IsDuplicationName.isRepetition[i] + '  ';
        }
        return str;
    }

    //剪切文件后名字重复
    function fnMoveRepetitionName(duplicationName, childsInfo) {
        let targerName = [];
        let pId = duplicationName.childs[0].pId;
        let curId = fnCurrentViewId();
        for (let i = 0; i < duplicationName.childs.length; i++) {
            targerName.push(duplicationName.childs[i].name)
        }
        for (let i = 0; i < childsInfo.length; i++) {
            let name = $.yunTool.newFolderName(targerName, childsInfo[i].name)
            childsInfo[i].name = name;
            childsInfo[i].pId = pId;
            targerName.push(name)
        }
        //接收3个参数 移动到的id 现在的id 重命名后的名字
        let isState = OperationData.moveRepetitionName(childsInfo, curId, pId);
        if (isState) {
            currentData = createHtml(curId);
            fnTip('移动文件成功')
        }
    }

    function fnMoveFolderMessageHtml(data, num) {
        let str = '';
        for (var i = 0; i < data.length; i++) {
            str += `<li>
                        <div class="treeview-node ${!data[i].child.length ? 'treenode-empty' : ''}${data[i].id === 0 ? 'treeview-node-on _minus treeview-root' : ''}"  data-id = ${data[i].id}  style="padding-left:${num}px">
                            <span class="treeview-node-handler">
                                <em class="b-in-blk plus icon-operate ${data[i].id === 0 ? 'minus' : ''}"></em>
                                <dfn class="b-in-blk treeview-ic"></dfn>
                                <span class="treeview-txt" >${data[i].name}</span>
                            </span>
                        </div>`;
            if (data[i].child.length) {
                str += ` 
                        <ul class="treeview treeview-root-content treeview-content ${num >= 15 ? 'treeview-collapse' : ''}" >
                            ${fnMoveFolderMessageHtml(data[i].child, num + 15)}
                        </ul>`;
            }

            str += `</li>`;
        }
        return str;
    }

    //----------------------------------------------------------------------------
    //鼠标画框
    oFrameMain.on('mousedown', function (ev) {
        if (ev.which !== 1) return;
        fnCancelFolderMenu() //取消右键菜单
        //  console.log('鼠标画框');
        ev.preventDefault();
        ev.stopPropagation();
        let state = setTimeout(() => {
            if (!ev.originalEvent.target.id === 'view-container-type') {
                return;
            }
            let num = fnFolderCheckedNum(fnGridChilds());
            if (!num) {
                fnMoveFrame(ev)
            } else {
                fnDragFolder(ev, num)
            }
        }, 300);

        $(this).on('mouseup', function () {
            clearTimeout(state)
        })
    });

    //鼠标画框
    function fnMoveFrame(ev) {
        let mouseFrame = $('#mouse-frame');
        let listChilds = fnListChilds();
        let gridChilds = fnGridChilds();
        let type = gridViewContainer.hasClass('show') ? 'grid' : 'list';
        let pagX = ev.pageX - oFrameMain.offset().left, pagY = ev.pageY - oFrameMain.offset().top;

        $(document).on('mousemove', fnMove);
        $(document).on('mouseup', fnUp);
        function fnMove(ev) {
            let currentX = ev.pageX - oFrameMain.offset().left,
                currentY = ev.pageY - oFrameMain.offset().top;
            mouseFrame.css({
                left: Math.min(pagX, currentX),
                top: Math.min(pagY, currentY),
                width: Math.abs(pagX - currentX),
                height: Math.abs(pagY - currentY)
            });
            //执行碰撞检测
            type === 'grid' ? duangFolder(mouseFrame, gridChilds,) : duangFolder(mouseFrame, listChilds);
        }

        function fnUp() {
            $(document).unbind('mousemove', fnMove);
            $(document).unbind('mouseup', fnUp);
            mouseFrame.removeAttr("style")
        }
    }


    //碰撞后加状态
    function duangFolder(creatSelectBox, container) {
        for (var i = 0; i < container.length; i++) {
            //判断和哪个撞到了
            if ($.yunTool.duang(creatSelectBox[0], container[i])) {
                fnAddFolderState(i, 'add')
            } else {
                fnAddFolderState(i, '')
            }
        }
    }

    function fnAddFolderState(num, type) {
        //文件夹子集
        let folderChilds = fnFolderCheckedChilds();
        //获取到文件
        let _position = num;
        let isType = type === 'add' ? 'addClass' : 'removeClass';
        folderChilds[0].eq(_position)[isType]('item-active');
        folderChilds[1].eq(_position)[isType]('item-active');
        let isAll = fnIsAllchecked(folderChilds[0]) ? 'addClass' : 'removeClass';
        $('.frame-main .grid-cols .check-icon')[isAll]('all-folder');
        fnFolderCheckedInfo()//选中信息
    }

    //------------------------------------------------------------------
    //右键菜单
    oFrameMain.on('contextmenu', '.grid-view-item', fnEmptContentyMenu);
    function fnEmptContentyMenu(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        let _this = this;
        fnDblEmptyMenu(ev, _this)
        $(this).addClass('item-active')
    }

    oFrameMain.on('contextmenu', fnDblEmptyMenu);
    function fnDblEmptyMenu(ev, _this) {

        ev.preventDefault();
        ev.stopPropagation();
        fnCancelFolderMenu();
        let tarId = ev.originalEvent.target.className;
        let tarTag = ev.originalEvent.target.nodeName.toUpperCase();
        if (tarId === 'frame-main' || tarTag === 'DD') {
            fnContentMenuInfo($('#contentMenu'), ev)
            fnCancelAllChecked();//取消选中
        } else {
            if (this === oFrameMain[0])  return;
            if (!$(_this).hasClass('item-active')) fnCancelAllChecked();
            let num = fnFolderCheckedNum(fnGridChilds());//判断选中的是几个
            let childs = $('#folderMenu').children().children();
            if (num >= 2) {
                childs.eq(0).addClass('disable');
                childs.eq(3).addClass('disable');
            } else {
                childs.eq(0).removeClass('disable');
                childs.eq(3).removeClass('disable');
            }
            fnContentMenuInfo($('#folderMenu'), ev)
        }
    }

    function fnContentMenuInfo(ele, ev) {
        let oContentMenu = ele, listFirst = oContentMenu.find('.list:first'),
            curpositionX = ev.pageX - oFrameMain.offset().left,
            curpositionY = ev.pageY - oFrameMain.offset().top,
            gapWidth = oFrameMain.width() - curpositionX,
            gapHeight = oFrameMain.height() - curpositionY,
            oWidth = listFirst.width(), oHeight = listFirst.height();
        oContentMenu.find('ul').css({display: 'none'});
        oContentMenu.find('li').removeClass('li-hover');
        listFirst.css({
            display: 'block',
            left: gapWidth - oWidth <= 0 ? oFrameMain.width() - oWidth : curpositionX,
            top: gapHeight - oHeight <= 0 ? oFrameMain.height() - oHeight : curpositionY,
        })
    }

    //右键菜单变量
    let oContentMenu = $('#contentMenu');
    let oFolderMenu = $('#folderMenu');

    oFolderMenu.on('mouseenter', 'li', fnContentMenuOver);
    oFolderMenu.on('mousedown', 'li', {type: 'folderMenu'}, fnContentMenuChecked);


    oContentMenu.on('mouseenter', 'li', fnContentMenuOver);
    oContentMenu.on('mousedown', 'li', {type: 'contentMenu'}, fnContentMenuChecked);
    //鼠标点击 执行不同的程序
    function fnContentMenuChecked(ev) {
        ev.stopPropagation();
        fnCancelFolderMenu(); //取消右键菜单
        let key = $(this).data('title');
        if (ev.data.type === 'folderMenu') {
            switch (key) {
                case '打开':
                    fnContentMenuEnter()
                    break;
                case '移动到':
                    fnMoveFolder();
                    break;
                case '复制到':
                    console.log(key)
                    break;
                case '重命名':
                    fnReFolder(ev)
                    break;
                case '删除':
                    fnDleFolder()
                    break;
            }
        }
        if (ev.data.type === 'contentMenu') {
            switch (key) {
                case '查看方式':
                    break;
                case '缩略图':
                    fnTabTypeFolder('grid');
                    break;
                case '列表':
                    fnTabTypeFolder('list');
                    break;
                case '排列方式':
                    break;
                case '日期':
                    if ('date' !== state.arrangementMode) {
                        state.arrangementMode = 'date';
                        currentData = createHtml(fnCurrentViewId());
                    }
                    break;
                case '大小':
                    if ('size' !== state.arrangementMode) {
                        state.arrangementMode = 'size';
                        currentData = createHtml(fnCurrentViewId());
                    }
                    break;
                case '名称':
                    if ('name' !== state.arrangementMode) {
                        state.arrangementMode = 'name';
                        currentData = createHtml(fnCurrentViewId());
                    }
                    break;
                case '刷新页面':
                    currentData = createHtml(fnCurrentViewId());
                    break;
                case '新建文件夹':
                    fnNewFolder();
                    break;
            }
        }

    }

    //右键菜单移入
    function fnContentMenuOver(ev) {
        ev.stopPropagation();
        let childs = $(this).parent().children();
        childs.removeClass('li-hover');
        let childsFirst = childs.children('ul');
        childsFirst.css({display: 'none'});
        let childschilds = childsFirst.children();
        childschilds.removeClass('li-hover');
        $(this).addClass('li-hover');
        let oUl = $(this).find('.list:first');
        if (oUl.length) {
            oUl.css({
                display: 'block',
                left: 110
            })
        }
    }

    //取消右键菜单
    function fnCancelFolderMenu() {
        oContentMenu.find('ul:first').css({display: 'none'});
        oFolderMenu.find('ul:first').css({display: 'none'});
    }

    //右键进入文件件
    function fnContentMenuEnter() {
        let ele = fnGridChilds().filter(function (index, item) {
            return $(this).hasClass('item-active');
        });
        if (ele.length === 1) fnEnterFolder(ele.eq(0).data('id'));
    }

    //-----------------------------------------------------------------------------
    //排列方式
    let sortSwitch = $('#sort-switch');
    sortSwitch.on('mouseenter', '.sort-switch-btn', fnSortTypeOver);
    sortSwitch.on('mouseleave', '.sort-switch-btn', fnSortTypeOut);

    sortSwitch.on('mouseenter', '.sort-switch-list', fnSortTypeOver);
    sortSwitch.on('mouseleave', '.sort-switch-list', fnSortTypeOut);

    function fnSortTypeOver() {
        clearTimeout(sortSwitch.timer);
        sortSwitch.find('.sort-switch-list').css({display: 'block'});
        if (sortSwitch.type !== state.arrangementMode) {
            sortSwitch.find('.icon-sort-select').html('');
            switch (state.arrangementMode) {
                case 'name':
                    sortSwitch.find('.icon-sort-select').eq(0).html('&#xE932;');
                    break;
                case 'date':
                    sortSwitch.find('.icon-sort-select').eq(1).html('&#xE932;');
                    break;
                case 'size':
                    sortSwitch.find('.icon-sort-select').eq(2).html('&#xE932;');
                    break;
            }
            sortSwitch.type = state.arrangementMode;
        }
    }

    function fnSortTypeOut() {
        sortSwitch.timer = setTimeout(function () {
            sortSwitch.find('.sort-switch-list').css({display: 'none'})
        }, 100);
    }

    sortSwitch.on('click', '.sort-switch-list .sort-item', fnTabSortType);

    function fnTabSortType() {
        let key = $(this).data('title');
        switch (key) {
            case 'name':
                if (key !== state.arrangementMode) {
                    state.arrangementMode = key;
                    currentData = createHtml(fnCurrentViewId());
                }
                break;
            case 'date':
                if (key !== state.arrangementMode) {
                    state.arrangementMode = key;
                    currentData = createHtml(fnCurrentViewId());
                }
                break;
            case 'size':
                if (key !== state.arrangementMode) {
                    state.arrangementMode = key;
                    currentData = createHtml(fnCurrentViewId());
                }
                break;
        }
        fnSortTypeOut()
    }

    //----------------------------------------------------------------------------------
    //拖拽文件移动
    function fnDragFolder(ev, num) {
        let ele = fnCreateDragEmpty(num, 0)
        ele.appendTo(oFrameMain);
        let eWidth = ele.width();
        let pagX = ev.pageX - oFrameMain.offset().left, pagY = ev.pageY - oFrameMain.offset().top;
        let gridChilds = fnGridChilds(), listChilds = fnListChilds();
        ele.css({
            top: pagY - 110,
            left: pagX - (eWidth / 2)
        });
        $(document).on('mousemove', {
            ele: ele,
            pagX: pagX,
            pagY: pagY,
            eWidth: eWidth,
            gridChilds: gridChilds,
            listChilds: listChilds
        }, fnDragFolderMove);

        $(document).on('mouseup', {
            ele: ele,
            gridChilds: gridChilds,
            listChilds: listChilds
        }, fnDragFolderUp);
    }

    function fnDragFolderMove(ev) {
        let curX = ev.pageX - oFrameMain.offset().left, curY = ev.pageY - oFrameMain.offset().top;
        ev.data.ele.css({
            top: curY - 110,
            left: curX - (ev.data.eWidth / 2)
        });
        let childs = [];
        if (state.displayMode === 'grid') childs = ev.data.gridChilds;
        if (state.displayMode === 'list') childs = ev.data.listChilds;
        let nochieck = childs.filter(function (index, item) {
            return !$(this).hasClass('item-active')
        });
        for (let i = 0; i < nochieck.length; i++) {
            if ($.yunTool.duang(ev.data.ele[0], nochieck[i])) {
                $(nochieck[i]).addClass('item-hover-color')
            } else {
                $(nochieck[i]).removeClass('item-hover-color')
            }
        }


    }

    function fnDragFolderUp(ev) {
        $(document).off('mousemove', fnDragFolderMove)
        $(document).off('mouseup', fnDragFolderUp);
        let cureleX = ev.data.ele.position().left, cureleY = ev.data.ele.position().top;
        let childs = [];
        if (state.displayMode === 'grid') childs = ev.data.gridChilds;
        if (state.displayMode === 'list') childs = ev.data.listChilds;
        let checked = childs.filter(function (index, item) {
            return $(this).hasClass('item-hover-color')
        });
        childs.removeClass('item-hover-color');

        let curId = fnCurrentViewId();
        let childsInfo = fnGridChilds().filter(function (index, item) {
            return $(item).hasClass('item-active')
        }).map(function (index, item) {
            return {
                id: $(item).data('id'),
                name: $(item).find('.filename').html().trim(),
                pId: $(item).data('pid')
            }
        });

        if (checked.length === 1) {
            fnMoveFolderRepeat(childsInfo, curId, checked.data('id'));
            ev.data.ele.remove();
            return
        }

        if (checked.length >= 1) {
            let e = Infinity, ele = null;
            for (let i = 0; i < checked.length; i++) {
                let hypotenuse = fnHypotenuse(checked.eq(i), cureleX, cureleY);
                if (e > hypotenuse) {
                    e = hypotenuse;
                    ele = checked.eq(i);
                }
            }
            fnMoveFolderRepeat(childsInfo, curId, ele.data('id'));
            ev.data.ele.remove();
            return
        }
        ev.data.ele.remove();

    }

    function fnHypotenuse(ele, curX, curY) {
        // console.log(ele.position().left,ele.position().top, curX, curY)
        return Math.sqrt(Math.abs(ele.position().left - curX) * Math.abs(ele.position().top - curY))
    }

    //-------------------------------------------------------------------------------------
    //提示消息
    function fnTip(info) {
        let tip = $('#module-tip');
        tip.find('.tip-msg').html(info);
        tip.css({
            top: 60,
            left: '50%',
            marginLeft: -Math.floor(tip.width() / 2),
            display: 'block',
            height: 0
        });
        tip.animate({height: 27}, 200, 'linear', function () {
            setTimeout(rollBack, 600)
        });
        function rollBack() {
            tip.animate({height: 0}, 200, 'linear', function () {
                tip.css({display: 'none'})
            })
        }

    }

    //取消全选
    function fnCancelAllChecked() {
        let folderChilds = fnFolderCheckedChilds();
        for (let i = 0, len = folderChilds[0].length; i < len; i++) {
            folderChilds[0].eq(i).removeClass('item-active');
            folderChilds[1].eq(i).removeClass('item-active');
        }
        $('.check-icon').removeClass('all-folder');
        fnFolderCheckedInfo()
    }

    //新建文件夹到data并且重新渲染页面
    function fnNewFolderAdd(id, value) {
        OperationData.addFoderData(OperationData.AddFolderInfo(id, value), id)
        currentData = createHtml(id);
        fnCancel() //取消新建文件夹状态
        fnTip('新建文件夹成功')
    }

    //获取到当前视图的id
    function fnCurrentViewId() {
        let ells = oBreadCrumb.find('a');
        if (!ells.length) {
            return 0;
        }
        return ells.last().data('id');
    }

    //获取缩略图下面所有的文件元素
    function fnGridChilds() {
        return gridViewContainer.find('.grid-view-item');
    }

    //获取列表写所有元素
    function fnListChilds() {
        return listviewContainer.find('dd');
    }

    //--------------------------------------------------------------------------------------
    //渲染页面
    function createHtml(id) {
        let current = fnCreateGridViewFile(id);//缩略图模式
        fnCreateListViewFile(id)
        fnCreateBreadCrumbInfo(id)
        fnCreateContentMenu();
        fileNum(current.length);
        return current;
    }

    window.currentData = createHtml(0);
    //当前视图共多少文件
    function fileNum (num){
        $('#history-list-tipsNum').html('已全部加载,共'+ num + '个')
    }

    let allA = document.getElementsByTagName("a");
    let Input = document.getElementsByTagName("input");
    Array.from(allA).forEach((item) => {
        item.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        })
    })

    Array.from(Input).forEach((item) => {
        item.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        })
    })

})(jQuery);



