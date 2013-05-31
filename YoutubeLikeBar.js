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

function Request(VideoID, NewElem, callback)
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

function AddBar(VideoID, NewElem)
{
    Request(VideoID, NewElem, function(rep, NewElem){
        if(rep == null) return;

        var StatsElem = rep['entry']['yt$rating'];
        var LikeCount = parseInt(StatsElem['numLikes']);
        var DislikeCount = parseInt(StatsElem['numDislikes']);
        var TotalRateCount = LikeCount + DislikeCount;
        var LikePourcent = Math.round(LikeCount * 100 / TotalRateCount);
        var DislikePourcent = 100 - LikePourcent;

        NewElem.className = "YoutubeLikeBar";

        NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: green; width: '+LikePourcent+'%;"></span>';
        NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: red; width: '+DislikePourcent+'%;"></span>';
    });
}

if(document.getElementsByClassName('YoutubeLikeBar').length != 0)
    alert("YoutubeLikeBar à déjà été utilisé sur cette page");
else
{
    var RelatedVideos = document.getElementsByClassName('related-video');
    
    for(var i = 0 ; i < RelatedVideos.length ; i++)
    {
    	var Elem = RelatedVideos[i];
    	var URL = Elem.getAttribute('href');
    	var URLBegin = '/watch?v=';
    	var VideoID = URL.substr(URLBegin.length);

        var NewElem = document.createElement('span');
        Elem.appendChild(NewElem);

        AddBar(VideoID, NewElem);
    }

    var SearchResults = document.getElementsByClassName('yt-lockup2-video');
    for(var i = 0 ; i < SearchResults.length ; i++)
    {
        var Elem = SearchResults[i];
        var VideoID = Elem.getAttribute('data-context-item-id');

        var NewElem = document.createElement('span');
        Elem.appendChild(NewElem);

        AddBar(VideoID, NewElem);
    }
}
