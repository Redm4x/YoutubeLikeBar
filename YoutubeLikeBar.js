function getXMLHttpRequest()
{
    var xhr = null;
     
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        return null;
    }
     
    return xhr;
}

function AjaxRequest(VideoID, NewElem, callback)
{
	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            callback(JSON.parse(xhr.responseText), NewElem);
        }
    };

    var URL = "https://gdata.youtube.com/feeds/api/videos/"+VideoID+"?v=2&alt=json";
    xhr.open("GET", URL, true);
	xhr.send(null);
}

function AddBar(VideoID, Elem)
{
    Elem.innerHTML = "<img src=\"http://s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif\" alt=\"Loading...\"/>";
    AjaxRequest(VideoID, Elem, function(rep, Elem){
        if(rep == null) return;

        var StatsElem = rep['entry']['yt$rating'];
        var LikeCount = parseInt(StatsElem['numLikes']);
        var DislikeCount = parseInt(StatsElem['numDislikes']);
        var TotalRateCount = LikeCount + DislikeCount;
        var LikePourcent = Math.round(LikeCount * 100 / TotalRateCount);
        var DislikePourcent = 100 - LikePourcent;

        var BarStr = '<div style="margin-top: 5px; margin-left: 3px; background-color: red; height: 3px;">';
        BarStr += '<div style="background-color: green; height: 100%; width: '+LikePourcent+'%;"></div>';
        BarStr += '</div>';
        Elem.innerHTML = BarStr;
    });
}

if(document.getElementsByClassName('YoutubeLikeBar').length != 0)
    alert("YoutubeLikeBar à déjà été utilisé sur cette page");
else
{
    var BarClassName = 'YoutubeLikeBar';

    // Suggestions
    var RelatedVideos = document.getElementsByClassName('related-video');
    for(var i = 0 ; i < RelatedVideos.length ; i++)
    {
    	var Elem = RelatedVideos[i];
    	var URL = Elem.getAttribute('href');
    	var URLBegin = '/watch?v=';
    	var VideoID = URL.substr(URLBegin.length);

        var NewElem = document.createElement('div');
        NewElem.className = BarClassName;
        NewElem.style.marginLeft = '125px';
        Elem.appendChild(NewElem);

        AddBar(VideoID, NewElem);
    }

    // Résultats de recherche et abonnements
    var Videos = document.getElementsByClassName('yt-lockup-video');
    for(var i = 0 ; i < Videos.length ; i++)
    {
        var Elem = Videos[i];
        var VideoID = Elem.getAttribute('data-context-item-id');

        var NewElem = document.createElement('div');
        NewElem.className = BarClassName;
        Elem.getElementsByClassName('yt-lockup-content')[0].appendChild(NewElem);

        AddBar(VideoID, NewElem);
    }
}
