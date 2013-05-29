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

function Request(VideoID, Elem, callback)
{
	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            callback(JSON.parse(xhr.responseText), Elem);
        }
    };

    var URL = "https://gdata.youtube.com/feeds/api/videos/"+VideoID+"?v=2&alt=json";
    xhr.open("GET", URL, true);
	xhr.send(null);
}

if(document.getElementsByClassName('YoutubeLikeBar').length != 0)
    alert("YoutubeLikeBar à déjà été utilisé sur cette page");
else
{
    var Videos = document.getElementsByClassName('related-video');
    for(var i = 0 ; i < Videos.length ; i++)
    {
    	var Elem = Videos[i];
    	var URL = Elem.getAttribute('href');
    	var URLBegin = '/watch?v=';
    	var VideoID = URL.substr(URLBegin.length);
    	Request(VideoID, Elem, function(rep, Elem){
    		if(rep == null) return;

    		var StatsElem = rep['entry']['yt$rating'];
    		var LikeCount = parseInt(StatsElem['numLikes']);
    		var DislikeCount = parseInt(StatsElem['numDislikes']);
    		var TotalRateCount = LikeCount + DislikeCount;
    		var LikePourcent = Math.round(LikeCount * 100 / TotalRateCount);
    		var DislikePourcent = 100 - LikePourcent;

    		var NewElem = document.createElement('span');
            NewElem.className = "YoutubeLikeBar";

    		NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: green; width: '+LikePourcent+'%;"></span>';
    		NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: red; width: '+DislikePourcent+'%;"></span>';
    		Elem.appendChild(NewElem);
    	});
    }
}
