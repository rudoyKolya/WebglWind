(this["webpackJsonpopenlayers-map"]=this["webpackJsonpopenlayers-map"]||[]).push([[0],{100:function(e,t,n){},101:function(e,t,n){"use strict";n.r(t);var r=n(17),a=n.n(r),o=n(81),c=n.n(o),i=(n(98),n(31)),l=(n(99),new a.a.createContext),u=n(42),s=n(105),f=n(8),d=n(76);n(106);n(89);var m=n(104);var g=function(e){return new m.a(e)},h=function(e){var t=e.children,n=e.zoom,o=e.center,c=Object(r.useRef)(),m=Object(r.useState)(null),h=Object(i.a)(m,2),v=h[0],p=h[1];return Object(r.useEffect)((function(){var e=new d.a({source:g()});e.on("postrender",(function(e){e.context.globalCompositeOperation="destination-over",e.context.fillStyle="rgba(170, 211, 223, 1)",e.context.fillRect(0,0,e.context.canvas.width,e.context.canvas.height/2),e.context.fillStyle="rgba(242, 239, 233, 1)",e.context.fillRect(0,e.context.canvas.height/2,e.context.canvas.width,e.context.canvas.height/2),e.context.globalCompositeOperation="source-over"}));var t={view:new u.a({projection:Object(f.i)("EPSG:4326"),center:[0,0],zoom:2,maxZoom:10,minZoom:1}),layers:[e],controls:[],overlays:[]},n=new s.a(t);return n.setTarget(c.current),p(n),function(){return n.setTarget(void 0)}}),[]),Object(r.useEffect)((function(){v&&v.getView().setZoom(n)}),[n]),Object(r.useEffect)((function(){v&&v.getView().setCenter(o)}),[o]),a.a.createElement(l.Provider,{value:{map:v}},a.a.createElement("div",{ref:c,className:"ol-map"},t))},v=function(e){var t=e.children;return a.a.createElement("div",null,t)},p=(n(88),function(e,t,n){var r=e.createShader(t);if(!r)return null;if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){var a=e.getShaderInfoLog(r);return console.log(a),e.deleteShader(r),null}return r}),b=function(e,t,n){var r=function(e,t,n){var r=p(e,e.VERTEX_SHADER,t),a=p(e,e.FRAGMENT_SHADER,n);if(!r||!a)return null;var o=e.createProgram();return o?(e.attachShader(o,r),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?o:(e.deleteProgram(o),e.deleteShader(a),e.deleteShader(r),null)):null}(e,t,n);return!!r&&(e.useProgram(r),e.program=r,!0)},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return{x:2*Math.random()-1,y:2*Math.random()-1,life:Math.ceil(200*Math.random()),oldPositions:e}},y=function(e,t){return Math.round((e+1)*(t-1)/2)},S=function(e,t,n,r){return{x:y(e,n),y:y(t,r)}},x=n(90),O=n(51),w=n(91),j=function(e){var t=e.vectorsData,n=Object(r.useContext)(l).map,a=Object(r.useRef)(null);return Object(r.useEffect)((function(){if(n)return function(){a.current&&n.removeLayer(a.current)}}),[t,n]),Object(r.useEffect)((function(){if(n){var e,r,o,c=document.createElement("canvas"),l=(r="\nprecision mediump float;\nvarying vec4 vColor;\nvoid main() {\n    float r = 0.5;\n    if (distance(gl_PointCoord, vec2(0.5)) > r) {\n        discard;\n    }\n    gl_FragColor = vColor;\n}\n",o="\nattribute vec2 position;\nattribute vec4 color;\nvarying vec4 vColor;\nvoid main() {\n     gl_Position = vec4(position, 0.0, 1.0);\n     gl_PointSize = 2.0;\n     vColor = color;\n}\n",{gl:(e={current:c}).current.getContext("webgl"),vertexShaderSource:o,fragmentShaderSource:r,canvas:e}),u=l.gl;b(u,l.vertexShaderSource,l.fragmentShaderSource);var s=[];!function(e){var t=e.getAttribLocation(e.program,"position"),n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),e.vertexAttribPointer(t,2,e.FLOAT,!1,6*Float32Array.BYTES_PER_ELEMENT,0),e.enableVertexAttribArray(t);var r=e.getAttribLocation(e.program,"color");e.vertexAttribPointer(r,4,e.FLOAT,!1,6*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(r)}(u),function(e){for(var t=0;t<1e4;)e.push(E()),t+=1}(s);var f=null,d=new x.a({ratio:1,projection:"EPSG:4326",canvasFunction:function(e,n,r,a){f&&cancelAnimationFrame(f),c.width=a[0],c.height=a[1],u.viewport(0,0,c.width,c.height);return function(){var n=function(e,t,n){var r=e.length,a=e[0].length,o=Object(i.a)(t,4),c=o[0],l=o[1],u=o[2],s=o[3],f=Object(i.a)(n,4),d=f[0],m=f[1],g=f[2],h=f[3],v=Math.floor((l-m)/(h-m)*r),p=Math.floor((s-m)/(h-m)*r),b=Math.floor((c-d)/(g-d)*a),E=Math.floor((u-d)/(g-d)*a),y=(b%a+a)%a,S=E-b,x=(y+S)%a;if(S>=a||y>x){var w=e.slice(v,p).map((function(e){return e.slice(y)})),j=e.slice(v,p).map((function(e){return e.slice(0,x)}));return w.map((function(e,t){return[].concat(Object(O.a)(e),Object(O.a)(j[t]))}))}return e.slice(v,p).map((function(e){return e.slice(y,x)}))}(t,e,[-180,-90,180,90]);!function(e,t,n){e.forEach((function(e){var r={x:e.x,y:e.y};e.life+=1;var a=S(e.x,e.y,n[0].length,n.length),o=a.x,c=a.y,i=n[c][o].r/255*2-1,l=n[c][o].g/255*2-1,u=n[c][o].g/255+n[c][o].r/255;e.life>=300||e.x+i*t*u>1||e.x+i*t*u<-1||e.y+l*t*u>1||e.y+l*t*u<-1?Object.assign(e,E(e.oldPositions)):(e.x+=i*t*u,e.y+=l*t*u,e.oldPositions.unshift(r),e.oldPositions.length>10&&e.oldPositions.pop())}))}(s,.002,n);var r=[];s.forEach((function(e){var t=S(e.x,e.y,n[0].length,n.length),a=t.x,o=t.y,c=n[o][a];r.push(e.x,e.y,c.r/255,c.g/255,0,1),e.oldPositions.forEach((function(e,t){var a=S(e.x,e.y,n[0].length,n.length),o=n[a.y][a.x];r.push(e.x,e.y,o.r/255,o.g/255,0,1-(t+1)/10)}))})),u.bufferData(u.ARRAY_BUFFER,new Float32Array(r),u.DYNAMIC_DRAW),u.clearColor(0,0,0,0),u.enable(u.BLEND),u.blendFuncSeparate(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA,u.ONE,u.ONE),u.clear(u.COLOR_BUFFER_BIT),u.drawArrays(u.POINTS,0,r.length/6),f=requestAnimationFrame((function(){d.changed()}))}(),c}}),m=new w.a({source:d});a.current=m,n.addLayer(m)}}),[n,t]),null},A=n(78),P=n.n(A),C=n(85),_=n.n(C),F=n(86),R=n.n(F),L=n(87),M=(n(100),[P.a,_.a,R.a]),T=function(){var e=Object(r.useState)(L.center),t=Object(i.a)(e,2),n=t[0],o=(t[1],Object(r.useState)(1)),c=Object(i.a)(o,2),l=c[0],u=(c[1],Object(r.useState)(null)),s=Object(i.a)(u,2),d=s[0],m=s[1],g=Object(r.useState)(P.a),p=Object(i.a)(g,2),b=p[0],E=p[1];return Object(r.useEffect)((function(){!function(e,t){var n=new Image,r=[];n.onload=function(){var e=document.createElement("canvas"),a=e.getContext("2d");e.width=n.width,e.height=n.height,a.drawImage(n,0,0);for(var o=a.getImageData(0,0,e.width,e.height),c=o.data,i=0;i<c.length;i+=4)r.push({r:c[i],g:c[i+1],b:c[i+2]});var l=r.reduce((function(e,t,n,r){return n%o.width===0&&e.push(r.slice(n,n+o.width)),e}),[]).reverse();t(l)},n.src=e}(b,(function(e){m(e)}))}),[b]),a.a.createElement("div",null,a.a.createElement(h,{center:Object(f.e)(n),zoom:l},a.a.createElement(v,null,d?a.a.createElement(j,{vectorsData:d}):null)),a.a.createElement("div",null,a.a.createElement("div",null,"Choose image"),M.map((function(e){return a.a.createElement("div",{onClick:function(){E(e)},style:{background:e===b?"red":"blue"},key:e},e)}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(T,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},78:function(e,t,n){e.exports=n.p+"static/media/2016112000.3a65a12c.png"},85:function(e,t,n){e.exports=n.p+"static/media/2016112118.5acbc219.png"},86:function(e,t,n){e.exports=n.p+"static/media/2016112106.d92cb4ab.png"},87:function(e){e.exports=JSON.parse('{"center":[-94.9065,38.9884],"geojsonObject":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"kind":"county","name":"Wyandotte","state":"KS"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-94.8627,39.202],[-94.901,39.202],[-94.9065,38.9884],[-94.8682,39.0596],[-94.6053,39.0432],[-94.6053,39.1144],[-94.5998,39.1582],[-94.7422,39.1691],[-94.7751,39.202],[-94.8627,39.202]]]]}}]},"geojsonObject2":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"kind":"county","name":"Johnson","state":"KS"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-94.9065,38.9884],[-95.0544,38.9829],[-95.0544,38.7365],[-94.9668,38.7365],[-94.6108,38.7365],[-94.6108,38.846],[-94.6053,39.0432],[-94.8682,39.0596],[-94.9065,38.9884]]]]}}]},"kansasCityLonLat":[-94.579228,39.135386],"blueSpringsLonLat":[-94.279851,39.03412],"markerImage24":"https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-24.png","markerImage32":"https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png","markerImage64":"https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-64.png"}')},93:function(e,t,n){e.exports=n(101)},98:function(e,t,n){},99:function(e,t,n){}},[[93,1,2]]]);
//# sourceMappingURL=main.e7fbf449.chunk.js.map