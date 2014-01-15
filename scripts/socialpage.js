/// <reference path="..\scripts\core.js" />

function loadData_socialpage(elementID, url, tagname) {
    var dataLoader = new defaultPageLoader(elementID);
    dataLoader.findLinksRegExArray[0] = {
        regex: /(\s+E-Mail: )(\S*)\b<br\/>/g,
        protocol: "mailto:"
    }
    dataLoader.findLinksRegExArray[1] = {
        regex: /(\s+Tel\.: )([0-9 -]*)\b<br\/>/g,
        protocol: "tel:"
    }
    dataLoader.findLinksUsingRegEx = findLinks_socialpage;
    dataLoader.loadData([url], tagname);
}

function findLinks_socialpage(htmlString, regexItem) {
    var match;
    while (match = regexItem.regex.exec(htmlString)) {
        var link = match[1] + "<a href='" + regexItem.protocol + match[2] + "'>" + match[0].substring(match[1].length) + "</a>";
        htmlString = htmlString.replace(match[0], link);
    }
    return htmlString;
}

//function loadData_socialpage(elementID, url, tagname) {

//	$.ajax({url:url, 
//	    success: function (result) { dataLoaded_socialpage(result, elementID, tagname); },
//	    error: function (result, status, errormessage) { dataLoadedFailed_socialpage(elementID, url, result, status, errormessage); }
//			});
//}

///* Laden der Inhalte unterhalb der Elemente 'Article' */
//function dataLoaded_socialpage(response, elementID, tagname) {

//	var result="";
//	var ajaxReturn = response.getElementsByTagName(tagname);
//	$.each(ajaxReturn,function (index, value) {
//	    result += parseArticle_socialpage(value);
//	});
//	setElement(elementID,result);
//}

///* Verhalten bei fehlerhaftem Laden*/
//function dataLoadedFailed_socialpage(elementID, url, response, status, errormessage) {

//    setElement(elementID, "<div>Error loading '" + url + "':<br/>" + errormessage + "</div>");

//}

///* Parsen eines XML-Element 'Article'*/
//function parseArticle_socialpage(articleText) {
//	var title, subtitle, thumbnail, text;
//	title = articleText.getElementsByTagName('Heading')[0].textContent;
//	subtitle = articleText.getElementsByTagName('ShortText')[0].textContent;
//	thumbnail = articleText.getElementsByTagName('Thumbnail')[0].textContent;
//	text = articleText.getElementsByTagName('Text')[0].textContent;
	
//	return generateHtml_socialpage(title, subtitle, thumbnail, text);
//}

//function generateHtml_socialpage(title, subtitle, thumbnail, text) {
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

//// Ersetze alle Zeilenumbrüche im Text durch HTML-Umbrüche
//while (htmlString.indexOf("\n") > 0)
//{ htmlString = htmlString.replace("\n", "<br/>") }

//// Finde Mailadressen und Telefonnummern und mache sie als Link verfügbar
//htmlString = findLinks_socialpage(htmlString, /(\s+E-Mail: )(\S*)\b<br\/>/g, "mailto:");
//htmlString = findLinks_socialpage(htmlString, /(\s+Tel\.: )([0-9 -]*)\b<br\/>/g, "tel:");

//return htmlString;
//}


