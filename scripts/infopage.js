function loadData_infopage(elementID, urlArray, tagname) {
    var finalHtml = "";
    for (var i = 0; i < urlArray.length; i++) {
        var url = urlArray[i];
		$.ajax({url:url, 
		    success: function (result) {
		        finalHtml += dataLoaded_infopage(result, tagname);
		        setElement(elementID, finalHtml);
		    },
		    error: function (result, status, errormessage) {
		        finalHtml += dataLoadedFailed_infopage(url, result, status, errormessage);
		        setElement(elementID, finalHtml);
		    }
		});
    }
}

/* Laden der Inhalte unterhalb der Elemente 'Article' */
function dataLoaded_infopage(response, tagname) {

	var result="";
	var ajaxReturn = response.getElementsByTagName(tagname);
	$.each(ajaxReturn,function (index, value) {
	    result += parseArticle_infopage(value);
	});
	return result;
}

/* Verhalten bei fehlerhaftem Laden*/
function dataLoadedFailed_infopage(url, response, status, errormessage) {

    return "<div>Error loading '" + url + "':<br/>" + errormessage + "</div>";

}

/* Parsen eines XML-Element 'Article'*/
function parseArticle_infopage(articleText) {
	var title, subtitle, thumbnail, text;
	title = articleText.getElementsByTagName('Heading')[0].textContent;
	subtitle = articleText.getElementsByTagName('ShortText')[0].textContent;
	thumbnail = articleText.getElementsByTagName('Thumbnail')[0].textContent;
	text = articleText.getElementsByTagName('Text')[0].textContent;
	
	return generateHtml_infopage(title, subtitle, thumbnail, text);
}

function generateHtml_infopage(title, subtitle, thumbnail, text) {
var htmlString = "<div data-role='collapsible'><h1>_TITLE_</h1><ul data-role='listview'><li><div><h2 class='floatText_SUBTITLEVISIBLE_'>_SUBTITLE_</h2><img src='_THUMBNAIL_' class='thumbImg autoScaleImg_THUMBVISIBLE_' /><p class='floatText'>_TEXT_</p></div></li></ul></div>";
				
// title kann leer sein. Wenn subtitle nicht leer ist, dann wird subtitle als title verwendet.				
if(title=="" & subtitle!="")
{
title=subtitle;
subtitle="";
}

htmlString=htmlString.replace("_TITLE_", title);
htmlString=htmlString.replace("_SUBTITLE_", subtitle);
htmlString=htmlString.replace("_THUMBNAIL_", thumbnail);
htmlString=htmlString.replace("_TEXT_", text);

//Alte URLs auf neue IP umbiegen
while (htmlString.indexOf("http://62.75.142.124") > 0)
{ htmlString = htmlString.replace("http://62.75.142.124", "http://85.25.246.142"); }
while (htmlString.indexOf("http://Artikel1URI") > 0)
{ htmlString = htmlString.replace("http://Artikel1URI", ""); }

var subtVisible="";
if(subtitle==""|subtitle==undefined){subtVisible=" hidden";}
htmlString=htmlString.replace("_SUBTITLEVISIBLE_", subtVisible);

var thumbVisible="";
if(thumbnail==""|thumbnail==undefined|thumbnail=="http://Artikel1URI"){thumbVisible=" hidden";}
htmlString = htmlString.replace("_THUMBVISIBLE_", thumbVisible);

// Ersetze alle Zeilenumbrüche im Text durch HTML-Umbrüche
while (htmlString.indexOf("\n") > 0)
{ htmlString = htmlString.replace("\n", "<br/>"); }

htmlString = findLinks_infopage(htmlString, /<p class='floatText'>[\s\S]*[^<a href='](http:\/\/[\S]*)\b<br\/>[^</a>][\s\S]*<\/p>/i);

return htmlString;
}

function findLinks_infopage(htmlString, regexItem) {
    var match;
    while (match = regexItem.exec(htmlString)) {
        var link = "<a href='" + match[1] + "'>" + match[1] + "</a>";
        htmlString = htmlString.replace(match[1], link);
    }
    return htmlString;
}



