/**
 * Created by zuo on 2017/4/22.
 */



//生成文件夹 - 缩略图
function fnCreateGridViewFile(id) {
    // console.log(oGridView)
    var children = OperationData.getChildById(id);
    var htm = createGridViewFiles(id);
    if (htm) {
        oGridView.html(htm)
    } else {
        oGridView.html(fnEmptyFolder())
    }
    return children;
}
//生成文件夹 - 缩略图
function fnCreateListViewFile(id) {
    var htm = createListViewFiles(id);
    if (htm) {
        oListView.html(htm)
    } else {
        oListView.html(fnEmptyFolder())
    }
}
//生成文件夹 - 的面包屑
function fnCreateBreadCrumbInfo(id) {
    if (id !== 0) {
        var htm = CreateBreadCrumb(id);
        if (htm) {
            if (!oBreadCrumb.hasClass('active')) {
                oBreadCrumb.addClass('active')
            }
            oBreadCrumb.html(htm)
        }
    } else {
        if (oBreadCrumb.hasClass('active')) {
            oBreadCrumb.removeClass('active')
        }
    }
    window.currentId = id;
}

function fnCreateContentMenu() {
    let contentMenu = fnCreateContentMenuHTML(dataContentMenu[0]);
    let folderMenu = fnCreateContentMenuHTML(dataContentMenu[1]);
    $('#contentMenu').html(contentMenu);
    $('#folderMenu').html(folderMenu);
}