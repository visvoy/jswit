//
// SWIfT template with native JavaScript
//
// version 1.0
// visvoy@gmail.com
// 
// updated 2012-12-19
//
// 
// SUPPORT ELEMENTS // 
// 
//     input,select,textarea,div,span,em,i,table,tbody,thead,tfoot,tr,th,td,ol,ul,li,dl,dd,dt
//     form,img,frame,iframe
// 
// 
// SPECIAL NOTICE //
// 
// IE supports document.getElementsByName with blow tags only:
//     A,APPLET,BUTTON,FORM,FRAME,IFRAME,IMG,INPUT,OBJECT,MAP,META,PARAM,TEXTAREA,SELECT
// otherwise like div,span,td will get empty array using getElementsByName() under IE
// 
(function(w,d,u){
var 
ie=!!w.ActiveXObject,
ie6=ie&&!w.XMLHttpRequest,
// ie8=ie&&!!d.documentMode,
// ie7=ie&&!ie6&&!ie8,

// Default settings
defaults={
	debug:false,
	tagBegin:'\%',
	tagEnd:'\%',
	maxRecursive:1000
},

// Swit configuration
config,

// Delay casting javascript pool
scripts=[],

// Swit private methods
fn={
	// Write log message to console window
	// this method works only when swit.setConfig('debug', true)
	log:function(msg){
		if(typeof console!='undefined'&&config.debug){
			console.log(msg);
		}
	},
	
	// Dump object/array value (debug only)
	// dump:function(ob){
	// 	var t=[];for(var i in ob)if(typeof ob[i]!='function')t.push(i+"="+ob[i]);alert(t.join("; "));
	// },
	
	// Judges ob.nodeName equals to nodeStr or not
	nodeName:function(ob,nodeStr){
		return (ob.nodeName && ob.nodeName.toUpperCase() == nodeStr.toUpperCase());
	},
	
	// Remove script content from str
	removeScriptTag:function(str){
		return str.replace(/<script[\w\W]*?<\/script>/g,'').replace(/<script[\w\W]*?>/g,'');
	},
	
	// Test if ob is an object or array
	isObjectOrArray:function(ob){
		return (typeof ob=="object"||typeof ob=="array" ? true : false);
	},
	
	// Test if ob is an array composited by numeric keys
	isNumberKeyArray:function(ob){
		if(typeof ob[0]!='undefined'||typeof ob[1]!='undefined'){
			return true;
		}
		return false;
	},
	
	// Replace tag with value
	replace:function(tag,value,sourceText){
		return sourceText.replace(new RegExp(config.tagBegin+tag+config.tagEnd,"gi"),value);
	},
	
	// Remove leading space and trailing space
	trim:function(text){
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},
	
	// Convert object to a pure Array
	toArray:function(ary){
		var i, ret = [];

		if( ary != null ){
			i = ary.length;
			//the window, strings and functions also have 'length'
			if( i == null || ary.split || ary.setInterval || ary.call ){
				ret[0] = ary;
			}else{
				while( i ){
					ret[--i] = ary[i];
				}
			}
		}

		return ret;
	},
	
	// Merge two objects and return the merged result
	merge:function(first,second){
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName
		var i = 0, elem, pos = first.length;
		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( ie ) {
			while ( elem = second[ i++ ] ) {
				if ( elem.nodeType != 8 ) {
					first[ pos++ ] = elem;
				}
			}
		} else {
			while ( elem = second[ i++ ] ) {
				first[ pos++ ] = elem;
			}
		}

		return first;
	},
	
	// Convert html string to DOM elements array
	stringToDom:function(elem,context){
		var ret = [];
		context = context || d;
		// !context.createElement fails in IE with an error but returns typeof 'object'
		if (typeof context.createElement == 'undefined'){
			context = context.ownerDocument || context[0] && context[0].ownerDocument || d;
		}
		// Fix "XHTML"-style tags in all browsers
		elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
			return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
				all : front + "></" + tag + ">";
		});

		// Trim whitespace, otherwise indexOf won't work as expected
		var tags = fn.trim( elem ).toLowerCase(), div = context.createElement("div");

		var wrap =
			// option or optgroup
			!tags.indexOf("<opt") &&
			[ 1, "<select multiple='multiple'>", "</select>" ] ||

			!tags.indexOf("<leg") &&
			[ 1, "<fieldset>", "</fieldset>" ] ||

			tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
			[ 1, "<table>", "</table>" ] ||

			!tags.indexOf("<tr") &&
			[ 2, "<table><tbody>", "</tbody></table>" ] ||

		 	// <thead> matched above
			(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
			[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

			!tags.indexOf("<col") &&
			[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

			// IE can't serialize <link> and <script> tags normally
			ie &&
			[ 1, "div<div>", "</div>" ] ||

			[ 0, "", "" ];

		// Go to html and back, then peel off extra wrappers
		div.innerHTML = wrap[1] + elem + wrap[2];

		// Move to the right depth
		while ( wrap[0]-- ) {
			div = div.lastChild;
		}

		// Remove IE's autoinserted <tbody> from table fragments
		if ( ie ) {

			// String was a <table>, *may* have spurious <tbody>
			var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
				div.firstChild && div.firstChild.childNodes :

				// String was a bare <thead> or <tfoot>
				wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
					div.childNodes : [];

			for ( var j = tbody.length - 1; j >= 0 ; --j ){
				if ( fn.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ){
					tbody[ j ].parentNode.removeChild( tbody[ j ] );
				}
			}

			// IE completely kills leading whitespace when innerHTML is used
			if ( /^\s/.test( elem ) ) {
				div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
			}
		}

		elem = fn.toArray( div.childNodes );
		
		if ( elem.length === 0 && (!fn.nodeName( elem, "form" ) && !fn.nodeName( elem, "select" )) ) {
			return;
		}

		if ( elem[0] == u || fn.nodeName( elem, "form" ) || elem.options ) {
			ret.push( elem );
		}else{
			ret = fn.merge( ret, elem );
		}
			
		return ret;
	},
	
	// Replace DOM content of [ob] with [replaceText]
	html:function(ob,replaceText,delayScript){
		while (ob.firstChild) {
			ob.removeChild(ob.firstChild);
		}
		
		var i,elem,domjs=[],elems=fn.stringToDom(replaceText);
		
		if ( fn.nodeName( ob, "table" ) && fn.nodeName( elems[0], "tr" ) ){
			ob = ob.getElementsByTagName("tbody")[0] || ob.appendChild( ob.ownerDocument.createElement("tbody") );
		}

		for(i in elems){
			elem=elems[i];
			
			// execute all scripts after the elements have been injected
			if ( fn.nodeName( elem, "script" ) ){
				if(delayScript){
					scripts.push( elem );
				}else{
					domjs.push( elem );
				}
			} else {
				// Remove any inner scripts for later evaluation
				if ( elem.nodeType == 1 && !ie ) {
					elem.innerHTML = fn.removeScriptTag(elem.innerHTML);
				}

				// Inject the elements into the document
				if (ob.nodeType == 1){
					ob.appendChild( elem );
				}
			}
		}

		// Not a delay script calls?
		// then we run scripts
		if(!delayScript){
			for(i=0;i<domjs.length;i++){
				elem=domjs[i];
				eval(elem.text || elem.textContent || elem.innerHTML || "");
			}
		}
	},
	
	// Common DOM element initialize
	initDomCommon:function(ob){
		ob.setAttribute('switInit',true);
		ob.setAttribute('switSource',ob.innerHTML);
	},
	
	// <INPUT> element initialize
	initDomInput:function(ob){
		ob.setAttribute('switInit',true);
		ob.setAttribute('switSource',ob.getAttribute('value'));
	},
	
	// <SELECT> element initialize
	initDomSelect:function(ob){
		ob.setAttribute('switInit',true);
		ob.setAttribute('switSource',ob.innerHTML.replace(" selected",""));
	},
	
	// Render <INPUT> element
	renderDomInput:function(ob,view,delayScript){
		if(typeof view!="array"){
			if(typeof view!="object"){
				ob.setAttribute("value",view);
			}else{
				for(var k in view){
					ob.setAttribute(k,view[k]);
				}
			}
		}
	},
	
	// Render other DOM element
	renderDomCommon:function(ob,view,delayScript){
		if(!fn.isObjectOrArray(view)){
			fn.html(ob,view,delayScript);
			return;
		}
		var k,j,len,src,tmp,isIterate,htm="";
		src=ob.getAttribute('switSource')||"";
		if(fn.isNumberKeyArray(view)){
			for(k in view){
				if(parseInt(k)==NaN){
					continue;
				}
				if(!fn.isObjectOrArray(view[k])){
					htm+=view[k];
				}else{
					tmp=src;
					for(var j in view[k]){
						tmp=fn.replace(j,view[k][j],tmp);
					}
					htm+=tmp;
				}
			}
			fn.html(ob,htm,delayScript);
			return;
		}
		for(k in view){
			src=fn.replace(k,view[k],src);
		}
		fn.html(ob,src,delayScript);
	},
	
	// Check [url] is a cross domain link or inner link
	isCrossDomain:function(url){
		var t=url.toLowerCase(),domain=d.domain.toLowerCase();
		if(t.indexOf('http://')<0&&t.indexOf('https://')<0){
			return false;
		}
		if(t.indexOf('http://'+domain)>-1||t.indexOf('https://'+domain)>-1){
			return false;
		}
		return true;
	},
	
	// Require a cross domain script
	requireCrossDomain:function(url){
		var body=d.getElementsByTagName('body')[0],
			sid='_switJsonp'+Math.random(),
			scriptObject=d.createElement('script');
		if(d.getElementById(sid)){
			body.removeChild(d.getElementById(sid));
		}
		scriptObject.src=url;
		scriptObject.type='text/javascript';
		scriptObject.defer=true;
		scriptObject.id=sid;
		void(body.appendChild(scriptObject));
	},
	
	// Create inner site xml http request object
	createRemoteRequest:function(){
		var reqFunctions = [function() { return new ActiveXObject("Msxml2.XMLHTTP"); },function() { return new XMLHttpRequest(); },function() { return new ActiveXObject("Microsoft.XMLHTTP"); }];
		for(var i = 0; i < reqFunctions.length; i++) {
			try {
				var req = reqFunctions[i]();
				if (req != null) {
					return req;
				}
			} catch(e) {continue;}
		}
		fn.log('can not create xml http request');
	},
	
	// Require remote view data
	// this method supports both inner site and cross domain request
	remoteViewData:function(dom,url,option,dataType){
		if(fn.isCrossDomain(url)){
			fn.requireCrossDomain(url);
			return;
		}
		var req=fn.createRemoteRequest();
		if(!req){
			return;
		}
		if(!option.method){
			option.method='GET';
		}
		if(typeof option.success!='function'){
			option.success=fn.renderDom;
		}
		if(typeof option.error!='function'){
			option.error=fn.log;
		}
		req.onreadystatechange = function(){
			if(req.readyState != 4){
				return;
			}
			if(req.status != 200){
				var tmp='unknown reponse';
				if(typeof req.responseText == 'string'){
					tmp=fn.removeScriptTag(req.responseText)
						.replace(/<style[\w\W]*?<\/style>/g,'')
						.replace(/<(?:.|\s)*?>/g,'')
						.replace(/([\r\n])[\s]+/g,'\r\n');
				}
				option.error.call(this, tmp);
				return;
			}
			if(typeof req.responseText != 'string'){
				option.error.call(this,'invalid remote reponse type '+(typeof req.responseText));
				return;
			}
			
			var ret=fn.trim(req.responseText);
			
			switch(dataType){
			case 'json':
				ret=eval(ret);
			case 'html':
				option.success.call(this,dom,ret,1);
				break;
			default:
				option.error.call(this,"invalid remote data type of "+dataType);
			}
		}
		req.open(option.method, url);
		req.send(null);
	},
	
	// Render [dom] using [view] data
	renderDom:function(dom,view,recursive,delayScript){
		if(typeof recursive=='undefined'){
			recursive=0;
		}
		if(recursive>config.maxRecursive){
			fn.log('exceed max recursive of '+config.maxRecursive);
			return;
		}
		
		// 非递归允许执行远程渲染
		if(recursive<1){
			if(typeof view.url=='string'){
				fn.remoteViewData(dom,view.url,view,'html');
				return;
			}
			if(typeof view.json=='string'){
				fn.remoteViewData(dom,view.json,view,'json');
				return;
			}
		}
		
		if(typeof dom.nodeName!='string'){
			fn.log('undefined DOM nodeName');
			return;
		}
		
		var nodeName,tmp;
		
		// Captialize first char
		nodeName=dom.nodeName.toLowerCase();
		nodeName=nodeName.substr(0,1).toUpperCase()+nodeName.substr(1);
		
		// init swit dom before rendering
		if(!dom.getAttribute('switInit')){
			tmp='initDom'+nodeName;
			if(typeof fn[tmp]!='function'){
				tmp='initDomCommon';
			}
			fn[tmp].call(this,dom);
		}
		
		// cast render
		tmp='renderDom'+nodeName;
		if(typeof fn[tmp]!='function'){
			tmp='renderDomCommon';
		}
		fn[tmp].call(this,dom,view,delayScript);
	},
	
	// Main render
	render:function(viewData,recursive){
		if(!fn.isObjectOrArray(viewData)){
			return;
		}
		
		var nameObjects,i,k;
		scripts=[];
		for(k in viewData){
			fn.log('render start for '+k);
			if(k.toLowerCase().indexOf('name=')!=0){
				// render for ID
				fn.renderDom(d.getElementById(k),viewData[k],recursive,true);
			}else{
				// render for names
				nameObjects=d.getElementsByName(k.substr(5));
				for(i=0;i<nameObjects.length;i++){
					fn.renderDom(nameObjects[i],viewData[k],recursive,true);
				}
			}
			fn.log('render end for '+k);
		}
		
		// Run scripts and clear the pool
		for(i=0;i<scripts.length;i++){
			elem=scripts[i];
			eval(elem.text || elem.textContent || elem.innerHTML || "");
		}
		scripts=[];
	}
};

// Init configuration
config=defaults;

// Publish Swit
w.swit={
	// Get config [key] value
	config:function(key){
		return(typeof config[key]=="undefined"?u:config[key]);
	},
	
	// Set config [key] to [val]
	setConfig:function(key,val){
		if(typeof key=="object"){
			for(var k in key){
				config[k]=key[k];
			}
		}else{
			config[key]=val;
		}
	},
	
	// Callback when cross domain jsonp request responsed
	callback:function(json){
		fn.render(json,1);
	},
	
	// Render DOM elements using json view data
	render:fn.render
};
})(window,document,undefined);	// window.swit