/// <reference path="..\libs\jquery-1.8.3.min.js" />

// Constructor für eine neues Element der Klasse "defaultPageLoader".
function defaultPageLoader(elementID)
{
    // Diese Methoden und Parameter können für die einzelnen Seiten überschrieben werden.
    this.loadData = loadData;
    this.loadSucceeded = loadSuccess;
    this.loadFailed = loadError;
    this.parseXml = parseArticle;
    this.generateHtml = generateHtml;
    this.findLinksUsingRegEx = findLinks;
    this.findLinksRegExArray = new Array();

    // self wird für die interne Referenz auf die überschreibbaren Methoden und Parameter genutzt.
    // Durch diese Methodik können einzelne Teile ersetzt und für die entsprechende XML-Struktur angepasst werden.
    var self = this;

    // Die Id des Elements, in das geschrieben werden soll.
    var elementID = elementID;

    // Array zur Speicherung der Ergebnisse der asynchronen Ajax-Aufrufe.
    var internLoadResultParam = [{
        success: false,
        url: "",
        result: "",
        status: "",
        errorMessage: "",
        tagName: ""
    }];

    // Methode, die die Ajax-Aufrufe startet um die Daten zu holen und die Ergebnisse in "internLoadResultParam" speichert.
    function loadData(urlArray, tagName)
    {
        for (var i = 0; i < urlArray.length; i++) {
            var url = urlArray[i];
            $.ajax({
                type: "GET",
                url: url,
                crossDomain: true,
                cache: false,
                dataType: "xml"
            }).done(function (result) {
                internLoadResultParam[internLoadResultParam.length] = {
                    success: true,
                    url: this.url.substring(0, this.url.indexOf("?")),
                    result: result,
                    status: "200",
                    errorMessage: "",
                    tagName: tagName
                };
            }).fail(function (result, status, errormessage) {
                internLoadResultParam[internLoadResultParam.length] = {
                    success: false,
                    url: this.url.substring(0, this.url.indexOf("?")),
                    result: result,
                    status: status,
                    errorMessage: errormessage,
                    tagName: ""
                };
            }).complete(function () {
                loadResults();
            });
        }
    }

    // Methode, die die gesammelten Ergebnisse durchläuft und die methoden self.loadSucceeded oder self.loadFailed aufruft.
    function loadResults()
    {
        var result = "";
        for (var i = 0; i < internLoadResultParam.length; i++)
        {
            var resPara = internLoadResultParam[i];
            if (resPara != undefined) {
                if (resPara.url != undefined & resPara.url != "") {
                    if (resPara.success) { result += self.loadSucceeded(resPara.result, resPara.tagName); }
                    else { result += self.loadFailed(resPara.url, resPara.result, resPara.status, resPara.errorMessage); }
                }
            }
        }
        setElement(elementID, result);
    }

    // Methode, die bei erfolgreichem Laden einer XML-Datei das Parsen aller Artikel in HTML veranlasst.
    // to do: Ergebnis cachen
    function loadSuccess(response, tagName)
    {
        var result = "";
        var ajaxReturn = response.getElementsByTagName(tagName);
        $.each(ajaxReturn, function (index, value) {
            result += self.parseXml(value);
        });
        return result;
    }

    // Methode, die bei fehlgeschlagenem Laden einer XML-Datei eine Fehlermeldung aufruft.
    // to do: Cache abrufen bevor Fehlermeldung ausgegeben wird
    function loadError(url, result, status, errorMessage)
    {
        return "<div>Error loading '" + url + "': " + status + "<br/>" + errorMessage + "</div>";
    }

    // Ließt den Inhalt eines einzelnen XML-Artikels aus und veranlasst damit das Parsen in HTML.
    function parseArticle(articleText) {
        var title, subtitle, thumbnail, text;
        title = articleText.getElementsByTagName('Heading')[0].textContent;
        subtitle = articleText.getElementsByTagName('ShortText')[0].textContent;
        thumbnail = articleText.getElementsByTagName('Thumbnail')[0].textContent;
        text = articleText.getElementsByTagName('Text')[0].textContent;
        return self.generateHtml(title, subtitle, thumbnail, text);
    }

    // Erstellt einen neuen HTML-Eintrag mit den Werten eines einzelnen XML-Artikels.
    function generateHtml(title, subtitle, thumbnail, text) {
        var htmlString = "\
<div data-role='collapsible'>\
    <h1>_TITLE_</h1>\
    <ul data-role='listview'>\
        <li>\
            <div>\
                <h2 class='floatText_SUBTITLEVISIBLE_'>_SUBTITLE_</h2>\
                <img src='_THUMBNAIL_' class='thumbImg autoScaleImg_THUMBVISIBLE_' />\
                <p class='floatText'>_TEXT_</p>\
            </div>\
        </li>\
    </ul>\
</div>";

        // title kann leer sein. Wenn subtitle nicht leer ist, dann wird subtitle als title verwendet.				
        if (title == "" & subtitle != "") {
            title = subtitle;
            subtitle = "";
        }

        htmlString = htmlString.replace("_TITLE_", title);
        htmlString = htmlString.replace("_SUBTITLE_", subtitle);
        htmlString = htmlString.replace("_THUMBNAIL_", thumbnail);
        htmlString = htmlString.replace("_TEXT_", text);

        //Alte URLs auf neue IP umbiegen
        while (htmlString.indexOf("http://62.75.142.124") > 0)
        { htmlString = htmlString.replace("http://62.75.142.124", "http://85.25.246.142"); }
        while (htmlString.indexOf("http://Artikel1URI") > 0)
        { htmlString = htmlString.replace("http://Artikel1URI", ""); }

        var subtVisible = "";
        if (subtitle == "" | subtitle == undefined) { subtVisible = " hidden"; }
        htmlString = htmlString.replace("_SUBTITLEVISIBLE_", subtVisible);

        var thumbVisible = "";
        if (thumbnail == "" | thumbnail == undefined | thumbnail == "http://Artikel1URI") { thumbVisible = " hidden"; }
        htmlString = htmlString.replace("_THUMBVISIBLE_", thumbVisible);

        // Ersetze alle Zeilenumbrüche im Text durch HTML-Umbrüche
        while (htmlString.indexOf("\n") > 0)
        { htmlString = htmlString.replace("\n", "<br/>"); }

        // Suche mit regulären Ausdrücken nach Inhalten, die in Links umgewandelt werden können.
        for (var i = 0; i < self.findLinksRegExArray.length; i++) {
            htmlString = self.findLinksUsingRegEx(htmlString, self.findLinksRegExArray[i]);
        }

        return htmlString;
    }

    // Findet Link-Texte im Inhalt eines Artikels anhand eines mitgelieferten regulären Ausdrucks und wandelt sie in Links um.
    function findLinks(htmlString, regexItem) {
        var match;
        while (match = regexItem.exec(htmlString)) {
            var link = "<a href='" + match[1] + "'>" + match[1] + "</a>";
            htmlString = htmlString.replace(match[1], link);
        }
        return htmlString;
    }
}

