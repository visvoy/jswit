# jswit.js - SWIfT template with native JavaScript

## A brief example

html:

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






