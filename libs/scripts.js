function loadData(elementID, url, tagname) {

	$.ajax({url:url, 
			success:function(result){dataLoaded(result, elementID, tagname)}, 
			error:function(){dataLoadedFailed(url)}
			});
}

/* Laden der Inhalte unterhalb der Elemente 'Article' */
function dataLoaded(response, elementID, tagname) {

	var result="";
	var ajaxReturn = response.getElementsByTagName(tagname);
	$.each(ajaxReturn,function (index, value) {
	result += parseArticle(value);
	});
	setElement(elementID,result);
}

/* Verhalten bei fehlerhaftem Laden*/
function dataLoadedFailed(url) {

	return "ALARM!";

}

/* Parsen eines XML-Element 'Article'*/
function parseArticle(articleText) {
	var title, subtitle, thumbnail, text;
	title = articleText.getElementsByTagName('Heading')[0].textContent;
	subtitle = articleText.getElementsByTagName('ShortText')[0].textContent;
	thumbnail = articleText.getElementsByTagName('Thumbnail')[0].textContent;
	text = articleText.getElementsByTagName('Text')[0].textContent;
	
	return generateHtml(title, subtitle, thumbnail, text);
}

function generateHtml(title, subtitle, thumbnail, text) {
var htmlString = "<div data-role='collapsible'><h1>_TITLE_</h1><ul data-role='listview'><li><div><h2 class='floatText_SUBTITLEVISIBLE_'>_SUBTITLE_</h2><img src='_THUMBNAIL_' class='thumbImg autoScaleImg_THUMBVISIBLE_' /><p class='floatText'>_TEXT_</p></div></li></ul></div>";
				
// title kann leer sein. Wenn subtitle nicht leer ist, dann wird subtitle als title verwendet.				
if(title=="" & subtitle!="")
{
title=subtitle;
subtitle="";
}				

// ersetze die Platzhalter mit den Werten aus dem XML
htmlString=htmlString.replace("_TITLE_", title);
htmlString=htmlString.replace("_SUBTITLE_", subtitle);
htmlString=htmlString.replace("_THUMBNAIL_", thumbnail);
htmlString=htmlString.replace("_TEXT_", text);

// wenn kein Untertitel vorhanden ist, wird das Element in der Struktur ausgeblendet
var subtVisible="";
if(subtitle==""|subtitle==undefined){subtVisible=" hidden";}
htmlString=htmlString.replace("_SUBTITLEVISIBLE_", subtVisible);

// wenn kein Bild vorhanden ist, wird das Element in der Struktur ausgeblendet
var thumbVisible="";
if(thumbnail==""|thumbnail==undefined){thumbVisible=" hidden";}
htmlString = htmlString.replace("_THUMBVISIBLE_", thumbVisible);

// Ersetze alle Zeilenumbrüche im Text durch HTML-Umbrüche
while (htmlString.indexOf("\n") > 0)
{ htmlString = htmlString.replace("\n", "<br/>") }

// Finde Mailadressen und Telefonnummern und mache sie als Link verfügbar
htmlString = findLinks(htmlString, /(\s+E-Mail: )(\S*)\b<br\/>/g, "E-Mail: ", "mailto:");
htmlString = findLinks(htmlString, /(\s+Tel\.: )([0-9 -]*)\b<br\/>/g, "Tel.: ", "tel:");

return htmlString;
}

function findLinks(htmlString, regexItem, keyword, protocol)
{
    var match;
    while (match = regexItem.exec(htmlString))
    {
        var link = keyword + "<a href='" + protocol + match[2] + "'>" + match[0].substring(match[1].length) + "</a>";
        htmlString = htmlString.replace(match[0], link);
    }
    return htmlString;
}


