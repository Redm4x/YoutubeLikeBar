var Videos = document.getElementsByClassName('related-video');
for(var i = 0 ; i < Videos.length ; i++)
{
	var Elem = Videos[i];
	var URL = Elem.getAttribute('href');
	var URLBegin = '/watch?v=';
	var VideoID = URL.substr(URLBegin.length);
	Request(VideoID, Elem, function(rep, Elem){
		var StatsElem = rep.getElementsByTagName('rating')[1];
		var LikeCount = parseInt(StatsElem.getAttribute('numLikes'));
		var DislikeCount = parseInt(StatsElem.getAttribute('numDislikes'));
		var TotalRateCount = LikeCount + DislikeCount;
		var LikePourcent = Math.round(LikeCount * 100 / TotalRateCount);
		var DislikePourcent = 100 - LikePourcent;

		var NewElem = document.createElement('span');

		NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: green; width: '+LikePourcent+'%;"></span>';
		NewElem.innerHTML += '<span style="height: 3px; float: left; background-color: red; width: '+DislikePourcent+'%;"></span>';
		Elem.appendChild(NewElem);
	});
}

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
            callback(xhr.responseXML, Elem);
        }
    };

    xhr.open("GET", "https://gdata.youtube.com/feeds/api/videos/"+VideoID+"?v=2", true);
	xhr.send(null);
}