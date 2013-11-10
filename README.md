pager
=====

custom pager with jsrender

you can configure the pager about the data-list  and the pager ui . 

the pager depends on the jquery  and the jsrender.

usage
-----
### 1. html  
use the wrap that show the pager and the data-list:
		<ul id="simpleListBox"></ul>
		<div id="simplePageBox"></div>

### 2. jsrender template
a. pager template: just notice the formart about the className and the data-page attribute with the correct element.
eg: class="pageRead"  data-page="first" .
.yxPager is the pager ui className.

		<script id="pageSimpleTemp" type="text/x-jsrender">
		  <div class="yxPager">
		   {{if curPage == 1}}
		            <span class="pageRead">首页</span>
		            <span class="pageRead">上一页</span>
		    {{else}}
		            <a href="javascript:;" data-page="first">首页</a>
		            <a href="javascript:;" data-page="prev">上一页</a>
		    {{/if}}
		    {{if curPage == totalPage}}
		     <span class="pageRead">下一页</span>
		     <span class="pageRead">末页</span>
		     {{else}}
		    <a href="javascript:;" data-page="next">下一页</a>
		    <a href="javascript:;" data-page="last">末页</a>
		    {{/if}}
		  <span class="infoBox">共{{>totalPage}}页，当前第{{>curPage}}页，到第<input type="text" class="jumpPage" value="{{>curPage}}" />页</span>
		  <a href="javascript:;" data-page="jump">确定</a>
		  </div>
		</script>

b. data-list template:
		<script id="listTemp" type="text/x-jsrender">
		   <li>时间：{{>DateTime}} amount：{{>Amount}}</li>
		</script>

### 3. javascript 
user the function pager.init

		pager.init({
		    listTemp:$('#listTemp'),   //data-list template
		    listTempWrap:$('#simpleListBox'),  //data-list template wrap
		    pageTemp : $('#pageSimpleTemp'),   //pager template
		    pageTempWrap : $('#simplePageBox'),  //pager template wrap
		    url : '../index.php',     //request url
		    limit : 2,              //limit
		    pagerInit : function(){}   //callback after pager init
		});


