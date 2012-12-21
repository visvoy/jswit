# jswit.js - SWIfT template with native JavaScript

## A brief example

html in your page:

    <ul id="userlist">
      <li>Name: %name% , age: %age%</li>
    </ul>

json data:

    var view_data = [
      userlist : {
        { name : 'Lily', age : 11 },
        { name : 'Lucy', age : 12 },
        { name : 'LiLei', age : 18 }
      }
    ];

render in js:

    swit.render(view_data);
  
you will get:

    <ul id="userlist">
      <li>Name: Lily , age: 11</li>
      <li>Name: Lucy , age: 12</li>
      <li>Name: LiLei , age: 13</li>
    </ul>

## What is jswit?

[jswit.js](https://github.com/visvoy/jswit) is a DOM based JavaScript template. [jswit.js](https://github.com/visvoy/jswit) support instant render, remote render and cross domain render.
jswit is wriiten with a native JavaScript, without any js framework dependency, so it's swift and efficient.

## How jswit works?

Create html page -> ready json view data -> swit.render -> your html page rendered

### Create html page:

    Write web html page without any server side language tag like <?php ?> or <%= %>,
    Mark DOM element id or name when you want to render e.g. <div id="newsDetail"></div>
    Use %tagName% for iterate render (refer to "A brief example" above)

### Prepare view data:
    jswit has only one data type for view rendering: JSON
    
    construct view data as below:
        var viewData = [
            "tagKey1" : "string to fill in",
            "tagKey2" : [
                "iterate string to fill in 1<br />",
                "iterate string to fill in 2<br />"
            ],
            "name=tag3" : {
                "key1" : "val1",
                "key2" : "val2"
            },
            "farId" : {
                "url" : "link/to/remote/server/return/html/string"
            },
            "farJson" : {
                "json" : "link/to/remote/server/return/json"
            },
        ];

### Render

    swit.render(viewData);
    
## What is the view key meaning?

tagKey1: find any DOM element with id="tagKey1", and replace DOM.innerHTML to view value: "string to fill in", result:

    <div id="tagKey1">string to fill in</div>

tagKey2: find any DOM element with id="tagKey2", and iterate replace DOM.innerHTML to view value, you will see:

    <span id="tagKey2">iterate string to fill in 1<br />iterate string to fill in 2<br /></span>

name=tag3: find any DOM elements with name="tag3", and iterate replace DOM.innerHTML to view value, using %tag% replace, result:

    <ul name="tag3">
        <li>val1</li>
        <li>val2</li>
    </ul>

farId: find DOM id="farId", and request remote view data according value of "url", then replace DOM.innerHTML to the responsed html string

farJson: find DOM id="farJson", and request remote view data according value of "json", then replace DOM.innerHTML to the responsed json data

### How to response cross domain json data?

At cross domain side, reponse the swit remote request as below:

    swit.callback([
        {
            "farJson" : "replaced string"
        }
    ]);




