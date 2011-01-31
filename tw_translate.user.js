// ==UserScript==
// @name           Translate Tweets
// @namespace      https://cpj.org/
// @include        http://twitter.com/*
// @include        http://*.twitter.com/*
// @include        https://*.twitter.com/*
// @include        https://twitter.com/*
// ==/UserScript==
// 
//  Source at: https://github.com/dannyob/twittertranslate
//  Adapted from:
//  Jack Hsu's original Twitter Translate:
//  http://userscripts.org/scripts/show/43115 
//  
//  Chilla42o's modern TweetFilter: 
//  http://userscripts.org/scripts/show/49905
// 

var translate = function () {

    var event_hashchange = function() {
        console.log("hashchange");
        console.log("created google div");
        create_google_div();
        console.log("decorating statuses");
        decorate_statuses();
        console.log("decorated statuses");
    }


    var create_google_div = function() {
        var loaderDiv = document.createElement('div');
        loaderDiv.id = 'google-translate-loader';
        document.body.appendChild(loaderDiv);
        console.log("I created the div");
    };

    var decorate_statuses = function() {
        var statuses = document.getElementsByClassName("tweet-content");
        console.log(document);
        var n = statuses.length;
        console.log("Number of statuses"+n);
        for (var i=0; i<n; i++) {
            var status = statuses[i];
            add_translater(status);
        }
    };

    var add_translater = function(s) {
        var ttext = s.getElementsByClassName("tweet-text")[0].innerHTML;
        var action = s.getElementsByClassName("tweet-actions")[0];
        var encoded_ttext = encodeURIComponent(ttext);
        var langpair = '%7Cen';
        var dev_key = '&key=AIzaSyBIX8s4xecf9vnwGbxI5zESA59qHy4eNDA';
        var url = 'https://ajax.googleapis.com/ajax/services/language/translate?v=1.0'+dev_key+'&langpair='+langpair;

        console.log("add: " + ttext);

        var translateLink = document.createElement("a");
        translateLink.innerHTML = "<i></i> <b>Translate</b>";
        translateLink.href = '#';
        translateLink.title ='Translate using Google';

        var onclick = document.createAttribute("onclick");
        onclick.value = 'var s=document.createElement("script");' +
            's.src="' + url + '&q=' + encoded_ttext + '&langpair=' + langpair + '&callback=t' + '&context=translation_' + status.id + '";' + 
            'document.getElementById("google-translate-loader").appendChild(s);' +
            'return false;';

        translateLink.attributes.setNamedItem(onclick);
        action.appendChild(translateLink);
    };

    var initialize = function() {      
        try {
            if (typeof $ == 'undefined' || typeof twttr == 'undefined' || typeof twttr['currentUser'] == 'undefined') {
                //need twitter api and user logged in (logout will refresh page and thus reloading the script)
                window.setTimeout(initialize, 1000); //reinitialize
                return;
            }
        } catch(e) {
            window.setTimeout(initialize, 1000); //reinitialize
            return;
        }
        $(window).bind('hashchange', event_hashchange); //attach to hashchange event
        event_hashchange(); //fire up
    };

    initialize();
}

function translate_load(func) {
  if (document.readyState == "complete") { //chrome
    func();
  } else {
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      var oldonload = window.onload;
      window.onload = function() {
        if (oldonload) {
          oldonload();
        }
        func();
      }
    }
  }
}

function t(id, json, s, msg) {
    console.log(json);
}

if (window.top == window.self && //don't run in twitter's helper iframes
   window.location.toString().match(/^https?\:\/\/twitter\.com\//) && //only run on twitter.com
  !document.getElementById('translate_script'))  //don't inject multiple times (bookmarklet)
{
    var translate_script = document.createElement("script"); //create new <script> element
    translate_script.id = 'translate_script';
    txt = t.toString()
    txt = txt + "(function() {\n"+ //closure function
        translate_load.toString()+"\n"+ //attach our load function
        'translate_load('+translate.toString()+");\n"+ //execute our load function
        '})()'; //execute closure function
    translate_script.text = txt;
    document.body.appendChild(translate_script); //inject the script
}

//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
