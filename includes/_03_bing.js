// ==UserScript==
// @include http://*.bing.com/*
// @include https://*.bing.com/*
// ==/UserScript==

/*
 * Copyright (C) 2012 DuckDuckGo, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var options = widget.preferences;
console.log = opera.postError;

var ddgBox = new DuckDuckBox('q', [], 'results', false);

ddgBox.search = function(query) {

    opera.extension.postMessage({ query: query });

    if (options.dev)
        console.log("query:", query);
}

var cssInjected = false;
var path = 'css/bing.css';
window.addEventListener('DOMContentLoaded', function() {

        // Specify the path to the stylesheet here:
        opera.extension.postMessage({
            topic: 'LoadInjectedCSS',
            data: path
        });

        // instant search
        window.$('[name="q"]').keyup(function(e){
            var query = getQuery();
            if(ddgBox.lastQuery !== query && query !== '')
                ddgBox.hideZeroClick();

            if(options.dev)
                console.log(e.keyCode);

            var direct = false;
            if(e.keyCode == 40 || e.keyCode == 38)
                direct = true;

            clearTimeout(ddg_timer);
            ddg_timer = setTimeout(function(){
                qsearch(direct);
            }, 700);
           
        });

        window.$('[name="go"]').click(function(){
            qsearch();
        });

}, false);

opera.extension.onmessage = function(event){
    if (event.data.query) {
        ddgBox.renderZeroClick(event.data.result, event.data.query); 
    } else if (event.data.topic === 'LoadedInjectedCSS' && event.data.data.path === path && !cssInjected) {
         // Remove the message listener so it doesn't get called again.

         var css = event.data.data.css;

         // Create a <style> element and add it to the <head> element of the current page.
         // Insert the contents of the stylesheet into the <style> element.
         var style = document.createElement('style');
         style.setAttribute('type', 'text/css');
         style.appendChild(document.createTextNode(css));
         document.getElementsByTagName('head')[0].appendChild(style);
         cssInjected = true;
    }
}

var ddg_timer;

function getQuery(direct) {
    var instant = document.getElementsByClassName("gssb_a");
    if (instant.length !== 0 && !direct){
        var selected_instant = instant[0];
        
        var query = selected_instant.childNodes[0].childNodes[0].childNodes[0].
                    childNodes[0].childNodes[0].childNodes[0].innerHTML;
        query = query.replace(/<\/?(?!\!)[^>]*>/gi, '');

        if(options.dev)
            console.log(query);

        return query;
    } else {
        return document.getElementsByName('q')[0].value;
    }
}

function qsearch(direct) {
    var query = getQuery(direct);
    ddgBox.lastQuery = query;
    ddgBox.search(query);
} 



ddgBox.init();

