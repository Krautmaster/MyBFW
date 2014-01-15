/// <reference path="..\scripts\core.js" />

function loadData_leisurepage(elementID, url, tagname) {
    var dataLoader = new defaultPageLoader(elementID);
    dataLoader.loadData([url], tagname);
}

//function loadData_leisurepage(elementID, url, tagname) {

//	$.ajax({url:url, 
//	    success: function (result) { dataLoaded_leisurepage(result, elementID, tagname); },
//	    error: function (result, status, errormessage) { dataLoadedFailed_leisurepage(elementID, url, result, status, errormessage) }
//			});
//}

///* Laden der Inhalte unterhalb der Elemente 'Article' */
//function dataLoaded_leisurepage(response, elementID, tagname) {

//	var result="";
//	var ajaxReturn = response.getElementsByTagName(tagname);
//	$.each(ajaxReturn,function (index, value) {
//	    result += parseArticle_leisurepage(value);
//	});
//	setElement(elementID,result);
//}

///* Verhalten bei fehlerhaftem Laden*/
//function dataLoadedFailed_leisurepage(elementID, url, response, status, errormessage) {

//    setElement(elementID, "<div>Error loading '" + url + "':<br/>" + errormessage + "</div>");

//}

///* Parsen eines XML-Element 'Article'*/
//function parseArticle_leisurepage(articleText) {
//	var title, subtitle, thumbnail, text;
//	title = articleText.getElementsByTagName('Heading')[0].textContent;
//	subtitle = articleText.getElementsByTagName('ShortText')[0].textContent;
//	thumbnail = articleText.getElementsByTagName('Thumbnail')[0].textContent;
//	text = articleText.getElementsByTagName('Text')[0].textContent;
	
//	return generateHtml_leisurepage(title, subtitle, thumbnail, text);
//}

//function generateHtml_leisurepage(title, subtitle, thumbnail, text) {
//var htmlString = "<div data-role='collapsible'><h1>_TITLE_</h1><ul data-role='listview'><li><div><h2 class='floatText_SUBTITLEVISIBLE_'>_SUBTITLE_</h2><img src='_THUMBNAIL_' class='thumbImg autoScaleImg_THUMBVISIBLE_' /><p class='floatText'>_TEXT_</p></div></li></ul></div>";
				
//// title kann leer sein. Wenn subtitle nicht leer ist, dann wird subtitle als title verwendet.				
//if(title=="" & subtitle!="")
//{
//title=subtitle;
//subtitle="";
//}				

//htmlString=htmlString.replace("_TITLE_", title);
//htmlString=htmlString.replace("_SUBTITLE_", subtitle);
//htmlString=htmlString.replace("_THUMBNAIL_", thumbnail);
//htmlString=htmlString.replace("_TEXT_", text);

//var subtVisible="";
//if(subtitle==""|subtitle==undefined){subtVisible=" hidden";}
//htmlString=htmlString.replace("_SUBTITLEVISIBLE_", subtVisible);

//var thumbVisible="";
//if(thumbnail==""|thumbnail==undefined){thumbVisible=" hidden";}
//htmlString=htmlString.replace("_THUMBVISIBLE_", thumbVisible);

//return htmlString;
//}
