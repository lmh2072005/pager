/*
*pager  v1.0 | (c) 2013 MIT license
*by lmh2072005
*last update 2013.11.10
*/
(function(){
    window.pager = window.pager || {};
    window.pager.init = function(opts){
            var option = {
                    start : 0,
                    limit : 10,
                    listTemp : null,
                    listTempWrap : null,
                    pageTemp : null,
                    pageTempWrap : null,
                    url : '',
                    staticData : {'total' : 0, 'start' : 0, 'limit' : 10, 'rows' : []},
                    pagerInit : function(){}
                },
                o = $.extend(option, opts);
                o.render = function(listData, pageData, fn){
                    o.listTempWrap.html(o.listTemp.render(listData));
                    var customPage = o.pageTemp.render(pageData).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#34;/g, '\"');
                    o.pageTempWrap.html(customPage);
                    if(!o.pageTempWrap.data('hasRend')){
                        o.pageTempWrap.data('hasRend',true);
                        o.pagerInit();
                    }
                    if(typeof fn == 'function'){
                        fn();
                    }
                }
                if(o.staticData['rows'].length > 0){
                    o.staticData['totalPage'] = Math.ceil(o.staticData['total']/o.staticData['limit']);
                    o.staticData['pageSize'] = new Array(o.staticData['totalPage']);
                    function rendStatic(){
                        var curIndex = parseInt(o.pageTempWrap.find('.cur').data('page')) - 1 || 0;
                        o.staticData['start'] = curIndex * o.staticData['limit'];
                        var relRows = o.staticData['rows'].slice(o.staticData['start'],o.staticData['start']+o.staticData['limit'])
                        o.render(relRows, o.staticData, function(){
                            o.pageTempWrap.find('a').eq(curIndex).addClass('cur');
                        });
                    }
                    rendStatic();
                    o.pageTempWrap.unbind('click');
                    o.pageTempWrap.on('click', 'a', function(){
                        $(this).addClass('cur').siblings().removeClass('cur');
                        rendStatic();
                    })
                }else if(o.url){
                    var param = {'start' : o.start, 'limit' : o.limit};
                    var curPage = 1;
                    o.pageTempWrap.unbind('click.pager');
                    o.pageTempWrap.on('click.pager', 'a', function(){
                        curPage = $(this).data('page');
                        var pageNums = o.pageTempWrap.data('pageNums');
                        if(curPage == 'prev'){
                            if(pageNums == 1){
                               curPage = 1;
                            }else{
                               curPage = parseInt(pageNums) - 1;
                            }
                        }else if(curPage == 'next'){
                            if(pageNums == o.pageTempWrap.data('totalPage')){
                               curPage = pageNums;
                            }else{
                               curPage = parseInt(pageNums) + 1;
                            }
                        }else if(curPage == 'jump'){
                            var jumpPage = parseInt(o.pageTempWrap.find('.jumpPage').val());
                            if(jumpPage && jumpPage > 0 && jumpPage <= o.pageTempWrap.data('totalPage')){
                                curPage = jumpPage;
                            }else{
                                curPage = 1;
                            }
                        }else if(curPage == 'first'){
                            curPage = 1;
                        }else if(curPage == 'last'){
                            curPage = o.pageTempWrap.data('totalPage');
                        }else{
                            //$(this).addClass('cur').siblings().removeClass('cur');
                        }
                        param['start'] = (parseInt(curPage) - 1) * param['limit'];
                        rend();
                    })
                     o.pageTempWrap.unbind('keydown.pager');
                     o.pageTempWrap.on('keydown.pager', '.jumpPage', function(e){
                           if(e.which == '13'){
                                o.pageTempWrap.find('a[data-page="jump"]').trigger('click');
                           }
                     });
                    function rend(){
                        $.get(o.url, param, function(result){
                            if(typeof result == 'string'){
                                result = $.parseJSON(result);
                            }
                            if(result['success'] && result['rows'].length > 0){
                                var pageSize = Math.ceil(parseInt(result['total'])/o.limit);
                                result['pageSize'] = new Array(pageSize);
                                result['totalPage'] = result['totalPage'] || pageSize;
                                result['curPage'] = result['curPage'] || curPage;
                                o.render(result['rows'], result, function(){
                                    o.pageTempWrap.data('pageNums',curPage);
                                    o.pageTempWrap.data('totalPage',pageSize);
                                    //o.pageTempWrap.find('a[data-page="'+curPage+'"]').addClass('cur').siblings().removeClass('cur');
                                });
                            }
                        },'json');
                    }
                    rend();
                }
    }
})();