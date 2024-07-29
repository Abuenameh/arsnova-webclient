var kr=Object.defineProperty,Ss=Object.defineProperties,$s=Object.getOwnPropertyDescriptor,ks=Object.getOwnPropertyDescriptors;var Sr=Object.getOwnPropertySymbols;var Ms=Object.prototype.hasOwnProperty,Ls=Object.prototype.propertyIsEnumerable;var $r=(i,t,e)=>t in i?kr(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,E=(i,t)=>{for(var e in t||(t={}))Ms.call(t,e)&&$r(i,e,t[e]);if(Sr)for(var e of Sr(t))Ls.call(t,e)&&$r(i,e,t[e]);return i},R=(i,t)=>Ss(i,ks(t));var a=(i,t,e,r)=>{for(var s=r>1?void 0:r?$s(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(t,e,s):o(s))||s);return r&&s&&kr(t,e,s),s};var re=class extends Event{constructor(t,e,r){super("context-request",{bubbles:!0,composed:!0}),this.context=t,this.callback=e,this.subscribe=r!=null?r:!1}};var ye=class{constructor(t,e,r,s){var n;if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(o,l)=>{this.unsubscribe&&(this.unsubscribe!==l&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=o,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(o,l)),this.unsubscribe=l},this.host=t,e.context!==void 0){let o=e;this.context=o.context,this.callback=o.callback,this.subscribe=(n=o.subscribe)!=null?n:!1}else this.context=e,this.callback=r,this.subscribe=s!=null?s:!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new re(this.context,this.t,this.subscribe))}};var ut=class{get value(){return this.o}set value(t){this.setValue(t)}setValue(t,e=!1){let r=e||!Object.is(t,this.o);this.o=t,r&&this.updateObservers()}constructor(t){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:r}]of this.subscriptions)e(this.o,r)},t!==void 0&&(this.value=t)}addCallback(t,e,r){if(!r)return void t(this.value);this.subscriptions.has(t)||this.subscriptions.set(t,{disposer:()=>{this.subscriptions.delete(t)},consumerHost:e});let{disposer:s}=this.subscriptions.get(t);t(this.value,s)}clearCallbacks(){this.subscriptions.clear()}};var jt=class extends Event{constructor(t){super("context-provider",{bubbles:!0,composed:!0}),this.context=t}},xe=class extends ut{constructor(t,e,r){var s,n;super(e.context!==void 0?e.initialValue:r),this.onContextRequest=o=>{let l=o.composedPath()[0];o.context===this.context&&l!==this.host&&(o.stopPropagation(),this.addCallback(o.callback,l,o.subscribe))},this.onProviderRequest=o=>{let l=o.composedPath()[0];if(o.context!==this.context||l===this.host)return;let c=new Set;for(let[u,{consumerHost:m}]of this.subscriptions)c.has(u)||(c.add(u),m.dispatchEvent(new re(this.context,u,!0)));o.stopPropagation()},this.host=t,e.context!==void 0?this.context=e.context:this.context=e,this.attachListeners(),(n=(s=this.host).addController)==null||n.call(s,this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new jt(this.context))}};function Xt({context:i}){return(t,e)=>{let r=new WeakMap;if(typeof e=="object")return e.addInitializer(function(){r.set(this,new xe(this,{context:i}))}),{get(){return t.get.call(this)},set(s){var n;return(n=r.get(this))==null||n.setValue(s),t.set.call(this,s)},init(s){var n;return(n=r.get(this))==null||n.setValue(s),s}};{t.constructor.addInitializer(o=>{r.set(o,new xe(o,{context:i}))});let s=Object.getOwnPropertyDescriptor(t,e),n;if(s===void 0){let o=new WeakMap;n={get(){return o.get(this)},set(l){r.get(this).setValue(l),o.set(this,l)},configurable:!0,enumerable:!0}}else{let o=s.set;n=R(E({},s),{set(l){r.get(this).setValue(l),o==null||o.call(this,l)}})}return void Object.defineProperty(t,e,n)}}}function J({context:i,subscribe:t}){return(e,r)=>{typeof r=="object"?r.addInitializer(function(){new ye(this,{context:i,callback:s=>{e.set.call(this,s)},subscribe:t})}):e.constructor.addInitializer(s=>{new ye(s,{context:i,callback:n=>{s[r]=n},subscribe:t})})}}var Mr=class{get shadowRoot(){return this.__host.__shadowRoot}constructor(t){this.ariaAtomic="",this.ariaAutoComplete="",this.ariaBraileLabel="",this.ariaBraileRoleDescription="",this.ariaBusy="",this.ariaChecked="",this.ariaColCount="",this.ariaColIndex="",this.ariaColSpan="",this.ariaCurrent="",this.ariaDescription="",this.ariaDisabled="",this.ariaExpanded="",this.ariaHasPopup="",this.ariaHidden="",this.ariaInvalid="",this.ariaKeyShortcuts="",this.ariaLabel="",this.ariaLevel="",this.ariaLive="",this.ariaModal="",this.ariaMultiLine="",this.ariaMultiSelectable="",this.ariaOrientation="",this.ariaPlaceholder="",this.ariaPosInSet="",this.ariaPressed="",this.ariaReadOnly="",this.ariaRequired="",this.ariaRoleDescription="",this.ariaRowCount="",this.ariaRowIndex="",this.ariaRowSpan="",this.ariaSelected="",this.ariaSetSize="",this.ariaSort="",this.ariaValueMax="",this.ariaValueMin="",this.ariaValueNow="",this.ariaValueText="",this.role="",this.form=null,this.labels=[],this.states=new Set,this.validationMessage="",this.validity={},this.willValidate=!0,this.__host=t}checkValidity(){return console.warn("`ElementInternals.checkValidity()` was called on the server.This method always returns true."),!0}reportValidity(){return!0}setFormValue(){}setValidity(){}};var Lr=new WeakMap,Le=i=>{let t=Lr.get(i);return t===void 0&&Lr.set(i,t=new Map),t},Hs=class{constructor(){this.__shadowRootMode=null,this.__shadowRoot=null,this.__internals=null}get attributes(){return Array.from(Le(this)).map(([t,e])=>({name:t,value:e}))}get shadowRoot(){return this.__shadowRootMode==="closed"?null:this.__shadowRoot}setAttribute(t,e){Le(this).set(t,String(e))}removeAttribute(t){Le(this).delete(t)}toggleAttribute(t,e){if(this.hasAttribute(t)){if(e===void 0||!e)return this.removeAttribute(t),!1}else return e===void 0||e?(this.setAttribute(t,""),!0):!1;return!0}hasAttribute(t){return Le(this).has(t)}attachShadow(t){let e={host:this};return this.__shadowRootMode=t.mode,t&&t.mode==="open"&&(this.__shadowRoot=e),e}attachInternals(){if(this.__internals!==null)throw new Error("Failed to execute 'attachInternals' on 'HTMLElement': ElementInternals for the specified element was already attached.");let t=new Mr(this);return this.__internals=t,t}getAttribute(t){let e=Le(this).get(t);return e!=null?e:null}};var Ps=class extends Hs{},Nr=Ps;var Vs=class{constructor(){this.__definitions=new Map}define(t,e){var r;if(this.__definitions.has(t))throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${t}" has already been used with this registry`);this.__definitions.set(t,{ctor:e,observedAttributes:(r=e.observedAttributes)!=null?r:[]})}get(t){let e=this.__definitions.get(t);return e==null?void 0:e.ctor}},Ds=Vs;var Hr=new Ds;var Ne=globalThis,ht=Ne.ShadowRoot&&(Ne.ShadyCSS===void 0||Ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Yt=Symbol(),Pr=new WeakMap,He=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ht&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Pr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Pr.set(e,t))}return t}toString(){return this.cssText}},Vr=i=>new He(typeof i=="string"?i:i+"",void 0,Yt),b=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new He(e,i,Yt)},zt=(i,t)=>{if(ht)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=Ne.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},mt=ht||Ne.CSSStyleSheet===void 0?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Vr(e)})(i):i;var{is:Os,defineProperty:Us,getOwnPropertyDescriptor:Is,getOwnPropertyNames:Fs,getOwnPropertySymbols:Bs,getPrototypeOf:js}=Object,O=globalThis,Ur;(Ur=O.customElements)!=null||(O.customElements=Hr);var Dr=O.trustedTypes,Xs=Dr?Dr.emptyScript:"",Wt=O.reactiveElementPolyfillSupport,Pe=(i,t)=>i,Ve={toAttribute(i,t){switch(t){case Boolean:i=i?Xs:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch(r){e=null}}return e}},ft=(i,t)=>!Os(i,t),Or={attribute:!0,type:String,converter:Ve,reflect:!1,hasChanged:ft},Ir,Fr;(Ir=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Fr=O.litPropertyMetadata)!=null||(O.litPropertyMetadata=new WeakMap);var Br,Z=class extends((Br=globalThis.HTMLElement)!=null?Br:Nr){static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Or){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Us(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){var o;let{get:s,set:n}=(o=Is(this.prototype,t))!=null?o:{get(){return this[e]},set(l){this[e]=l}};return{get(){return s==null?void 0:s.call(this)},set(l){let c=s==null?void 0:s.call(this);n.call(this,l),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:Or}static _$Ei(){if(this.hasOwnProperty(Pe("elementProperties")))return;let t=js(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Pe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pe("properties"))){let e=this.properties,r=[...Fs(e),...Bs(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(mt(s))}else t!==void 0&&e.push(mt(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,r;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)==null||r.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return zt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostConnected)==null?void 0:s.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var n;let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Ve).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n;let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ve;this._$Em=s,this[s]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){if(r!=null||(r=this.constructor.getPropertyOptions(t)),!((s=r.hasChanged)!=null?s:ft)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){var s;this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&((s=this._$Ej)!=null?s:this._$Ej=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((r=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,l]of this._$Ep)this[o]=l;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,l]of n)l.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],l)}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EU()}catch(n){throw t=!1,this._$EU(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}},jr;Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[Pe("elementProperties")]=new Map,Z[Pe("finalized")]=new Map,Wt==null||Wt({ReactiveElement:Z}),((jr=O.reactiveElementVersions)!=null?jr:O.reactiveElementVersions=[]).push("2.0.4");var Ee=globalThis,gt=Ee.trustedTypes,Xr=gt?gt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Zt="$lit$",G=`lit$${Math.random().toFixed(9).slice(2)}$`,Gt="?"+G,Ys=`<${Gt}>`,de=Ee.document===void 0?{createTreeWalker:()=>({})}:document,Oe=()=>de.createComment(""),Ue=i=>i===null||typeof i!="object"&&typeof i!="function",Gr=Array.isArray,Qr=i=>Gr(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Kt=`[
\f\r]`,De=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yr=/-->/g,zr=/>/g,ce=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^
\f\r"'\`<>=]|("|')|))|$)`,"g"),Wr=/'/g,Kr=/"/g,es=/^(?:script|style|textarea|title)$/i,ts=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),d=ts(1),Qt=ts(2),L=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Jr=new WeakMap,pe=de.createTreeWalker(de,129);function rs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xr!==void 0?Xr.createHTML(t):t}var ss=(i,t)=>{let e=i.length-1,r=[],s,n=t===2?"<svg>":"",o=De;for(let l=0;l<e;l++){let c=i[l],u,m,f=-1,y=0;for(;y<c.length&&(o.lastIndex=y,m=o.exec(c),m!==null);)y=o.lastIndex,o===De?m[1]==="!--"?o=Yr:m[1]!==void 0?o=zr:m[2]!==void 0?(es.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=ce):m[3]!==void 0&&(o=ce):o===ce?m[0]===">"?(o=s!=null?s:De,f=-1):m[1]===void 0?f=-2:(f=o.lastIndex-m[2].length,u=m[1],o=m[3]===void 0?ce:m[3]==='"'?Kr:Wr):o===Kr||o===Wr?o=ce:o===Yr||o===zr?o=De:(o=ce,s=void 0);let v=o===ce&&i[l+1].startsWith("/>")?" ":"";n+=o===De?c+Ys:f>=0?(r.push(u),c.slice(0,f)+Zt+c.slice(f)+G+v):c+G+(f===-2?l:v)}return[rs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),r]},Ie=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0,l=t.length-1,c=this.parts,[u,m]=ss(t,e);if(this.el=i.createElement(u,r),pe.currentNode=this.el.content,e===2){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(s=pe.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let f of s.getAttributeNames())if(f.endsWith(Zt)){let y=m[o++],v=s.getAttribute(f).split(G),A=/([.?@])?(.*)/.exec(y);c.push({type:1,index:n,name:A[2],strings:v,ctor:A[1]==="."?vt:A[1]==="?"?yt:A[1]==="@"?xt:he}),s.removeAttribute(f)}else f.startsWith(G)&&(c.push({type:6,index:n}),s.removeAttribute(f));if(es.test(s.tagName)){let f=s.textContent.split(G),y=f.length-1;if(y>0){s.textContent=gt?gt.emptyScript:"";for(let v=0;v<y;v++)s.append(f[v],Oe()),pe.nextNode(),c.push({type:2,index:++n});s.append(f[y],Oe())}}}else if(s.nodeType===8)if(s.data===Gt)c.push({type:2,index:n});else{let f=-1;for(;(f=s.data.indexOf(G,f+1))!==-1;)c.push({type:7,index:n}),f+=G.length-1}n++}}static createElement(t,e){let r=de.createElement("template");return r.innerHTML=t,r}};function ue(i,t,e=i,r){var o,l,c;if(t===L)return t;let s=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl,n=Ue(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?((c=e._$Co)!=null?c:e._$Co=[])[r]=s:e._$Cl=s),s!==void 0&&(t=ue(i,s._$AS(i,t.values),s,r)),t}var bt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var u;let{el:{content:e},parts:r}=this._$AD,s=((u=t==null?void 0:t.creationScope)!=null?u:de).importNode(e,!0);pe.currentNode=s;let n=pe.nextNode(),o=0,l=0,c=r[0];for(;c!==void 0;){if(o===c.index){let m;c.type===2?m=new _e(n,n.nextSibling,this,t):c.type===1?m=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(m=new Et(n,this,t)),this._$AV.push(m),c=r[++l]}o!==(c==null?void 0:c.index)&&(n=pe.nextNode(),o++)}return pe.currentNode=de,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},_e=class i{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,r,s){var n;this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(n=s==null?void 0:s.isConnected)!=null?n:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ue(this,t,e),Ue(t)?t===q||t==null||t===""?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==L&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==q&&Ue(this._$AH)?this._$AA.nextSibling.data=t:this.T(de.createTextNode(t)),this._$AH=t}$(t){var n;let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Ie.createElement(rs(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{let o=new bt(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Jr.get(t.strings);return e===void 0&&Jr.set(t.strings,e=new Ie(t)),e}k(t){Gr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let n of t)s===e.length?e.push(r=new i(this.S(Oe()),this.S(Oe()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},he=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=q}_$AI(t,e=this,r,s){let n=this.strings,o=!1;if(n===void 0)t=ue(this,t,e,0),o=!Ue(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{let l=t,c,u;for(t=n[0],c=0;c<n.length-1;c++)u=ue(this,l[r+c],e,c),u===L&&(u=this._$AH[c]),o||(o=!Ue(u)||u!==this._$AH[c]),u===q?t=q:t!==q&&(t+=(u!=null?u:"")+n[c+1]),this._$AH[c]=u}o&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},vt=class extends he{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}},yt=class extends he{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}},xt=class extends he{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){var o;if((t=(o=ue(this,t,e,0))!=null?o:q)===L)return;let r=this._$AH,s=t===q&&r!==q||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==q&&(r===q||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;typeof this._$AH=="function"?this._$AH.call((r=(e=this.options)==null?void 0:e.host)!=null?r:this.element,t):this._$AH.handleEvent(t)}},Et=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ue(this,t)}},is={P:Zt,A:G,C:Gt,M:1,L:ss,R:bt,D:Qr,V:ue,I:_e,H:he,N:yt,U:xt,B:vt,F:Et},Jt=Ee.litHtmlPolyfillSupport,Zr;Jt==null||Jt(Ie,_e),((Zr=Ee.litHtmlVersions)!=null?Zr:Ee.litHtmlVersions=[]).push("3.1.4");var os=(i,t,e)=>{var n,o;let r=(n=e==null?void 0:e.renderBefore)!=null?n:t,s=r._$litPart$;if(s===void 0){let l=(o=e==null?void 0:e.renderBefore)!=null?o:null;r._$litPart$=s=new _e(t.insertBefore(Oe(),l),l,void 0,e!=null?e:{})}return s._$AI(i),s};var g=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,r;let t=super.createRenderRoot();return(r=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=os(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return L}},ns;g._$litElement$=!0,g.finalized=!0,(ns=globalThis.litElementHydrateSupport)==null||ns.call(globalThis,{LitElement:g});var er=globalThis.litElementPolyfillSupport;er==null||er({LitElement:g});var as;((as=globalThis.litElementVersions)!=null?as:globalThis.litElementVersions=[]).push("4.0.6");var h=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var zs={attribute:!0,type:String,converter:Ve,reflect:!1,hasChanged:ft},Ws=(i=zs,t,e)=>{let{kind:r,metadata:s}=e,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){let{name:o}=e;return{set(l){let c=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,c,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){let{name:o}=e;return function(l){let c=this[o];t.call(this,l),this.requestUpdate(o,c,i)}}throw Error("Unsupported decorator location: "+r)};function p(i){return(t,e)=>typeof e=="object"?Ws(i,t,e):((r,s,n)=>{let o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?R(E({},r),{wrapped:!0}):r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}function _(i){return p(R(E({},i),{state:!0,attribute:!1}))}var se=(i,t,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(i,t,e),e);function Fe(i,t){return(e,r,s)=>{let n=o=>{var l,c;return(c=(l=o.renderRoot)==null?void 0:l.querySelector(i))!=null?c:null};if(t){let{get:o,set:l}=typeof r=="object"?e:s!=null?s:(()=>{let c=Symbol();return{get(){return this[c]},set(u){this[c]=u}}})();return se(e,r,{get(){let c=o.call(this);return c===void 0&&(c=n(this),(c!==null||this.hasUpdated)&&l.call(this,c)),c}})}return se(e,r,{get(){return n(this)}})}}function ls(i){return(t,e)=>{let{slot:r,selector:s}=i!=null?i:{},n="slot"+(r?`[name=${r}]`:":not([name])");return se(t,e,{get(){var c,u;let o=(c=this.renderRoot)==null?void 0:c.querySelector(n),l=(u=o==null?void 0:o.assignedElements(i))!=null?u:[];return s===void 0?l:l.filter(m=>m.matches(s))}})}}function T(i,t){let e=E({waitUntilFirstUpdate:!1},t);return(r,s)=>{let{update:n}=r,o=Array.isArray(i)?i:[i];r.update=function(l){o.forEach(c=>{let u=c;if(l.has(u)){let m=l.get(u),f=this[u];m!==f&&(!e.waitUntilFirstUpdate||this.hasUpdated)&&this[s](m,f)}}),n.call(this,l)}}}var cs=[{identifier:"completionStatus",cardinality:"single",baseType:"string",value:"unknown",type:"outcome"},{identifier:"numAttempts",cardinality:"single",baseType:"integer",value:"0",type:"response"}],U="item";var N=class extends g{constructor(){super();this.identifier="";this.adaptive="false";this.timeDependent="false";this._handleDisabledChange=(e,r)=>{this._interactionElements.forEach(s=>s.disabled=r)};this._handleReadonlyChange=(e,r)=>this._interactionElements.forEach(s=>s.readonly=r);this._context={identifier:this.getAttribute("identifier"),variables:cs};this._initialContext=R(E({},this._context),{variables:this._context.variables});this._feedbackElements=[];this._interactionElements=[];this.addEventListener("qti-register-variable",e=>{this._context=R(E({},this._context),{variables:[...this._context.variables,e.detail.variable]}),e.stopPropagation()}),this.addEventListener("qti-register-feedback",e=>{e.stopPropagation();let r=e.detail;this._feedbackElements.push(r),r.checkShowFeedback(r.outcomeIdentifier)}),this.addEventListener("qti-register-interaction",e=>{e.stopPropagation(),this._interactionElements.push(e.target)}),this.addEventListener("end-attempt",e=>{let{responseIdentifier:r,countAttempt:s}=e.detail;this.updateResponseVariable(r,"true"),this.processResponse(s)}),this.addEventListener("qti-set-outcome-value",e=>{let{outcomeIdentifier:r,value:s}=e.detail;this.updateOutcomeVariable(r,s),e.stopPropagation()}),this.addEventListener("qti-interaction-response",this.handleUpdateResponseVariable)}get variables(){return this._context.variables.map(e=>({identifier:e.identifier,value:e.value,type:e.type}))}set variables(e){if(!Array.isArray(e)||e.some(r=>!("identifier"in r))){console.warn("variables property should be an array of VariableDeclaration");return}this._context=R(E({},this._context),{variables:this._context.variables.map(r=>{let s=e.find(n=>n.identifier===r.identifier);return s?E(E({},r),s):r})}),this._context.variables.forEach(r=>{if(r.type==="response"){let s=this._interactionElements.find(n=>n.responseIdentifier===r.identifier);s&&(s.response=r.value)}r.type==="outcome"&&this._feedbackElements.forEach(s=>s.checkShowFeedback(r.identifier))})}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this._emit("qti-assessment-item-connected",this)}disconnectedCallback(){super.disconnectedCallback(),this.resetResponses()}set responses(e){if(e)for(let r of e){this.getResponse(r.responseIdentifier)&&this.updateResponseVariable(r.responseIdentifier,r.response);let n=this._interactionElements.find(o=>o.getAttribute("response-identifier")===r.responseIdentifier);n&&(n.response=r.response)}}render(){return d`<slot></slot>`}showCorrectResponse(e){let s=this._context.variables.filter(n=>"correctResponse"in n&&n.correctResponse).map(n=>({responseIdentifier:n.identifier,response:n.correctResponse}));for(let n of s){let o=this._interactionElements.find(l=>l.getAttribute("response-identifier")===n.responseIdentifier);o&&(o.correctResponse=e?n.response:"")}}processResponse(e=!0){var s;let r=this.querySelector("qti-response-processing");return!r||!r.process?!1:(r.process(),this.adaptive==="false"&&this.updateOutcomeVariable("completionStatus",this._getCompletionStatus()),e&&this.updateOutcomeVariable("numAttempts",(+((s=this._context.variables.find(n=>n.identifier==="numAttempts"))==null?void 0:s.value)+1).toString()),this._emit("qti-response-processed"),!0)}resetResponses(){this._context=this._initialContext}getResponse(e){return this.getVariable(e)}getOutcome(e){return this.getVariable(e)}getVariable(e){return this._context.variables.find(r=>r.identifier===e)||null}handleUpdateResponseVariable(e){let{responseIdentifier:r,response:s}=e.detail;this.updateResponseVariable(r,s)}updateResponseVariable(e,r){this._context=R(E({},this._context),{variables:this._context.variables.map(s=>s.identifier!==e?s:R(E({},s),{value:r}))}),this._emit("qti-interaction-changed",{item:this.identifier,responseIdentifier:e,response:r}),this.adaptive==="false"&&this.updateOutcomeVariable("completionStatus",this._getCompletionStatus())}updateOutcomeVariable(e,r){var n;let s=this.getOutcome(e);if(!s){console.warn(`Can not set qti-outcome-identifier: ${e}, it is not available`);return}this._context=R(E({},this._context),{variables:this._context.variables.map(o=>o.identifier!==e?o:R(E({},o),{value:s.cardinality==="single"?r:[...o.value,r]}))}),this._feedbackElements.forEach(o=>o.checkShowFeedback(e)),this._emit("qti-outcome-changed",{item:this.identifier,outcomeIdentifier:e,value:(n=this._context.variables.find(o=>o.identifier===e))==null?void 0:n.value})}_getCompletionStatus(){return this._interactionElements.every(e=>e.validate())?"completed":this._interactionElements.some(e=>e.validate())?"incomplete":"not_attempted"}_emit(e,r=null){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:r}))}};a([p({type:String})],N.prototype,"title",2),a([p({type:String})],N.prototype,"identifier",2),a([p({type:String})],N.prototype,"adaptive",2),a([p({type:String})],N.prototype,"timeDependent",2),a([p({type:Boolean})],N.prototype,"disabled",2),a([T("disabled",{waitUntilFirstUpdate:!1})],N.prototype,"_handleDisabledChange",2),a([p({type:Boolean})],N.prototype,"readonly",2),a([T("readonly",{waitUntilFirstUpdate:!0})],N.prototype,"_handleReadonlyChange",2),a([Xt({context:U})],N.prototype,"_context",2),N=a([h("qti-assessment-item")],N);var Ks=String.raw,ps=()=>{let i,t={async load(e,r=!1){return new Promise((s,n)=>{rr(e,r).then(o=>(i=o,s(t)))})},parse(e){return i=sr(e),t},path:e=>(Gs(i,e),t),fn(e){return e(i),t},pciHooks(e){let r=["hook","module"],s=e.substring(0,e.lastIndexOf("/"));for(let n of r)i.querySelectorAll("["+n+"]").forEach(l=>{let c=l.getAttribute(n);!c.startsWith("data:")&&!c.startsWith("http")&&(l.setAttribute("base-url",e),l.setAttribute("module",s+"/"+encodeURIComponent(c+(c.endsWith(".js")?"":".js"))))});return t},customInteraction(e,r){let s=i.querySelector("qti-custom-interaction"),n=s.querySelector("object");return s.setAttribute("data-base-ref",e),s.setAttribute("data-base-item",e+r),s.setAttribute("data",n.getAttribute("data")),s.setAttribute("width",n.getAttribute("width")),s.setAttribute("height",n.getAttribute("height")),s.removeChild(n),t},convertCDATAtoComment(){return Qs(i),t},stripStyleSheets(){return ei(i),t},html(){return new XMLSerializer().serializeToString(_t(i))},xml(){return new XMLSerializer().serializeToString(i)},htmldoc(){return _t(i)},xmldoc(){return i}};return t},an=()=>{let i,t={async load(e){return new Promise((r,s)=>{rr(e).then(n=>(i=n,r(t)))})},parse(e){i=sr(e)},assessmentTest(){let e=i.querySelector('resource[type="imsqti_test_xmlv3p0"]');return{href:e.getAttribute("href"),identifier:e.getAttribute("identifier")}}};return t},ln=()=>{let i,t={async load(e){return new Promise((r,s)=>{rr(e).then(n=>(i=n,r(t)))})},parse(e){return i=sr(e),t},fn(e){return e(i),t},items(){return Zs(i)},html(){return new XMLSerializer().serializeToString(_t(i))},xml(){return new XMLSerializer().serializeToString(i)},htmldoc(){return _t(i)},xmldoc(){return i}};return t},Js=Ks`<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- remove existing namespaces -->
  <xsl:template match="*">
    <!-- remove element prefix -->
    <xsl:element name="{local-name()}">
      <!-- process attributes -->
      <xsl:for-each select="@*">
        <!-- remove attribute prefix -->
        <xsl:attribute name="{local-name()}">
          <xsl:value-of select="."/>
        </xsl:attribute>
      </xsl:for-each>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
</xsl:stylesheet>`;function Zs(i){let t=[];return i.querySelectorAll("qti-assessment-item-ref").forEach(e=>{let r=e.getAttribute("identifier"),s=e.getAttribute("href"),n=e.getAttribute("category");t.push({identifier:r,href:s,category:n})}),t}var tr=null;function rr(i,t=!0){return t&&tr!==null&&tr.abort(),new Promise((e,r)=>{let s=new XMLHttpRequest;tr=s,s.open("GET",i,!0),s.responseType="document",s.onload=()=>{s.status>=200&&s.status<300?e(s.responseXML):r(s.statusText)},s.onerror=()=>{r(s.statusText)},s.send()})}function sr(i){return new DOMParser().parseFromString(i,"text/xml")}function _t(i){let t=new XSLTProcessor,e=new DOMParser().parseFromString(Js,"text/xml");return t.importStylesheet(e),t.transformToFragment(i,document)}function Gs(i,t){t.endsWith("/")||(t+="/"),i.querySelectorAll("[src],[href],[primary-path]").forEach(e=>{var n;let r="";e.getAttribute("src")&&(r="src"),e.getAttribute("href")&&(r="href"),e.getAttribute("primary-path")&&(r="primary-path");let s=(n=e.getAttribute(r))==null?void 0:n.trim();if(!s.startsWith("data:")&&!s.startsWith("http")){let o=t+encodeURI(s);e.setAttribute(r,o)}})}function Qs(i){i.querySelectorAll('qti-custom-operator[class="js.org"] > qti-base-value').forEach(e=>{let r=document.createComment(e.textContent);e.replaceChild(r,e.firstChild)})}function ei(i){i.querySelectorAll("qti-stylesheet").forEach(t=>t.remove())}var Ce=class extends g{constructor(){super(...arguments);this.identifier="";this.href=""}async connectedCallback(){super.connectedCallback();let e=new Event("qti-assessment-stimulus-ref-connected",{cancelable:!0,bubbles:!0});if(this.dispatchEvent(e)){let n=this.closest("qti-assessment-item").querySelector(`[data-stimulus-idref=${this.identifier}]`);n?await this.loadAndAppendStimulus(n):console.warn(`Stimulus with data-stimulus-idref ${this.identifier} not found`)}}async loadAndAppendStimulus(e){let r=this.href.substring(0,this.href.lastIndexOf("/")),s=await ps().load(this.href).then(n=>n.path(r).htmldoc());if(s){let n=s.querySelectorAll("qti-stimulus-body, qti-stylesheet");e.append(...n)}}};a([p({type:String})],Ce.prototype,"identifier",2),a([p({type:String})],Ce.prototype,"href",2),Ce=a([h("qti-assessment-stimulus-ref")],Ce);var ti={SPACE:32},M=class extends g{constructor(){super(...arguments);this.tabindex=0;this.disabled=!1;this.readonly=!1;this.checked=!1}handleDisabledChange(e,r){r?(this.tabindex=void 0,this.blur()):this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("click",this._onClick),this.dispatchEvent(new CustomEvent("qti-register-choice",{bubbles:!0,cancelable:!1,composed:!0}))}disconnectedCallback(){this.removeEventListener("keyup",this._onKeyUp),this.removeEventListener("click",this._onClick),this.dispatchEvent(new CustomEvent("qti-loose-choice",{bubbles:!0,cancelable:!1,composed:!0}))}reset(){this.checked=!1,this.disabled=!1}_onKeyUp(e){if(!e.altKey)switch(e.keyCode){case ti.SPACE:e.preventDefault(),this._toggleChecked();break;default:}}_onClick(){this._toggleChecked()}_toggleChecked(){this.disabled||this.readonly||(this.checked=!this.checked,this.dispatchEvent(new CustomEvent("qti-choice-element-selected",{bubbles:!0,cancelable:!1,composed:!0,detail:{identifier:this.identifier,checked:this.checked}})))}validateAllProps(){return!!this.getAttribute("identifier")}render(){return this.validateAllProps()||console.warn(`Invalid props for ${this.outerHTML}`,"missing identifier"),d` <slot></slot> `}};a([p({type:String})],M.prototype,"identifier",2),a([p({type:Number,reflect:!0})],M.prototype,"tabindex",2),a([p({reflect:!0,type:Boolean,attribute:"aria-disabled",converter:{toAttribute:e=>e}})],M.prototype,"disabled",2),a([p({reflect:!0,type:Boolean,attribute:"aria-readonly",converter:{toAttribute:e=>e}})],M.prototype,"readonly",2),a([p({reflect:!0,type:Boolean,attribute:"aria-checked",converter:{toAttribute:e=>e}})],M.prototype,"checked",2),a([T("disabled",{waitUntilFirstUpdate:!0})],M.prototype,"handleDisabledChange",1);var ds=b`
  :host {
    display: block;
  }
`;var qe=class extends g{render(){return d`<slot name="qti-rubric-block"></slot><slot></slot>`}};qe.styles=ds,qe=a([h("qti-item-body")],qe);var Ct=class extends g{render(){return d`<slot></slot>`}connectedCallback(){this.parentElement.tagName.endsWith("INTERACTION")&&this.setAttribute("slot","prompt")}};Ct=a([h("qti-prompt")],Ct);var qt=class extends g{firstUpdated(t){super.firstUpdated(t);let e=this,r=this.getAttribute("href");if(r!==null){let s=document.createElement("link");s.rel="stylesheet",s.type="text/css",s.media="screen",s.href=r,e.appendChild(s),this.styleLink=s}if(this.textContent!==null){let s=document.createElement("style");s.media="screen",s.textContent=this.textContent,e.appendChild(s),this.styleLink=s}}disconnectedCallback(){if(this.styleLink)try{this.styleLink.remove()}catch(t){console.log("could not remove stylesheet")}}};qt=a([h("qti-stylesheet")],qt);var ie=class extends g{render(){return d`<slot></slot>`}defaultValues(t){let e=Array.from(this.querySelectorAll("qti-default-value > qti-value"));if(e.length===0)return null;let r=e.map(s=>s.innerHTML);return r.length>1||t.cardinality==="multiple"||t.cardinality==="ordered"?r:r[0]}};ie=a([h("qti-variabledeclaration")],ie);var I=class extends ie{render(){var e,r;let t=(r=(e=this.itemContext)==null?void 0:e.variables.find(s=>s.identifier===this.identifier))==null?void 0:r.value;return d`${JSON.stringify(t,null,2)}`}get interpolationTable(){let t=this.querySelector("qti-interpolation-table");if(t){let e=new Map;for(let r of t.querySelectorAll("qti-interpolation-table-entry")){!r.getAttribute("source-value")&&r.getAttribute("target-value")&&console.error("source-value or target-value is missing in qti-interpolation-table-entry");let s=parseInt(r.getAttribute("source-value")),n=parseInt(r.getAttribute("target-value"));(isNaN(s)||isNaN(n))&&console.error("source-value or target-value is not a number in qti-interpolation-table-entry"),e.set(s,n)}return e}return null}connectedCallback(){super.connectedCallback();let t={identifier:this.identifier,cardinality:this.cardinality,baseType:this.baseType,type:"outcome",value:null,interpolationTable:this.interpolationTable};t.value=this.defaultValues(t),this.dispatchEvent(new CustomEvent("qti-register-variable",{bubbles:!0,composed:!0,detail:{variable:t}}))}};I.styles=[b`
      :host {
        display: none;
      }
    `],a([p({type:String,attribute:"base-type"})],I.prototype,"baseType",2),a([p({type:String,attribute:"external-scored"})],I.prototype,"externalScored",2),a([p({type:String})],I.prototype,"identifier",2),a([p({type:String})],I.prototype,"cardinality",2),a([J({context:U,subscribe:!0}),_()],I.prototype,"itemContext",2),I=a([h("qti-outcome-declaration")],I);var Q=class extends ie{render(){var e,r;let t=(r=(e=this.itemContext)==null?void 0:e.variables.find(s=>s.identifier===this.identifier))==null?void 0:r.value;return d`${JSON.stringify(t,null,2)}`}connectedCallback(){super.connectedCallback();let t={baseType:this.baseType,identifier:this.identifier,correctResponse:this.correctResponse,cardinality:this.cardinality||"single",mapping:this.mapping,value:null,type:"response",candidateResponse:null};t.value=this.defaultValues(t),this.dispatchEvent(new CustomEvent("qti-register-variable",{bubbles:!0,composed:!0,detail:{variable:t}}))}get correctResponse(){let t,e=this.querySelector("qti-correct-response");if(e){let r=e.querySelectorAll("qti-value");if(this.cardinality==="single"&&r.length>0)t=r[0].textContent,r[0].remove();else if(this.cardinality!=="single"){t=[];for(let s=0;s<r.length;s++)t.push(r[s].textContent),r[s].remove()}}return t}get mapping(){return this.querySelector("qti-mapping")}};Q.styles=[b`
      :host {
        display: none;
      }
    `],a([p({type:String,attribute:"base-type"})],Q.prototype,"baseType",2),a([p({type:String})],Q.prototype,"identifier",2),a([p({type:String})],Q.prototype,"cardinality",2),a([J({context:U,subscribe:!0}),_()],Q.prototype,"itemContext",2),Q=a([h("qti-response-declaration")],Q);var At=class extends g{};At=a([h("qti-companion-materials-info")],At);var wt=class extends g{render(){return d`<slot></slot>`}};wt=a([h("qti-content-body")],wt);var F=class extends g{handleclassNamesChange(t,e){this.classNames.split(" ").forEach(s=>{switch(s){case"qti-rubric-discretionary-placement":this.setAttribute("slot","qti-rubric-block");break;case"qti-rubric-inline":this.setAttribute("slot","");break;default:break}})}render(){return d`<slot></slot>`}connectedCallback(){super.connectedCallback(),this.setAttribute("slot","qti-rubric-block")}};F.styles=b`
    :host {
      display: block;
    }
  `,a([p({type:String})],F.prototype,"id",2),a([p({type:String})],F.prototype,"use",2),a([p({type:String})],F.prototype,"view",2),a([p({type:String,attribute:"class"})],F.prototype,"classNames",2),a([T("classNames",{waitUntilFirstUpdate:!0})],F.prototype,"handleclassNamesChange",1),F=a([h("qti-rubric-block")],F);var ri=()=>new Intl.NumberFormat().format(.1).replace(/\d/g,""),Be=i=>{if(typeof i=="string")return i;let t=ri();return t==="."?i.toLocaleString():i.toString().replace(".","").replace(t,".")};function ir(i){return i==null}var H=class extends g{connectedCallback(){super.connectedCallback(),this.dispatchEvent(new CustomEvent("qti-register-feedback",{bubbles:!0,composed:!0,detail:this}))}checkShowFeedback(t){let e=this.closest("qti-assessment-item").getOutcome(t);if(this.outcomeIdentifier!==t||!e)return;let r=!1;Array.isArray(e.value)?r=e.value.includes(this.identifier):r=!ir(this.identifier)&&!ir(e==null?void 0:e.value)&&this.identifier===e.value||!1,this.showFeedback(r)}showFeedback(t){this.showStatus=t&&this.showHide==="show"||!t&&this.showHide==="hide"?"on":"off"}};a([p({type:String,attribute:"show-hide"})],H.prototype,"showHide",2),a([p({type:String,attribute:"outcome-identifier"})],H.prototype,"outcomeIdentifier",2),a([p({type:String})],H.prototype,"identifier",2),a([p({type:String,attribute:!1})],H.prototype,"showStatus",2);var je=class extends H{render(){return d` <slot part="feedback" class="feedback ${this.showStatus}"></slot> `}firstUpdated(t){this.checkShowFeedback(this.outcomeIdentifier)}};je.styles=b`
    :host {
      display: block;
    }
    .on {
      display: block;
    }
    .off {
      display: none;
    }
  `,je=a([h("qti-feedback-block")],je);var Xe=class extends H{constructor(){super(...arguments);this.render=()=>d` <slot part="feedback" class="${this.showStatus}"></slot> `}};Xe.styles=b`
    .on {
      display: inline-block;
    }
    .off {
      display: none;
    }
  `,Xe=a([h("qti-feedback-inline")],Xe);var Ye=class extends H{constructor(){super(...arguments);this.render=()=>d` <slot part="feedback" class="${this.showStatus}"></slot> `}};Ye.styles=b`
    .on {
      display: inline-block;
    }
    .off {
      display: none;
    }
  `,Ye=a([h("qti-modal-feedback")],Ye);var B=i=>i!=null?i:q;var w=class extends g{constructor(){super(...arguments);this.responseIdentifier="";this.disabled=!1;this.readonly=!1}set correctResponse(e){console.warn("correctResponse is not implemented")}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new CustomEvent("qti-register-interaction",{bubbles:!0,cancelable:!1,composed:!0}))}saveResponse(e){this.dispatchEvent(new CustomEvent("qti-interaction-response",{bubbles:!0,cancelable:!1,composed:!0,detail:{responseIdentifier:this.responseIdentifier,response:e}}))}};a([p({attribute:"response-identifier"})],w.prototype,"responseIdentifier",2),a([p({reflect:!0,type:Boolean})],w.prototype,"disabled",2),a([p({reflect:!0,type:Boolean})],w.prototype,"readonly",2);var{I:si}=is;var hs=i=>i.strings===void 0,us=()=>document.createComment(""),Ae=(i,t,e)=>{var n;let r=i._$AA.parentNode,s=t===void 0?i._$AB:t._$AA;if(e===void 0){let o=r.insertBefore(us(),s),l=r.insertBefore(us(),s);e=new si(o,l,i,i.options)}else{let o=e._$AB.nextSibling,l=e._$AM,c=l!==i;if(c){let u;(n=e._$AQ)==null||n.call(e,i),e._$AM=i,e._$AP!==void 0&&(u=i._$AU)!==l._$AU&&e._$AP(u)}if(o!==s||c){let u=e._$AA;for(;u!==o;){let m=u.nextSibling;r.insertBefore(u,s),u=m}}}return e},oe=(i,t,e=i)=>(i._$AI(t,e),i),ii={},ms=(i,t=ii)=>i._$AH=t,fs=i=>i._$AH,Tt=i=>{var r;(r=i._$AP)==null||r.call(i,!1,!0);let t=i._$AA,e=i._$AB.nextSibling;for(;t!==e;){let s=t.nextSibling;t.remove(),t=s}};var ne={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ee=i=>(...t)=>({_$litDirective$:i,values:t}),j=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var ze=(i,t)=>{var r;let e=i._$AN;if(e===void 0)return!1;for(let s of e)(r=s._$AO)==null||r.call(s,t,!1),ze(s,t);return!0},Rt=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},gs=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),ai(t)}};function oi(i){this._$AN!==void 0?(Rt(this),this._$AM=i,gs(this)):this._$AM=i}function ni(i,t=!1,e=0){let r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(r))for(let n=e;n<r.length;n++)ze(r[n],!1),Rt(r[n]);else r!=null&&(ze(r,!1),Rt(r));else ze(this,i)}var ai=i=>{var t,e;i.type==ne.CHILD&&((t=i._$AP)!=null||(i._$AP=ni),(e=i._$AQ)!=null||(i._$AQ=oi))},St=class extends j{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),gs(this),this.isConnected=t._$AU}_$AO(t,e=!0){var r,s;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(s=this.disconnected)==null||s.call(this)),e&&(ze(this,t),Rt(this))}setValue(t){if(hs(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var $t=()=>new nr,nr=class{},or=new WeakMap,bs=ee(class extends St{render(i){return q}update(i,[t]){var r;let e=t!==this.Y;return e&&this.Y!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.Y=t,this.ht=(r=i.options)==null?void 0:r.host,this.rt(this.ct=i.element)),q}rt(i){var t;if(this.isConnected||(i=void 0),typeof this.Y=="function"){let e=(t=this.ht)!=null?t:globalThis,r=or.get(e);r===void 0&&(r=new WeakMap,or.set(e,r)),r.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),r.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t,e;return typeof this.Y=="function"?(t=or.get((i=this.ht)!=null?i:globalThis))==null?void 0:t.get(this.Y):(e=this.Y)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var X=class extends w{constructor(){super(...arguments);this.textareaRef=$t();this._value=""}handleclassNamesChange(e,r){this.classNames.split(" ").forEach(n=>{if(n.startsWith("qti-height-lines")){let o=n.replace("qti-height-lines-","");this.textareaRef&&(this.textareaRef.value.rows=parseInt(o))}})}set response(e){this._value=e!==void 0?e:""}validate(){return this._value!==""}static get styles(){return[b`
        /* PK: display host as block, else design will be collapsed */
        :host {
          display: block;
        }
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `]}render(){return d`<slot name="prompt"></slot
      ><textarea
        part="textarea"
        ${bs(this.textareaRef)}
        spellcheck="false"
        autocomplete="off"
        @keydown="${e=>e.stopImmediatePropagation()}"
        @keyup="${this.textChanged}"
        @change="${this.textChanged}"
        placeholder="${B(this.placeholderText?this.placeholderText:void 0)}"
        maxlength="${B(this.expectedLength?this.expectedLength:void 0)}"
        pattern="${B(this.patternMask?this.patternMask:void 0)}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        .value=${this._value}
      ></textarea>`}textChanged(e){if(this.disabled||this.readonly)return;let r=e.target;this.setEmptyAttribute(r.value),this._value!==r.value&&(this._value=r.value,this.saveResponse(r.value))}reset(){this._value=""}setEmptyAttribute(e){this.setAttribute("empty",e===""?"true":"false")}};a([p({type:Number,attribute:"expected-length"})],X.prototype,"expectedLength",2),a([p({type:String,attribute:"pattern-mask"})],X.prototype,"patternMask",2),a([p({type:String,attribute:"placeholder-text"})],X.prototype,"placeholderText",2),a([_()],X.prototype,"_value",2),a([p({type:String,attribute:"class"})],X.prototype,"classNames",2),a([T("classNames",{waitUntilFirstUpdate:!0})],X.prototype,"handleclassNamesChange",1),X=a([h("qti-extended-text-interaction")],X);function vs(i,t){let e,r=E({},t);return(s,n)=>{let{connectedCallback:o,disconnectedCallback:l}=s;s.connectedCallback=function(){var m;o.call(this);let c=f=>{let y=Array.from(this.querySelectorAll(i));for(let v of f){let A=Array.from(v.addedNodes).map(S=>S),C=Array.from(v.addedNodes).map(S=>S);v.type==="childList"&&A.find(S=>y.includes(S))&&this[n](A,C)}};e=new MutationObserver(c),e.observe(this,{childList:!0,subtree:!0});let u=(m=this.querySelectorAll(i))!=null?m:[];this[n](Array.from(u),[])},s.disconnectedCallback=function(){l.call(this),e.disconnect()}}}var P=class extends w{constructor(){super(...arguments);this._value="";this._correctValue="";this._size=5;this.inputRef=$t()}handleclassNamesChange(e,r){r.split(" ").forEach(n=>{if(n.startsWith("qti-input-width")){let o=n.replace("qti-input-width-","");this._size=parseInt(o)}})}set response(e){this._value=e!==void 0?e:""}validate(){return this._value!==""}static get styles(){return[b`
        [part='correct'] {
          position: absolute;
          width: 100%;
        }
      `]}set correctResponse(e){this._correctValue=e}render(){return d`
      <div part="correct">${this._correctValue}</div>
      <input
        part="input"
        spellcheck="false"
        autocomplete="off"
        @keydown="${e=>e.stopImmediatePropagation()}"
        @keyup="${this.textChanged}"
        @change="${this.textChanged}"
        type="${this.patternMask=="[0-9]*"?"number":"text"}"
        placeholder="${B(this.placeholderText?this.placeholderText:void 0)}"
        .value="${this._value}"
        size="${this._size}"
        pattern="${B(this.patternMask?this.patternMask:void 0)}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
      />
    `}textChanged(e){if(this.disabled||this.readonly)return;let r=e.target;this.setEmptyAttribute(r.value),this._value!==r.value&&(this._value=r.value,this.saveResponse(r.value))}reset(){this._value=""}setEmptyAttribute(e){this.setAttribute("empty",e===""?"true":"false")}};a([p({type:Number,attribute:"expected-length"})],P.prototype,"expectedLength",2),a([p({type:String,attribute:"pattern-mask"})],P.prototype,"patternMask",2),a([p({type:String,attribute:"placeholder-text"})],P.prototype,"placeholderText",2),a([_()],P.prototype,"_value",2),a([_()],P.prototype,"_correctValue",2),a([_()],P.prototype,"_size",2),a([p({type:String,attribute:"class"})],P.prototype,"classNames",2),a([T("classNames")],P.prototype,"handleclassNamesChange",1),P=a([h("qti-text-entry-interaction")],P);var $=class extends w{constructor(){super();this._choiceElements=[];this.minChoices=0;this.maxChoices=1;this._handleDisabledChange=(e,r)=>this._choiceElements.forEach(s=>s.disabled=r);this._handleReadonlyChange=(e,r)=>this._choiceElements.forEach(s=>s.readonly=r);this._handleMaxChoicesChange=()=>this._determineInputType();this.addEventListener("qti-register-choice",this._registerChoiceElement),this.addEventListener("qti-loose-choice",this._looseChoiceElement)}validate(){return this._choiceElements.reduce((r,s)=>r+(s.checked?1:0),0)>=this.minChoices}set response(e){let r=Array.isArray(e)?e:[e];this._choiceElements.forEach(s=>{s.checked=!!r.find(n=>n===s.identifier)})}set correctResponse(e){let r=Array.isArray(e)?e:[e];if(e==""){this._choiceElements.forEach(s=>{s.removeAttribute("data-correct-response")});return}this._choiceElements.forEach(s=>{s.setAttribute("data-correct-response",r.find(n=>n===s.identifier)?"true":"false")})}connectedCallback(){super.connectedCallback(),this.addEventListener("qti-choice-element-selected",this._choiceElementSelectedHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("qti-choice-element-selected",this._choiceElementSelectedHandler),this.removeEventListener("qti-register-choice",this._registerChoiceElement)}_registerChoiceElement(e){e.stopPropagation();let r=e.target;this._choiceElements.push(r),this._setInputType(r)}_looseChoiceElement(e){e.stopPropagation();let r=e.target;this._choiceElements.push(r),this._choiceElements=this._choiceElements.filter(s=>s!==r)}_determineInputType(){this._choiceElements.forEach(e=>{this._setInputType(e)})}_setInputType(e){this.maxChoices===1?e.setAttribute("role","radio"):e.setAttribute("role","checkbox")}_choiceElementSelectedHandler(e){this.maxChoices===1&&this._choiceElements.filter(r=>r.identifier!==e.detail.identifier).forEach(r=>{r.checked=!1}),this._choiceElementSelected()}_choiceElementSelected(){let e=this._choiceElements.filter(s=>s.checked).map(s=>s.identifier);this.maxChoices>1&&(this.maxChoices===e.length?this._choiceElements.forEach(s=>s.disabled=!s.checked):this._choiceElements.forEach(s=>s.disabled=!1));let r;this.maxChoices===1?r=e.length>0?e[0]:void 0:r=e,this.saveResponse(r)}};a([p({type:Number,attribute:"min-choices"})],$.prototype,"minChoices",2),a([p({type:Number,attribute:"max-choices"})],$.prototype,"maxChoices",2),a([T("disabled",{waitUntilFirstUpdate:!0})],$.prototype,"_handleDisabledChange",2),a([T("readonly",{waitUntilFirstUpdate:!0})],$.prototype,"_handleReadonlyChange",2),a([T("maxChoices",{waitUntilFirstUpdate:!0})],$.prototype,"_handleMaxChoicesChange",2);var kt=class extends ${constructor(){super(...arguments);this.render=()=>d`<slot></slot>`}connectedCallback(){super.connectedCallback(),this.setAttribute("qti-hottext-interaction","")}};kt=a([h("qti-hottext-interaction")],kt);var We=class extends j{constructor(t){if(super(t),this.it=q,t.type!==ne.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===q||t==null)return this._t=void 0,this.it=t;if(t===L)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};We.directiveName="unsafeHTML",We.resultType=1;var we=ee(We);var ae=class extends w{constructor(){super(...arguments);this.options=[];this.correctOption="";this.dataPrompt="select"}static get styles(){return[b`
        :host {
          display: inline-block;
        }
      `]}render(){return d`
      <select part="select" @change="${this.choiceSelected}" ?disabled="${this.disabled}" ?readonly="${this.readonly}">
        ${this.options.map(e=>d`
            <option value="${e.value}" ?selected="${e.selected}">${we(e.textContent)}</option>
          `)}
      </select>

      ${we(this.correctOption)}
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("on-dropdown-selected",this.choiceSelected);let e=Array.from(this.querySelectorAll("qti-inline-choice"));this.options=[{textContent:this.dataPrompt,value:"",selected:!1},...e.map(r=>({textContent:r.innerHTML,value:r.getAttribute("identifier"),selected:!1}))]}disconnectedCallback(){this.removeEventListener("on-dropdown-selected",this.choiceSelected)}validate(){let e=this.options.find(r=>r.selected);return e?e.value!=="":!1}reset(){this.options=this.options.map((e,r)=>R(E({},e),{selected:r===0}))}set response(e){this.options=this.options.map(r=>(e===r.value&&(r.selected=!0),r))}set correctResponse(e){if(e===""){this.correctOption="";return}this.correctOption=`<span part="correct-option">${this.options.find(r=>e===r.value).textContent}</span>`}choiceSelected(e){let r=e.target.value;this.options=this.options.map(s=>R(E({},s),{selected:s.value===r})),this.saveResponse(r)}};ae.inputWidthClass=["","qti-input-width-2","qti-input-width-1","qti-input-width-3","qti-input-width-4","qti-input-width-6","qti-input-width-10","qti-input-width-15","qti-input-width-20","qti-input-width-72"],a([_()],ae.prototype,"options",2),a([_()],ae.prototype,"correctOption",2),a([p({attribute:"data-prompt",type:String})],ae.prototype,"dataPrompt",2),ae=a([h("qti-inline-choice-interaction")],ae);var ys=b`
  :host {
    display: flex;
    flex-direction: column;
    // align-items: flex-start;
  }
`;var Te=class extends ${render(){return d` <slot name="prompt"></slot><slot part="slot"></slot>`}};Te.styles=ys,a([p({type:String})],Te.prototype,"orientation",2),Te=a([h("qti-choice-interaction")],Te);var Ke=class extends g{render(){return d`<slot></slot>`}process(){let t=new ar,e=[...this.children];t.process(e)}};Ke.styles=[b`
      :host {
        display: none;
      }
    `],Ke=a([h("qti-outcome-processing")],Ke);var ar=class{process(t){for(let e of t)e.process()}};var xs=`<qti-response-processing>
  <qti-response-condition>
    <qti-response-if>
      <qti-match>
        <qti-variable identifier="RESPONSE"></qti-variable>
        <qti-correct identifier="RESPONSE"></qti-correct>
      </qti-match>
      <qti-set-outcome-value identifier="SCORE">
        <qti-base-value base-type="float">1</qti-base-value>
      </qti-set-outcome-value>
    </qti-response-if>
    <qti-response-else>
      <qti-set-outcome-value identifier="SCORE">
        <qti-base-value base-type="float">0</qti-base-value>
      </qti-set-outcome-value>
    </qti-response-else>
  </qti-response-condition>
</qti-response-processing>`,Es=`<qti-response-processing>
  <qti-response-condition>
    <qti-response-if>
      <qti-is-null>
        <qti-variable identifier="RESPONSE"></qti-variable>
      </qti-is-null>
      <qti-set-outcome-value identifier="SCORE">
        <qti-base-value base-type="float">0.0</qti-base-value>
      </qti-set-outcome-value>
    </qti-response-if>
    <qti-response-else>
      <qti-set-outcome-value identifier="SCORE">
        <qti-map-response identifier="RESPONSE"> </qti-map-response>
      </qti-set-outcome-value>
    </qti-response-else>
  </qti-response-condition>
</qti-response-processing>`,_s=`<qti-response-processing>
  <qti-response-condition>
    <qti-response-if>
      <qti-is-null>
        <qti-variable identifier="RESPONSE"></qti-variable>
      </qti-is-null>
      <qti-set-outcome-value identifier="SCORE">
        <qti-base-value base-type="float">0</qti-base-value>
      </qti-set-outcome-value>
    </qti-response-if>
    <qti-response-else>
      <qti-set-outcome-value identifier="SCORE">
        <qti-map-response-point identifier="RESPONSE"></qti-map-response-point>
      </qti-set-outcome-value>
    </qti-response-else>
  </qti-response-condition>
</qti-response-processing>`;var me=class extends g{render(){return d`<slot></slot>`}process(){let t=[...this.children];for(let e of t)e.process()}firstUpdated(t){if(this.getAttribute("template")){let e=this.getAttribute("template").split("/"),r=e[e.length-1].replace(".xml","");switch(this.innerHTML="",r){case"map_response":{this.appendChild(this.fragmentFromString(Es).firstElementChild.firstElementChild);break}case"map_response_point":{this.appendChild(this.fragmentFromString(_s).firstElementChild.firstElementChild);break}case"match_correct":this.appendChild(this.fragmentFromString(xs).firstElementChild.firstElementChild);break}}}fragmentFromString(t){return document.createRange().createContextualFragment(t)}};me.styles=[b`
      :host {
        display: none;
      }
    `],me=a([h("qti-response-processing")],me);var Y=class extends g{render(){return d`<slot></slot>`}process(){throw new Error("Not implemented")}};Y=a([h("qti-rule")],Y);var Mt=class extends Y{get childExpression(){return this.firstElementChild}process(){let t=this.getAttribute("identifier"),e=this.closest("qti-assessment-item").getVariable(t),r;return e.interpolationTable&&(r=e.interpolationTable.get(parseInt(this.childExpression.calculate()))),r==null?(console.warn("lookupOutcomeValue: value is null or undefined"),0):(this.dispatchEvent(new CustomEvent("qti-set-outcome-value",{bubbles:!0,composed:!0,detail:{outcomeIdentifier:this.identifier,value:Be(r)}})),r)}};a([p({type:String})],Mt.prototype,"identifier",2);customElements.define("qti-lookup-outcome-value",Mt);var lr=class extends Y{render(){return d`<slot></slot>`}process(){let t=[...this.children];for(let e=0;e<t.length;e++){let r=t[e];if(r.calculate()){r.process();return}}}};customElements.define("qti-response-condition",lr);var cr=class extends Y{process(){let t=this.getAttribute("identifier"),e=this.firstElementChild,s=new pr(e).process();this.dispatchEvent(new CustomEvent("qti-set-outcome-value",{bubbles:!0,composed:!0,detail:{outcomeIdentifier:t,value:Array.isArray(s)?s.map(n=>Be(n)):Be(s)}}))}},pr=class{constructor(t){this.expression=t}process(){let t=this.expression?this.expression.calculate():null;if(t==null){console.warn("setOutcomeValue: value is null or undefined");return}return t}};customElements.define("qti-set-outcome-value",cr);var Je=class extends g{render(){return d`<slot></slot>`}calculate(){return!0}getSubRules(){return[...this.children]}process(){let t=this.getSubRules();for(let e=0;e<t.length;e++)t[e].process()}};customElements.define("qti-response-else",Je);var Ze=class extends Je{calculate(){return this.firstElementChild.calculate()}getSubRules(){let t=[];for(let e=1;e<this.children.length;e++)t.push(this.children[e]);return t}};customElements.define("qti-response-if",Ze);var dr=class extends Ze{render(){return d`${super.render()}`}};customElements.define("qti-response-else-if",dr);var x=class extends g{constructor(){super(...arguments);this.getVariables=()=>Array.from(this.children).map(e=>{switch(e.tagName.toLowerCase()){case"qti-base-value":return{baseType:e.getAttribute("base-type"),value:e.textContent,cardinality:"single"};case"qti-variable":{let r=e.getAttribute("identifier")||"";return this.assessmentItem.getVariable(r)}case"qti-multiple":{let s=e.getResult();return s.length>0?{identifier:"",baseType:s[0].baseType,value:s.map(n=>n.value),cardinality:"multiple",type:"response"}:null}case"qti-correct":{let r=e.getAttribute("identifier")||"",s=this.assessmentItem.getResponse(r);return{baseType:s.baseType,value:s.correctResponse,cardinality:s.cardinality}}default:{try{return{baseType:"integer",value:e.getResult().toString(),cardinality:"single"}}catch(r){console.warn("default not sufficient")}return null}}}).filter(e=>e!==null)}render(){return d`<pre>${JSON.stringify(this.result,null,2)}</pre>
      <slot></slot>`}calculate(){return this.result=this.getResult(),this.result}getResult(){throw new Error("Not implemented")}get assessmentItem(){return this.closest("qti-assessment-item")}};x.styles=b`
    slot {
      display: none;
    }
  `,a([_()],x.prototype,"result",2);var V=class extends x{calculate(){return this.result=this.getResult(),this.result}getResult(){throw new Error("Not implemented")}};var Lt=class extends li(V){calculate(){return this.calculateChildren(Array.from(this.children))}};function li(i){return class extends i{calculateChildren(e){return e.map(s=>{let n=s;if(!n.calculate)return console.error("Element doesn't implement QtiConditionExpression"),null;let o=n.calculate();if(typeof o=="string")if(o==="true")o=!0;else if(o==="false")o=!1;else return console.error("unexpected value in qti-and, expected boolean"),null;return o}).every(s=>typeof s=="boolean"&&s)}}}customElements.define("qti-and",Lt);var Nt=class extends x{constructor(){super(...arguments);this.baseType="string"}getResult(){return this.textContent}};a([p({type:String,attribute:"base-type"})],Nt.prototype,"baseType",2);customElements.define("qti-base-value",Nt);var ur=class extends V{getResult(){let t=this.getVariables();if(this.children.length===2){let e=t[0],r=t[1];if(e.baseType==="directedPair"&&r.baseType==="directedPair"&&e.cardinality==="multiple"){let s=e.value,n=r.value;return s.filter(c=>n.includes(c)).length>0}else if(e.baseType==="directedPair"&&r.baseType==="directedPair"&&e.cardinality==="single"){let s=e.value;return r.value.includes(s)}else console.error("unsupported baseType or cardinality in qti contains, only baseType: directedPair and cardinality: multiple is supported")}else console.error("unexpected number of children in qti contains");return!1}};customElements.define("qti-contains",ur);var hr=class extends x{get interpretation(){return this.getAttribute("interpretation")||""}getResult(){let t=this.getAttribute("identifier")||"",e=this.closest("qti-assessment-item").getResponse(t);return e.correctResponse,e.cardinality!=="single"?e.correctResponse.length>0?e.correctResponse[0]:"":e.correctResponse}};customElements.define("qti-correct",hr);var Ht=class extends x{constructor(){super(...arguments);this.roundingMode="significantFigures"}get figures(){if(!this.getAttribute("figures"))return console.error("figures attribute is missing"),null;let r=parseInt(this.getAttribute("figures")||"0");return isNaN(r)?(console.error("figures attribute is not a number"),null):r<0?(console.error("figures attribute is negative"),null):r<1&&this.roundingMode==="significantFigures"?(console.error("figures cannot be smaller than 1 for RoundingMode significantFigures"),null):r}getResult(){if(this.children.length===2){let e=this.getVariables(),r=e[0],s=e[1];if(this.roundingMode===null)return null;if(r.cardinality!=="single"||s.cardinality!=="single"||Array.isArray(r.value)||Array.isArray(s.value))return console.error("unexpected cardinality in qti equal"),!1;switch(e[0].baseType){case"integer":case"float":{let n=parseFloat(r.value),o=parseFloat(s.value);if(!isNaN(n)&&!isNaN(o))return this.roundingMode==="significantFigures"?n.toPrecision(this.figures)===o.toPrecision(this.figures):Math.round(n*Math.pow(10,this.figures))/Math.pow(10,this.figures)===Math.round(o*Math.pow(10,this.figures))/Math.pow(10,this.figures);console.error(`value cannot be casted to numeric value in equalRounded operator: ${n}, ${o}`);break}default:{console.error("values other than float and int cannot be used in equalRounded operator.");break}}return!1}return console.error("unexpected number of children in qti-equal-rounded"),null}};a([p({type:String})],Ht.prototype,"roundingMode",2);customElements.define("qti-equal-rounded",Ht);var D=class{static compareSingleValues(t,e,r){switch(r){case"identifier":case"string":return t===e;case"integer":{let s=parseInt(t,10),n=parseInt(e,10);if(!isNaN(s)&&!isNaN(n))return s===n;console.error(`Cannot convert ${t} and/or ${e} to int.`);break}case"float":{let s=parseFloat(t),n=parseFloat(e);if(!isNaN(s)&&!isNaN(n))return s===n;console.error(`couldn't convert ${t} and/or ${e} to float.`);break}case"pair":case"directedPair":{let s=t.split(" ").sort(),n=e.split(" ").sort();if(s.length===2&&n.length===2)return r==="pair"&&(s.sort(),n.sort()),s.join(" ")===n.join(" ");console.error(`compared two pair but one of the values does not have 2 values: 1: ${t} 2: ${e}`);break}}return!1}};var Pt=class extends x{constructor(){super(...arguments);this.toleranceMode="exact"}getResult(){if(this.children.length===2){let e=this.getVariables(),r=e[0],s=e[1];return this.toleranceMode!=="exact"?(console.error("toleranceMode is not supported yet"),!1):r.cardinality!=="single"||s.cardinality!=="single"||Array.isArray(r.value)||Array.isArray(s.value)?(console.error("unexpected cardinality in qti equal"),!1):D.compareSingleValues(r.value,s.value,r.baseType)}return console.error("unexpected number of children in qti-equal"),null}};a([p({type:String})],Pt.prototype,"toleranceMode",2);customElements.define("qti-equal",Pt);var mr=class extends x{getResult(){if(this.children.length===2){let t=this.getVariables(),e=t[0],r=t[1];if(e.baseType===r.baseType&&(e.baseType==="integer"||e.baseType==="float"))return+e.value>+r.value;console.error("unexpected baseType or cardinality in qti gt")}return console.error("unexpected number of children in qt"),null}};customElements.define("qti-gt",mr);var fr=class extends V{getResult(){if(this.children.length===2){let t=this.getVariables(),e=t[0],r=t[1];return e.baseType===r.baseType&&(e.baseType==="integer"||e.baseType==="float")?+e.value>=+r.value:(console.error("unexpected baseType or cardinality in qti gte"),null)}return console.log("unexpected number of children in qte"),null}};customElements.define("qti-gte",fr);var gr=class extends x{getResult(){if(this.children.length===1){let t=this.getVariables();if(!t)return!0;let e=t[0].value;return e==null||e==null||e===""}return console.error("unexpected number of children in qti Null"),null}};customElements.define("qti-is-null",gr);var br=class extends x{getResult(){if(this.children.length===2){let t=this.getVariables(),e=t[0],r=t[1];if(e.baseType===r.baseType&&(e.baseType==="integer"||e.baseType==="float"))return+e.value<+r.value;console.error("unexpected baseType or cardinality in qti lt")}return console.error("unexpected number of children in lt"),null}};customElements.define("qti-lt",br);var vr=class extends V{getResult(){if(this.children.length===2){let t=this.getVariables(),e=t[0],r=t[1];return e.baseType===r.baseType&&(e.baseType==="integer"||e.baseType==="float")?+e.value<=+r.value:(console.error("unexpected baseType or cardinality in qti lte"),null)}return console.log("unexpected number of children in lte"),null}};customElements.define("qti-lte",vr);var Vt=class extends x{getResult(){let t=this.assessmentItem.getResponse(this.identifier);if(!t)return console.warn(`Response ${this.identifier} can not be found`),null;let e=t.mapping,r=Array.isArray(t.value)?t.value:[t.value],s=0;for(let n of r){let o=e.mapEntries.find(l=>D.compareSingleValues(l.mapKey,n,t.baseType));o==null||o.mappedValue==null?s+=e.defaultValue:s+=o.mappedValue}return e.lowerBound!=null&&(s=Math.max(e.lowerBound,s)),e.upperBound!=null&&(s=Math.min(e.upperBound,s)),s}};a([p({type:String})],Vt.prototype,"identifier",2);customElements.define("qti-map-response",Vt);var Re=class extends g{constructor(){super(...arguments);this.defaultValue=0}get mapEntries(){return Array.from(this.querySelectorAll("qti-map-entry")).map(e=>({mapKey:e.getAttribute("map-key"),mappedValue:+e.getAttribute("mapped-value")}))}};a([p({attribute:"default-value",type:Number})],Re.prototype,"defaultValue",2),a([p({attribute:"lower-bound",type:Number})],Re.prototype,"lowerBound",2),a([p({attribute:"upper-bound",type:Number})],Re.prototype,"upperBound",2);customElements.define("qti-mapping",Re);var yr=class i extends x{getResult(){if(this.children.length===2){let t=this.getVariables(),e=t[0],r=t[1];return i.match(e,r)}return console.error("unexpected number of children in match"),null}static match(t,e){var r;if(e.cardinality==="single")return t.value===null?!1:Array.isArray(t.value)||Array.isArray(e.value)?(console.error("unexpected cardinality in qti match"),!1):D.compareSingleValues((r=t.value)==null?void 0:r.toString(),e.value.toString(),e.baseType);{if(!Array.isArray(t.value)||!Array.isArray(e.value))return console.error("unexpected cardinality in qti match"),!1;if(t.value.length!==e.value.length)return!1;let s=0;for(let n of e.value){if(e.cardinality==="ordered"){let o=t[s];if(!D.compareSingleValues(n,o,e.baseType))return!1}else{let o=null;for(let l of t.value)if(D.compareSingleValues(n,l,e.baseType)){o=l;break}if(o!==null)t.value.splice(t.value.indexOf(o),1);else return!1}s++}return!0}}};customElements.define("qti-match",yr);var xr=class extends x{getResult(){let t=this.getVariables();this.children.length!==2&&console.warn("The member operator takes two sub-expressions");let[e,r]=t;if(e.baseType!==r.baseType&&console.warn("Which must both have the same base-type"),r.cardinality==="multiple"||r.cardinality==="ordered"||console.warn("and the second must be a multiple or ordered container"),(e.baseType==="float"||r.baseType==="float")&&console.warn("The member operator should not be used on sub-expressions with a base-type of float"),(e.baseType==="duration"||r.baseType==="duration")&&console.warn("It must not be used on sub-expressions with a base-type of duration"),e.value===null||r.value===null)return null;let s=e.value;return r.value.includes(s)}};customElements.define("qti-member",xr);var Er=class extends x{getResult(){let t=this.getVariables();if(t.length===0)return console.error("unexpected number of children in qti multiple"),null;for(let e of t)if(e.cardinality!=="multiple"&&e.cardinality!=="single")return console.error("unexpected cardinality in qti multiple"),[];return t}};customElements.define("qti-multiple",Er);var _r=class extends x{render(){return d`${super.render()}`}getResult(){return!this.firstElementChild.calculate()}};customElements.define("qti-not",_r);var Cr=class extends V{getResult(){return Array.from(this.children).map(e=>{let r=e;if(!r.calculate)return console.error("Element doesn't implement QtiConditionExpression"),null;let s=r.calculate();if(typeof s=="string")if(s==="true")s=!0;else if(s==="false")s=!1;else return console.error("unexpected value in qti-or, expected boolean"),null;return s}).some(e=>typeof e=="boolean"&&e)}};customElements.define("qti-or",Cr);var qr=class extends x{getResult(){let t=this.getVariables();if(t.length===0)return console.error("unexpected number of children in qti multiple"),null;for(let e of t)if(e.cardinality!=="ordered"&&e.cardinality!=="single")return console.error("unexpected cardinality in qti ordered"),[];return t}};customElements.define("qti-ordered",qr);var Ge=class extends g{render(){var e,r;let t=(r=(e=this.itemContext)==null?void 0:e.variables.find(s=>s.identifier===this.identifier))==null?void 0:r.value;return d`${JSON.stringify(t,null,2)}`}calculate(){let t=this.closest("qti-assessment-item"),e=this.identifier;return t.getVariable(e).value}};a([p({type:String})],Ge.prototype,"identifier",2),a([J({context:U,subscribe:!0}),_()],Ge.prototype,"itemContext",2);customElements.define("qti-printed-variable",Ge);var Ar=class extends x{getResult(){return this.getVariables().reduce((r,s)=>{if(s.baseType=="float"||s.baseType=="integer")try{return r*parseInt(s.value.toString())}catch(n){console.warn("can not convert to number")}else console.warn(`has another baseType ${s.baseType}`);return r},1)}};customElements.define("qti-product",Ar);var Dt=class extends x{constructor(){super(...arguments);this.caseSensitive="true"}getResult(){if(this.children.length===2){let e=this.getVariables(),r=e[0],s=e[1];if(r.cardinality!=="single"||s.cardinality!=="single"||Array.isArray(r.value)||Array.isArray(s.value))return console.error("unexpected cardinality in qti string-match"),!1;let n=this.caseSensitive==="true"?r.value:r.value.toLowerCase(),o=this.caseSensitive==="true"?s.value:s.value.toLowerCase();return D.compareSingleValues(n,o,r.baseType)}return console.error("unexpected number of children in qti-string-match"),null}};a([p({type:String,attribute:"case-sensitive"})],Dt.prototype,"caseSensitive",2);customElements.define("qti-string-match",Dt);var wr=class extends x{constructor(){super(),this._expression=new Tr(Array.from(this.children))}getResult(){return this._expression.calculate()}},Tr=class{constructor(t){this.expressions=t}calculate(){return this.expressions.map(e=>{if(!e.calculate)return console.error("Element doesn't implement QtiConditionExpression"),null;let r=e.calculate();return Number.isNaN(r)?(console.error("unexpected value in qti-sum, expected number"),null):Number(r)}).reduce((e,r)=>e+r,0)}};customElements.define("qti-sum",wr);var Rr=class extends x{getResult(){let t=this.getAttribute("identifier");return this.closest("qti-assessment-item").getVariable(t).value}};customElements.define("qti-variable",Rr);var te=class extends w{constructor(){super(...arguments);this._errorMessage=null;this.loadConfig=async(e,r)=>{e=this.removeDoubleSlashes(e);try{let s=await fetch(e);if(s.ok){let o=await s.json();for(let l in o.paths)r&&(o.paths[l]=this.getResolvablePath(o.paths[l],r));return o}}catch(s){}return null};this.getResolvablePath=(e,r)=>e!=null&&e.toLocaleLowerCase().startsWith("http")||!r?e:this.removeDoubleSlashes(`${r}/${e}`);this.mergeConfigs=async(e,r,s)=>{var n;for(let o in r==null?void 0:r.paths)if(!e.paths[o]){let l=!1;try{let c=(n=r.paths[o])!=null&&n.toLocaleLowerCase().endsWith(".js")?r.paths[o]:r.paths[o]+".js";(await fetch(c)).ok?e.paths[o]=r.paths[o].replace(/\.js$/,""):l=!0}catch(c){l=!0}if(l&&s)if(typeof s=="string")try{let c=await this.loadConfig(s);c!=null&&c.paths[o]&&(e.paths[o]=c.paths[o].replace(/\.js$/,""))}catch(c){}else typeof s=="object"&&s!=null&&s.paths[o]&&(e.paths[o]=s.paths[o].replace(/\.js$/,""));else l&&console.error("Failed to resolve module: "+o)}}}handleDisabledChange(e,r){this.pci&&this.pci.setDisabled(r)}convertQtiVariableJSON(e){for(let r in e)if(e.hasOwnProperty(r)){let s=e[r];if(s){for(let n in s)if(s.hasOwnProperty(n)){let o=s[n];if(Array.isArray(o))return o.map(String);if(o!=null)return String(o)}}}return null}startChecking(){this.intervalId=setInterval(()=>{let e=this.pci.getResponse(),r=this.pci.getResponse(),s=JSON.stringify(e);if(s!==this.rawResponse){this.rawResponse=s;let n=this.convertQtiVariableJSON(r);this.response=n,this.saveResponse(n)}},200)}stopChecking(){this.intervalId!==void 0&&clearInterval(this.intervalId)}validate(){return!0}set response(e){this.value=e}getTAOConfig(e){let r=e.querySelectorAll("properties"),s={},n=l=>{let c={},u=l.getAttribute("key");if(u){let m=Array.from(l.children),f=m.map(v=>v.getAttribute("key"));f.length>0&&!f.find(v=>!Number.isInteger(+v))?c[u]=m.map(v=>o(v)):c[u]=l.textContent}return c},o=l=>{if(l){let c={};for(let u of l.children)c=E(E({},c),n(u));return c}};for(let l of r)return l.getAttribute("key")||(s=E(E({},s),o(l))),s;return console.log("Can not find qti-custom-interaction config"),null}register(e){var l,c,u,m,f,y;this.pci=e;let r=this.parentElement.tagName==="QTI-CUSTOM-INTERACTION"?"TAO":"IMS",s=r=="IMS"?this.querySelector("qti-interaction-markup"):this.querySelector("markup");s.classList.add("qti-customInteraction"),r=="TAO"&&this.querySelector("properties")&&(this.querySelector("properties").style.display="none");let n=r=="IMS"?{properties:R(E({},this.dataset),{id:this.responseIdentifier}),onready:()=>{console.log("onready")}}:this.getTAOConfig(this);r=="IMS"?e.getInstance(s,n,void 0):e.initialize(this.customInteractionTypeIdentifier,s.firstElementChild,n);let o=this.value;Array.isArray(o)?(c=(l=this.pci).setResponse)==null||c.call(l,{list:{string:o}}):(m=(u=this.pci).setResponse)==null||m.call(u,{base:{string:o}}),(y=(f=this.pci).setDisabled)==null||y.call(f,this.disabled),r=="TAO"&&Array.from(this.querySelectorAll("link")).map(A=>A.getAttribute("href")).forEach(A=>{let C=document.createElement("link");C.rel="stylesheet",C.type="text/css",C.media="screen",C.href=A,s.appendChild(C)}),this.startChecking()}connectedCallback(){super.connectedCallback();let e={context:this.customInteractionTypeIdentifier+this.responseIdentifier,catchError:!0,paths:{}};if(window.requirePaths&&window.requireShim&&(e.paths=window.requirePaths,e.shim=window.requireShim),!globalThis.require){this._errorMessage="requirejs not found, load with cdn: https://cdnjs.com/libraries/require.js";return}this.registerModules(e).then(()=>{requirejs.config(e)(["require"],s=>{!s.defined("qtiCustomInteractionContext")&&define("qtiCustomInteractionContext",()=>({register:o=>{this.register(o)},notifyReady:()=>{}}));let n=s.defined(this.module);s([this.module],o=>{n&&this.register(o)},o=>{this._errorMessage=o})},s=>{this._errorMessage=s})})}disconnectedCallback(){super.disconnectedCallback();let e=this.parentElement.tagName==="QTI-CUSTOM-INTERACTION"?"TAO":"IMS",r=e=="IMS"?this.querySelector("qti-interaction-markup"):this.querySelector("markup"),s=e=="IMS"?document.createElement("qti-interaction-markup"):document.createElement("markup");r==null||r.replaceWith(s),this.stopChecking()}async registerModules(e){let r=this.getAttribute("data-base-url");if(r){let n=`${r}/modules/module_resolution.js`,o=`${r}/modules/module_resolution_fallback.js`;if(n){let l=await this.loadConfig(n,r);await this.mergeConfigs(e,l,o)}}let s=this.querySelector("qti-interaction-modules");if(s){let n=s.querySelectorAll("qti-interaction-module");for(let o of n){let l=o.getAttribute("id"),c=o.getAttribute("primary-path"),u=o.getAttribute("fallback-path"),m=c?{paths:R(E({},e.paths),{[l]:this.getResolvablePath(c,r)})}:null,f=u?{paths:R(E({},e.paths),{[l]:this.getResolvablePath(u,r)})}:null;l&&m&&await this.mergeConfigs(e,m,f)}}}removeDoubleSlashes(e){return e.replace(/([^:]\/)\/+/g,"$1").replace(/\/\//g,"/").replace("http:/","http://").replace("https:/","https://")}render(){return d`<slot></slot>${this._errorMessage&&d`<div style="color:red">
        <h1>Error</h1>
        ${this._errorMessage}
      </div>`}`}};a([T("disabled",{waitUntilFirstUpdate:!0})],te.prototype,"handleDisabledChange",1),a([p({type:String,attribute:"response-identifier"})],te.prototype,"responseIdentifier",2),a([p({type:String,attribute:"module"})],te.prototype,"module",2),a([p({type:String,attribute:"custom-interaction-type-identifier"})],te.prototype,"customInteractionTypeIdentifier",2),a([_()],te.prototype,"_errorMessage",2),te=a([h("qti-portable-custom-interaction")],te);var Ot=class i{constructor(){this._touchBegin=0;this._touchDown=null;this._lastClick=0;this._canDrag=!1;this._dragSrc=null;this._dragCopy=null;this._touchEndCalled=!1;this._dragRunning=!1;this._dataTransfer={data:{},setData:function(t,e){this.data[t]=e},getData:function(t){return this.data[t]},effectAllowed:"move"};this._copyOffset={x:0,y:0};this._lastTarget=null;this._currentDropContainer=null;this._handleClick=!0;this._DBLCLICKDELAY=500;this._CONTEXTMENUDELAY=1e3;this._DRAGDELTA=5;this._COPYOPACITY=.7;this.copyStylesDragClone=!0;this.dragOnClick=!1;this._createDragCopy=(t,e)=>{if(this._dragCopy===null&&this._dragRunning){this._dragSrc.style.opacity=this._COPYOPACITY,this._dragCopy=this._dragSrc.cloneNode(!0);let r=window.getComputedStyle(this._dragSrc);if(this._dragCopy.style="",this._dragCopy.setAttribute("dragclone",""),this.copyStylesDragClone)for(let s of r)this._dragCopy.style[s]=r.getPropertyValue(s);this._calculateDragCopyPosition(e),this._dragCopy.style.top=e.clientY-this._copyOffset.y+"px",this._dragCopy.style.left=e.clientX-this._copyOffset.x+"px",this._dragCopy.style.position="fixed",this._dragCopy.style.pointerEvents="none",this._dragCopy.style.zIndex="999999",this._dragCopy=document.body.appendChild(this._dragCopy),this._dispatchEvent(this._dragSrc,"dragstart")}if(this._dragRunning){let r=this;requestAnimationFrame(function(){r._touchEndCalled||r._dragCopy===null||(r._dragCopy.style.top=e.clientY-r._copyOffset.y+"px",r._dragCopy.style.left=e.clientX-r._copyOffset.x+"px")});let s=this._findDroppable(t);s!=this._lastTarget&&(this._dispatchEvent(s,"dragenter"),this._dispatchEvent(this._lastTarget,"dragleave"),this._lastTarget=s),this._currentDropContainer=s,this._currentDropContainer&&this._dispatchEvent(s,"dragover")}};return i._instance?i._instance:(i._instance=this,document.addEventListener("touchmove",this._touchMove.bind(this),{passive:!1,capture:!1}),document.addEventListener("mousemove",this._touchMove.bind(this),{passive:!1,capture:!1}),document.addEventListener("touchend",this._touchEnd.bind(this),{passive:!1,capture:!1}),document.addEventListener("mouseup",this._touchEnd.bind(this),{passive:!1,capture:!1}),document.addEventListener("touchcancel",this._touchCancel.bind(this),{passive:!1,capture:!1}),this)}addDraggables(t){t.forEach(e=>{e.addEventListener("touchstart",this._touchStart.bind(this),{passive:!1,capture:!1}),e.addEventListener("mousedown",this._touchStart.bind(this),{passive:!1,capture:!1})})}_touchStart(t){this._touchBegin=Date.now();let{x:e,y:r}=this._getPoint(t);if(this._touchDown={x:e,y:r},this._dragSrc=t.currentTarget,this._canDrag=!0,this.dragOnClick){let s={clientX:e,clientY:r};this._dragRunning=!0,this._createDragCopy(t,s)}t.preventDefault()}_touchMove(t){if(this._canDrag&&this._dragSrc){let{x:e,y:r}=this._getPoint(t),s={clientX:e,clientY:r};this._getDelta(s)>=this._DRAGDELTA&&(this._dragRunning=!0),this._createDragCopy(t,s),t.preventDefault()}}_touchEnd(t){var e;if(this._touchEndCalled=!0,this._canDrag=!1,this._currentDropContainer)this._dispatchEvent(this._currentDropContainer,"drop"),this._dispatchEvent(this._dragSrc,"dragend");else if(this._dragRunning){let r=new CustomEvent("dragend",{bubbles:!0,cancelable:!0});r.dataTransfer={dropEffect:"none"},(e=this._dragSrc)==null||e.dispatchEvent(r)}this._reset()}_touchCancel(t){this._reset()}_findDroppable(t){let e=this._getPoint(t);return this.elementFromPoint(e.x,e.y)}elementFromPoint(t,e){let r=document.elementFromPoint(t,e);if(r){for(;r.shadowRoot;){let s=r.shadowRoot.elementFromPoint(t,e);if(s===null||s===r)break;r=s}return r}return null}_getPoint(t,e){return t&&t.touches&&(t=t.touches[0]),{x:e?t.pageX:t.clientX,y:e?t.pageY:t.clientY}}_calculateDragCopyPosition(t){let e=this._dragSrc.getBoundingClientRect();this._copyOffset.x=t.clientX-e.left,this._copyOffset.y=t.clientY-e.top}_getDelta(t){let e=Math.abs(t.clientX-this._touchDown.x),r=Math.abs(t.clientY-this._touchDown.y);return e+r}_dispatchEvent(t,e,r=!0){if(!t)return!1;let s=new CustomEvent(e,{bubbles:r,cancelable:!0});return s.dataTransfer=this._dataTransfer,t.dispatchEvent(s),s.defaultPrevented}_reset(){this._dragRunning&&(this._dragSrc.style.opacity="1.0",this._dragCopy.parentElement.removeChild(this._dragCopy)),this._dragRunning=!1,this._dragSrc=null,this._dragCopy=null,this._canDrag=!1,this._touchBegin=0,this._touchDown=null,this._lastClick=0,this._touchEndCalled=!1,this._dataTransfer={data:{},setData:function(t,e){this.data[t]=e},getData:function(t){return this.data[t]},effectAllowed:"move"},this._copyOffset={x:0,y:0},this._lastTarget=null,this._currentDropContainer=null,this._handleClick=!0}};var Cs=(i,t,e)=>{class r extends i{constructor(){super(...arguments);this.disabled=!1}firstUpdated(o){if(this.classList.contains("qti-match-tabular"))return;super.firstUpdated(o);let l=Array.from(t?this.shadowRoot.querySelectorAll(e):this.querySelectorAll(e));this.dragoverHandler=this.dragoverHandler.bind(this),this.dragleaveHandler=this.dragleaveHandler.bind(this),this.dragenterHandler=this.dragenterHandler.bind(this),this.dropHandler=this.dropHandler.bind(this),l.forEach(c=>{c.setAttribute("dropzone","move"),c.addEventListener("dragleave",this.dragleaveHandler),this.attachHandler(c)});for(let c of l)this.observer=new MutationObserver(u=>{u.forEach(m=>{if(m.type==="attributes")switch(m.attributeName){case"disabled":{c.hasAttribute("disabled")?this.removeHandler(c):this.attachHandler(c);break}}})}),this.observer.observe(c,{attributes:!0})}attachHandler(o){o.addEventListener("dragover",this.dragoverHandler),o.addEventListener("dragenter",this.dragenterHandler),o.addEventListener("drop",this.dropHandler)}removeHandler(o){o.removeEventListener("dragover",this.dragoverHandler),o.removeEventListener("dragenter",this.dragenterHandler),o.removeEventListener("drop",this.dropHandler)}disconnectedCallback(){var o;this.classList.contains("qti-match-tabular")||(super.disconnectedCallback(),(o=this.observer)==null||o.disconnect())}dragenterHandler(o){o.preventDefault()}dragoverHandler(o){return o.preventDefault(),o.currentTarget.setAttribute("active",""),o.dataTransfer.dropEffect="move",!1}dropHandler(o){o.preventDefault();let l=o.currentTarget,c=this.querySelector(`[identifier=${o.dataTransfer.getData("text")}`),u=c||this.shadowRoot.querySelector(`[identifier=${o.dataTransfer.getData("text")}`);return l?u.parentElement.getAttribute("identifier")!==l.getAttribute("identifier")&&l.appendChild(u):console.error(`cannot find droppable, target: ${o.target?JSON.stringify(o.target):"null"}`),l.removeAttribute("active"),!1}dragleaveHandler(o){return o.preventDefault(),o.currentTarget.removeAttribute("active"),o.dataTransfer.dropEffect="none",!1}}return a([p({type:Boolean,reflect:!0})],r.prototype,"disabled",2),r};var qs=(i,t,e)=>{class r extends i{}return r};var z=(i,t,e,r)=>{class s extends qs(Cs(i,e,r),r,t){constructor(){super(...arguments);this.draggables=new Map;this.responseIdentifier="";this.configuration={copyStylesDragClone:!0,dragCanBePlacedBack:!0,dragOnClick:!1};this.disabled=!1;this.readonly=!1;this.minAssociations=1;this.maxAssociations=1}reInitDragAndDrop(l,c){if(this.classList.contains("qti-match-tabular"))return;l.filter(m=>!this.draggables||!this.draggables.get(m)).length>0&&(this.dragDropApi.addDraggables(l),l.forEach(m=>{this.draggables.set(m,{parent:m.parentElement,index:Array.from(m.parentNode.children).indexOf(m)}),m.setAttribute("qti-draggable","true"),m.addEventListener("dragstart",f=>{f.dataTransfer.setData("text",f.currentTarget.getAttribute("identifier")),m.setAttribute("dragging","")}),m.addEventListener("dragend",f=>{if(f.preventDefault(),m.removeAttribute("over"),m.removeAttribute("dragging"),(f.dataTransfer.dropEffect==="none"||f.dataTransfer.dropEffect===void 0)&&this.configuration.dragCanBePlacedBack){let y=f.currentTarget,v=this.draggables.get(y),A=v.index<v.parent.children.length?v.index:v.parent.children.length-1,C=v.parent,S=v.parent.children[A];C.insertBefore(y,S),this.saveResponse(),this.checkMaxMatchAssociations()}f.dataTransfer.dropEffect==="move"&&(this.saveResponse(),this.checkMaxMatchAssociations())})}))}handleDragOptionsChanged(l,c){this.dragDropApi.copyStylesDragClone=c.copyStylesDragClone,this.dragDropApi.dragOnClick=c.dragOnClick}handleDisabledChange(l,c){this.draggables.forEach((u,m)=>{c?m.setAttribute("disabled",""):m.removeAttribute("disabled"),c?m.removeAttribute("qti-draggable"):m.setAttribute("qti-draggable","true")})}handleReadonlyChange(l,c){this.draggables.forEach((u,m)=>{c?m.setAttribute("readonly",""):m.removeAttribute("readonly"),c?m.removeAttribute("qti-draggable"):m.setAttribute("qti-draggable","true")})}firstUpdated(l){super.firstUpdated(l),this.droppables=Array.from(e?this.shadowRoot.querySelectorAll(r):this.querySelectorAll(r))}connectedCallback(){super.connectedCallback(),this.dragDropApi=new Ot,this.dispatchEvent(new CustomEvent("qti-register-interaction",{bubbles:!0,composed:!0,detail:this}))}reset(l=!0){this.draggables.forEach((c,u)=>{let m=c.parent.children,f=c.index<m.length?c.index:m.length;c.parent.insertBefore(u,m[f])}),l&&this.saveResponse()}checkMaxMatchAssociations(){this.droppables.forEach(l=>{let u=+(l.getAttribute("match-max")||1)<=(l.children.length||0);u?l.setAttribute("disabled",""):l.removeAttribute("disabled"),u?l.removeAttribute("dropzone"):l.setAttribute("dropzone","move")})}set response(l){this.classList.contains("qti-match-tabular")||(this.reset(!1),l!==null&&Array.isArray(l)&&l.forEach(c=>{let[u,...m]=c.split(" ").reverse();if(u){let f=this.droppables.find(y=>y.getAttribute("identifier")===u);m.forEach(y=>{let v=this.querySelector(`[identifier=${y}]`);f?v?(f.appendChild(v),this.checkMaxMatchAssociations()):console.error(`cannot find draggable with identifier: ${y}`):console.error(`cannot find droppable with identifier: ${u}`)})}}))}validate(){let c=(e?Array.from(this.shadowRoot.querySelectorAll(r)):Array.from(this.querySelectorAll(r))).filter(u=>u.childElementCount>0).length;return this.minAssociations<=0||this.minAssociations<=c}saveResponse(){let l=this.droppables.map(c=>{var m;let u="";return((m=c.children)==null?void 0:m.length)>0&&(u+=Array.from(c.children).map(f=>f.getAttribute("identifier")).join(" ")+" "),u+=c.getAttribute("identifier"),u});this.dispatchEvent(new CustomEvent("qti-interaction-response",{bubbles:!0,composed:!0,detail:{responseIdentifier:this.responseIdentifier,response:l}}))}}return a([vs(t)],s.prototype,"reInitDragAndDrop",1),a([p({type:String,attribute:"response-identifier"})],s.prototype,"responseIdentifier",2),a([p({attribute:!1,type:Object})],s.prototype,"configuration",2),a([T("configuration")],s.prototype,"handleDragOptionsChanged",1),a([p({type:Boolean,reflect:!0})],s.prototype,"disabled",2),a([T("disabled",{waitUntilFirstUpdate:!0})],s.prototype,"handleDisabledChange",1),a([p({type:Boolean,reflect:!0})],s.prototype,"readonly",2),a([T("readonly",{waitUntilFirstUpdate:!0})],s.prototype,"handleReadonlyChange",1),a([p({type:Number,reflect:!0,attribute:"min-associations"})],s.prototype,"minAssociations",2),a([p({type:Number,reflect:!0,attribute:"max-associations"})],s.prototype,"maxAssociations",2),s};var Se=class extends z(g,"qti-simple-associable-choice",!0,".dl"){render(){return d` <slot name="prompt"></slot>
      <slot name="qti-simple-associable-choice"></slot>
      ${this._childrenMap.length>0&&Array.from(Array(Math.ceil(this._childrenMap.length/2)).keys()).map((t,e)=>d`<div part="associables-container">
            <div name="left${e}" part="drop-list" class="dl" identifier="droplist${e}_left"></div>
            <div name="right${e}" part="drop-list" class="dl" identifier="droplist${e}_right"></div>
          </div>`)}`}connectedCallback(){super.connectedCallback(),this._childrenMap=Array.from(this.querySelectorAll("qti-simple-associable-choice"))}};Se.styles=b`
    :host {
      display: block; /* necessary to calculate scaling position */
    }
    slot[name='qti-simple-associable-choice'] {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `,a([_()],Se.prototype,"_childrenMap",2),Se=a([h("qti-associate-interaction")],Se);var W=class extends w{constructor(){super(...arguments);this._errorMessage=null}connectedCallback(){super.connectedCallback();let e=this.baseItemUrl+this.data;fetch(e).then(r=>r.json()).then(r=>{this.manifest=r,this.setupCES()}).catch(r=>{this._errorMessage=r})}setupCES(){let e=this.shadowRoot.querySelector("#pciContainer"),r=e.contentWindow||e,s=e.contentDocument;r.CES={setResponse:n=>{this.rawResponse=n,this.saveResponse(n)},getResponse:()=>this.rawResponse,getMedia:()=>this.manifest.media.map(n=>this.baseRefUrl+n),setStageHeight:()=>{console.log("not implemented")}},s.open(),s.write(`
      <html>
        <head>
          <link href='${this.baseRefUrl+this.manifest.style[0]}' rel="stylesheet" />
          <script src='${this.baseRefUrl+this.manifest.script[0]}'></script>
        </head>
        <body></body>
      </html>
      `),s.close()}validate(){return this.rawResponse!==""}set response(e){this.rawResponse=e}disconnectedCallback(){super.disconnectedCallback()}render(){return d`<iframe
        width=${this.getAttribute("width")}
        height=${this.getAttribute("height")}
        frameborder="0"
        title="pciContainer"
        id="pciContainer"
      >
      </iframe>
      ${this._errorMessage&&d`<div style="color:red">
        <h1>Error</h1>
        ${this._errorMessage}
      </div>`}`}};a([p({type:String,attribute:"response-identifier"})],W.prototype,"responseIdentifier",2),a([p({type:String,attribute:"data"})],W.prototype,"data",2),a([p({type:String,attribute:"data-base-item"})],W.prototype,"baseItemUrl",2),a([p({type:String,attribute:"data-base-ref"})],W.prototype,"baseRefUrl",2),a([p({type:String,attribute:"id"})],W.prototype,"id",2),a([_()],W.prototype,"_errorMessage",2),W=a([h("qti-custom-interaction")],W);var $e=class extends w{constructor(){super(...arguments);this.countAttempt="true"}validate(){return!0}set response(e){}render(){return d`<button ?disabled=${this.disabled} part="button" @click=${this.endAttempt}>${this.title}</button>`}endAttempt(e){this.dispatchEvent(new CustomEvent("end-attempt",{bubbles:!0,composed:!0,detail:{responseIdentifier:this.responseIdentifier,countAttempt:this.countAttempt==="true"}}))}};a([p({type:String,attribute:"count-attempt"})],$e.prototype,"countAttempt",2),a([p({type:String})],$e.prototype,"title",2),$e=a([h("qti-end-attempt-interaction")],$e);var Qe=class extends z(g,"qti-gap-text",!1,"qti-gap"){render(){return d` <slot part="drags" name="qti-gap-text"></slot>
      <slot part="drops"></slot>`}};Qe.styles=[b`
      :host {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      :host(.qti-choices-top) {
        flex-direction: column;
      }
      :host(.qti-choices-bottom) {
        flex-direction: column-reverse;
      }
      :host(.qti-choices-left) {
        flex-direction: row;
      }
      :host(.qti-choices-right) {
        flex-direction: row-reverse;
      }
      [part='drags'],
      [part='drops'] {
        display: flex;
        align-items: flex-start;
        flex: 1;
        gap: 0.5rem;
      }
    `],Qe=a([h("qti-gap-match-interaction")],Qe);var As=(i,t,e)=>{let r=new Map;for(let s=t;s<=e;s++)r.set(i[s],s);return r},Ut=ee(class extends j{constructor(i){if(super(i),i.type!==ne.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let r;e===void 0?e=t:t!==void 0&&(r=t);let s=[],n=[],o=0;for(let l of i)s[o]=r?r(l,o):o,n[o]=e(l,o),o++;return{values:n,keys:s}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,r]){var C;let s=fs(i),{values:n,keys:o}=this.dt(t,e,r);if(!Array.isArray(s))return this.ut=o,n;let l=(C=this.ut)!=null?C:this.ut=[],c=[],u,m,f=0,y=s.length-1,v=0,A=n.length-1;for(;f<=y&&v<=A;)if(s[f]===null)f++;else if(s[y]===null)y--;else if(l[f]===o[v])c[v]=oe(s[f],n[v]),f++,v++;else if(l[y]===o[A])c[A]=oe(s[y],n[A]),y--,A--;else if(l[f]===o[A])c[A]=oe(s[f],n[A]),Ae(i,c[A+1],s[f]),f++,A--;else if(l[y]===o[v])c[v]=oe(s[y],n[v]),Ae(i,s[f],s[y]),y--,v++;else if(u===void 0&&(u=As(o,v,A),m=As(l,f,y)),u.has(l[f]))if(u.has(l[y])){let S=m.get(o[v]),ve=S!==void 0?s[S]:null;if(ve===null){let dt=Ae(i,s[f]);oe(dt,n[v]),c[v]=dt}else c[v]=oe(ve,n[v]),Ae(i,s[f],ve),s[S]=null;v++}else Tt(s[y]),y--;else Tt(s[f]),f++;for(;v<=A;){let S=Ae(i,c[A+1]);oe(S,n[v]),c[v++]=S}for(;f<=y;){let S=s[f++];S!==null&&Tt(S)}return this.ut=o,ms(i,c),L}});function ke(i,t,e,r){switch(i){case"circle":{let[s,n,o]=t,l=s/e.width*100,c=n/e.height*100,u=o/e.width*100;r.style.left=l-u+"%",r.style.top=c-u+"%",r.style.width=r.style.height=4*u+"px",r.style.borderRadius="9999px"}break;case"rect":{let[s,n,o,l]=t,c=s/e.width*100,u=n/e.height*100,m=o/e.width*100,f=l/e.height*100;r.style.left=c+"%",r.style.top=u+"%",r.style.width=m-c+"%",r.style.height=f-u+"%"}break;case"poly":{let s=t.reduce((C,S,ve,dt)=>{if(ve%2===1){let Rs=C.pop();C[C.length]={x:Rs,y:dt[ve]}}else C.push(S);return C},[]),n=Math.min(...s.map(C=>C.x)),o=Math.max(...s.map(C=>C.x)),l=Math.min(...s.map(C=>C.y)),c=Math.max(...s.map(C=>C.y)),u=n/e.width*100,m=l/e.height*100,f=o/e.width*100,y=c/e.height*100;r.style.left=n/e.width*100+"%",r.style.top=l/e.height*100+"%",r.style.width=f-u+"%",r.style.height=y-m+"%";let A=s.map(C=>({x:(C.x-n)/(o-n)*100,y:(C.y-l)/(c-l)*100})).map(C=>Math.round(C.x)+"% "+Math.round(C.y)+"%").join(",");r.style.clipPath=`polygon(${A})`}break;default:break}}var K=class extends w{constructor(){super();this.startPoint=null;this.endPoint=null;this._lines=[];this.addEventListener("qti-register-hotspot",this.positionHotspotOnRegister)}reset(){this._lines=[]}validate(){return this._lines.length>0}set response(e){Array.isArray(e)&&(this._lines=e)}render(){var e,r,s,n;return d`<slot name="prompt"></slot>
      <line-container>
        <svg
          width=${B((e=this.grImage[0])==null?void 0:e.width)}
          height=${B((r=this.grImage[0])==null?void 0:r.height)}
          viewbox="0 0 ${(s=this.grImage[0])==null?void 0:s.width} ${(n=this.grImage[0])==null?void 0:n.height}"
        >
          ${Ut(this._lines,o=>o,(o,l)=>Qt`
              <line
                part="line"
                x1=${parseInt(this.querySelector("[identifier="+o.split(" ")[0]+"]").style.left)}
                y1=${parseInt(this.querySelector("[identifier="+o.split(" ")[0]+"]").style.top)}
                x2=${parseInt(this.querySelector("[identifier="+o.split(" ")[1]+"]").style.left)}
                y2=${parseInt(this.querySelector("[identifier="+o.split(" ")[1]+"]").style.top)}
                stroke="red"
                stroke-width="3"
                @click=${c=>{c.stopPropagation(),this._lines=this._lines.filter((u,m)=>m!==l),this.saveResponse(this._lines)}}
              />
            `)}
          ${this.startPoint&&Qt`<line
            part="point"
            x1=${this.startCoord.x}
            y1=${this.startCoord.y}
            x2=${this.mouseCoord.x}
            y2=${this.mouseCoord.y}
            stroke="red"
            stroke-width="3"
          />`}
        </svg>
        <slot></slot>
      </line-container>`}positionHotspotOnRegister(e){let r=this.querySelector("img"),s=e.target,n=s.getAttribute("coords"),o=s.getAttribute("shape"),l=n.split(",").map(c=>parseInt(c));ke(o,l,r,s)}firstUpdated(e){super.firstUpdated(e),this.hotspots=this.querySelectorAll("qti-associable-hotspot"),document.addEventListener("mousemove",r=>{this.mouseCoord={x:r.clientX-this.grImage[0].getBoundingClientRect().left,y:r.clientY-this.grImage[0].getBoundingClientRect().top}}),this.hotspots.forEach(r=>{r.style.left=r.getAttribute("coords").split(",")[0]+"px",r.style.top=r.getAttribute("coords").split(",")[1]+"px",r.addEventListener("click",s=>{this.startPoint?this.endPoint||(this.endPoint=s.target,this._lines=[...this._lines,this.startPoint.getAttribute("identifier")+" "+this.endPoint.getAttribute("identifier")],this.saveResponse(this._lines),this.startPoint=null,this.endPoint=null):(this.startPoint=s.target,this.startCoord={x:this.startPoint.getAttribute("coords").split(",")[0],y:this.startPoint.getAttribute("coords").split(",")[1]})})})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("qti-register-hotspot",this.positionHotspotOnRegister)}};K.styles=[b`
      slot:not([name='prompt']) {
        // position: relative; /* qti-hotspot-choice relative to the slot */
        display: block;
        width: fit-content; /* hotspots not stretching further if image is at max size */
      }
      ::slotted(img) {
        /* image not selectable anymore */
        pointer-events: none;
        user-select: none;
      }
      ::slotted(qti-associable-hotspot) {
        transform: translate(-50%, -50%);
      }
      line-container {
        display: block;
        position: relative;
      }
      svg {
        position: absolute;
        top: 0px;
        left: 0px;
      }
    `],a([_()],K.prototype,"_lines",2),a([_()],K.prototype,"startCoord",2),a([_()],K.prototype,"mouseCoord",2),a([Fe("svg")],K.prototype,"svgContainer",2),a([ls({selector:"img"})],K.prototype,"grImage",2),K=a([h("qti-graphic-associate-interaction")],K);var et=class extends z(g,"qti-gap-img",!1,"qti-associable-hotspot"){render(){return d` <slot></slot>
      <slot name="qti-gap-img"></slot>`}positionHotspotOnRegister(t){let e=this.querySelector("img"),r=t.target,s=r.getAttribute("coords"),n=r.getAttribute("shape"),o=s.split(",").map(l=>parseInt(l));switch(n){case"circle":{let[l,c,u]=o;r.style.left=l-u+"px",r.style.top=c-u+"px",r.style.width=r.style.height=2*u+"px"}break;case"rect":{let[l,c,u,m]=o;r.style.left=l+"px",r.style.top=c+"px",r.style.width=u-l+"px",r.style.height=m-c+"px"}break;default:break}}connectedCallback(){super.connectedCallback(),this.addEventListener("qti-register-hotspot",this.positionHotspotOnRegister)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("qti-register-hotspot",this.positionHotspotOnRegister)}};et.styles=b`
    :host {
      display: inline-block;
      position: relative;
    }
    slot[name='qti-gap-img'] {
      display: flex;
      gap: 1rem;
    }
  `,et=a([h("qti-graphic-gap-match-interaction")],et);var tt=class extends ${render(){return d`
      <slot name="prompt"></slot>
      <!-- slot for the prompt -->
      <slot></slot>
      <!-- slot for the image and hotspots -->
    `}setHotspotOrder(t){let{identifier:e}=t.detail,r=this._choiceElements.find(n=>n.getAttribute("identifier")===e),s=this._choiceElements.length;if(!this.choiceOrdering){if(this.choiceOrdering=!0,r.order==null){if(this._choiceElements.filter(n=>n.order>0).length>=s){this.choiceOrdering=!1;return}r.order=this._choiceElements.filter(n=>!!n.order).length+1,this.choiceOrdering=!1;return}else this._choiceElements.forEach(n=>(n.order>n.order&&n.order--,n)),r.order=null;this.choiceOrdering=!1}}positionHotspotOnRegister(t){let e=this.querySelector("img"),r=t.target,s=r.getAttribute("coords"),n=r.getAttribute("shape"),o=s.split(",").map(l=>parseInt(l));ke(n,o,e,r)}connectedCallback(){super.connectedCallback(),this.addEventListener("qti-choice-element-selected",this.setHotspotOrder),this.addEventListener("qti-register-choice",this.positionHotspotOnRegister)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("qti-choice-element-selected",this.setHotspotOrder),this.removeEventListener("qti-register-choice",this.positionHotspotOnRegister)}};tt.styles=[b`
      slot:not([name='prompt']) {
        position: relative; /* qti-hotspot-choice relative to the slot */
        display: block;
        width: fit-content; /* hotspots not stretching further if image is at max size */
      }
      ::slotted(img) {
        /* image not selectable anymore */
        pointer-events: none;
        user-select: none;
      }
    `],tt=a([h("qti-graphic-order-interaction")],tt);var rt=class extends ${render(){return d`
      <slot name="prompt"></slot>
      <!-- slot for the prompt -->
      <slot></slot>
      <!-- slot for the image and hotspots -->
    `}positionHotspotOnRegister(t){let e=this.querySelector("img"),r=t.target,s=r.getAttribute("coords"),n=r.getAttribute("shape"),o=s.split(",").map(l=>parseInt(l));ke(n,o,e,r)}connectedCallback(){super.connectedCallback(),this.addEventListener("qti-register-choice",this.positionHotspotOnRegister)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("qti-register-choice",this.positionHotspotOnRegister)}};rt.styles=[b`
      slot:not([name='prompt']) {
        position: relative; /* qti-hotspot-choice relative to the slot */
        display: block;
        width: fit-content; /* hotspots not stretching further if image is at max size */
      }
      ::slotted(img) {
        /* image not selectable anymore */
        pointer-events: none;
        user-select: none;
        /* width:100%; */
      }
    `],rt=a([h("qti-hotspot-interaction")],rt);var fe=class extends g{constructor(){super(...arguments);this.matchMin=0;this.matchMax=1;this.fixed=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("slot","qti-simple-associable-choice"),this.setAttribute("part","qti-simple-associable-choice")}render(){return d`
      <slot></slot>
      <slot name="qti-simple-associable-choice"></slot>
    `}};a([p({type:Number,attribute:"match-min"})],fe.prototype,"matchMin",2),a([p({type:Number,attribute:"match-max"})],fe.prototype,"matchMax",2),a([p({type:Boolean,attribute:"fixed"})],fe.prototype,"fixed",2),fe=a([h("qti-simple-associable-choice")],fe);var ge=class extends z(g,"qti-simple-match-set:first-of-type qti-simple-associable-choice",!1,"qti-simple-match-set:last-of-type qti-simple-associable-choice"){constructor(){super(...arguments);this.lastCheckedRadio=null;this.response=[];this.responseIdentifier="";this.handleRadioClick=e=>{let r=e.target;this.lastCheckedRadio===r?(r.checked=!1,this.lastCheckedRadio=null,this.handleRadioChange(e)):this.lastCheckedRadio=r};this.handleRadioChange=e=>{let r=e.target,s=r.value;r.checked?(this.response.push(s),this.lastCheckedRadio=r):(this.response=this.response.filter(n=>n!==s),this.lastCheckedRadio=null),this.requestUpdate(),this.dispatchEvent(new CustomEvent("qti-interaction-response",{bubbles:!0,composed:!0,detail:{responseIdentifier:this.responseIdentifier,response:this.response}}))}}connectedCallback(){super.connectedCallback(),this.rows=Array.from(this.querySelectorAll("qti-simple-match-set:first-of-type qti-simple-associable-choice")),this.cols=Array.from(this.querySelectorAll("qti-simple-match-set:last-of-type qti-simple-associable-choice")),this.response=[]}render(){return this.classList.contains("qti-match-tabular")?d`
      <slot name="prompt"></slot>
      <table>
        <tr>
          <td></td>
          ${this.cols.map((e,r)=>d`<th part="r-header">${we(e.innerHTML)}</th>`)}
        </tr>

        ${this.rows.map((e,r)=>d`<tr>
              <td part="c-header">${we(e.innerHTML)}</td>
              ${this.cols.map((s,n)=>{let o=e.getAttribute("identifier"),l=s.getAttribute("identifier"),c=`${o} ${l}`,u=this.response.filter(y=>y.split(" ")[0]===o).length||0,m=this.response.includes(c),f=e.matchMax===1?!1:u>=e.matchMax&&!m;return d`<td>
                  <input
                    type=${e.matchMax===1?"radio":"checkbox"}
                    role="id"
                    name=${o}
                    value=${c}
                    .disabled=${f}
                    .checked=${m}
                    @change=${y=>this.handleRadioChange(y)}
                    @click=${y=>e.matchMax===1?this.handleRadioClick(y):null}
                  />
                </td>`})}
            </tr>`)}
      </table>
    `:d`<slot name="prompt"></slot> <slot></slot>`}};ge.styles=[],a([_()],ge.prototype,"response",2),a([p({type:String,attribute:"response-identifier"})],ge.prototype,"responseIdentifier",2),ge=a([h("qti-match-interaction")],ge);var st=class extends w{constructor(){super();this.value=0}reset(){}validate(){return!0}set response(e){}static get properties(){return R(E({},w.properties),{step:{type:Number,attribute:"step",default:10}})}render(){return d` <slot name="prompt"></slot>
      <slot></slot>`}connectedCallback(){super.connectedCallback();let e=this.querySelector("audio")||this.querySelector("video")||this.querySelector("object");e&&e.addEventListener("ended",()=>{this.value++,this.saveResponse(this.value.toString())})}};st.styles=[b``],st=a([h("qti-media-interaction")],st);var be=class extends z(g,"qti-simple-choice",!0,"drop-list"){render(){return d` <slot name="prompt"> </slot>
      <div part="container">
        <slot part="drags"> </slot>
        <div part="drops">
          ${Array.from(this.querySelectorAll("qti-simple-choice")).map((t,e)=>d`<drop-list part="drop-list" identifier="droplist${e}"></drop-list>`)}
        </div>
      </div>`}connectedCallback(){super.connectedCallback(),this.childrenMap=Array.from(this.querySelectorAll("qti-simple-choice")),this.childrenMap.forEach(t=>t.setAttribute("part","qti-simple-choice"))}};be.layoutClass=["qti-choices-top","qti-choices-bottom","qti-choices-left","qti-choices-right"],be.styles=[b`
      [part='drags'] {
        display: flex;
        align-items: flex-start;
        flex: 1;
      }

      [part='drops'] {
        flex: 1;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
      }

      :host([orientation='horizontal']) [part='drags'] {
        flex-direction: row;
      }
      :host([orientation='horizontal']) [part='drops'] {
        grid-auto-flow: column;
      }
      :host([orientation='vertical']) [part='drags'] {
        flex-direction: column;
      }
      :host([orientation='vertical']) [part='drops'] {
        grid-auto-flow: row;
      }

      [part='drop-list'] {
        display: block;
        flex: 1;
      }

      [part='container'] {
        display: flex;
        gap: 0.5rem;
      }
      :host(.qti-choices-top) [part='container'] {
        flex-direction: column;
      }
      :host(.qti-choices-bottom) [part='container'] {
        flex-direction: column-reverse;
      }
      :host(.qti-choices-left) [part='container'] {
        flex-direction: row;
      }
      :host(.qti-choices-right) [part='container'] {
        flex-direction: row-reverse;
      }
    `],a([p({type:String})],be.prototype,"orientation",2),be=a([h("qti-order-interaction")],be);var It=class extends g{render(){return d`<slot></slot>`}};It.styles=[b`
      :host {
        display: block;
      }
      ::slotted(img) {
        position: absolute;
        cursor: move;
        user-select: none;
        left: 50%;
        transform: translateX(-50%);
      }
    `];customElements.define("qti-position-object-interaction",It);var it=class extends g{render(){return d`<slot></slot>`}constructor(){super(),this.removeMoveListener=this.removeMoveListener.bind(this),this.dragElementHandler=this.dragElementHandler.bind(this)}dragElementHandler(t){t.preventDefault();let e=t.clientX-this.startX,r=t.clientY-this.startY;this.dragElement.style.left=this.dragElement.offsetLeft+e+"px",this.dragElement.style.top=this.dragElement.offsetTop+r+"px",this.startX=t.clientX,this.startY=t.clientY}firstUpdated(t){super.firstUpdated(t),this.dragElement=this.querySelector("qti-position-object-interaction>img"),this.startX=0,this.startY=0,this.dragElement.addEventListener("mousedown",e=>{this.startX=e.clientX,this.startY=e.clientY,document.addEventListener("mousemove",this.dragElementHandler,!0)}),document.addEventListener("mouseup",this.removeMoveListener)}removeMoveListener(t){document.removeEventListener("mousemove",this.dragElementHandler,!0)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousemove",this.dragElementHandler),document.removeEventListener("mouseup",this.removeMoveListener)}};it.styles=[b`
      :host {
        display: inline-block;
        position: relative;
      }
    `],it=a([h("qti-position-object-stage")],it);var ws="important",ci=" !"+ws,Ts=ee(class extends j{constructor(i){var t;if(super(i),i.type!==ne.ATTRIBUTE||i.name!=="style"||((t=i.strings)==null?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let r=i[e];return r==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let r of this.ft)t[r]==null&&(this.ft.delete(r),r.includes("-")?e.removeProperty(r):e[r]=null);for(let r in t){let s=t[r];if(s!=null){this.ft.add(r);let n=typeof s=="string"&&s.endsWith(ci);r.includes("-")||n?e.setProperty(r,n?s.slice(0,-11):s,n?ws:""):e[r]=s}}return L}});var le=class extends w{constructor(){super(...arguments);this.maxChoices=0;this.minChoices=0;this._points=[]}render(){return d` <slot name="prompt"></slot>
      <point-container>
        ${Ut(this._points,e=>e,(e,r)=>d`
            <button
              part="point"
              style=${Ts({position:"absolute",transform:"translate(-50%, -50%)",left:`${e.split(" ")[0]}px`,top:`${e.split(" ")[1]}px`})}
              aria-label="Remove point at ${e}"
              @click=${s=>{s.stopPropagation(),this._points=this._points.filter((n,o)=>o!==r),this.saveResponse(this._points)}}
            ></button>
          `)}
        <slot></slot>
      </point-container>`}reset(){this._points=[]}validate(){return this._points.length>=this.minChoices&&this._points.length<=this.maxChoices}set response(e){this._points=Array.isArray(e)?e:[e]}connectedCallback(){super.connectedCallback(),this.querySelector("img").addEventListener("click",r=>{let s=r.offsetX,n=r.offsetY;this._points=[...this._points,s+" "+n],this.saveResponse(this._points)})}disconnectedCallback(){super.disconnectedCallback()}};le.styles=[b`
      :host {
        display: block;
      }
      point-container {
        display: block;
        position: relative;
      }
    `],a([p({type:Number,attribute:"max-choices"})],le.prototype,"maxChoices",2),a([p({type:Number,attribute:"min-choices"})],le.prototype,"minChoices",2),a([_()],le.prototype,"_points",2),le=a([h("qti-select-point-interaction")],le);var k=class extends w{constructor(){super();this.stepLabel=!1;this.reverse=!1;this._handleDisabledChange=(e,r)=>{};this._handleReadonlyChange=(e,r)=>{};this.csLive=getComputedStyle(this)}set min(e){this._min=e,this.value=e,this.style.setProperty("--min",`${this._min}`)}get min(){return this._min}set max(e){this._max=e,this.style.setProperty("--max",`${this._max}`)}get max(){return this._max}set step(e){this._step=e,this.style.setProperty("--step",`${this._step}`)}get step(){return this._step}reset(){}validate(){return!0}set response(e){if(Array.isArray(e)){console.error("QtiSliderInteraction: response is an array, but should be a single value");return}let r=parseInt(e);if(Number.isNaN(r)){console.error("QtiSliderInteraction: response is not a number");return}this.value=r}render(){this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max);let e=(this.value-this.min)/(this.max-this.min)*100;return this.style.setProperty("--value-percentage",`${e}%`),this.setAttribute("aria-valuenow",this.value.toString()),d`<slot name="prompt"></slot>
      <div id="slider" part="slider">
        ${this.csLive.getPropertyValue("--show-bounds")=="true"?d`<div id="bounds" part="bounds">
              <div>${this._min}</div>
              <div>${this._max}</div>
            </div>`:q}
        ${this.csLive.getPropertyValue("--show-ticks")=="true"?d`<div id="ticks" part="ticks"></div>`:q}
        <div id="rail" part="rail" @mousedown=${this._onMouseDown} @touchstart=${this._onTouchMove}>
          <div id="knob" part="knob">
            ${this.csLive.getPropertyValue("--show-value")=="true"?d`<div id="value" part="value">${this.value}</div>`:q}
          </div>
        </div>
      </div>`}connectedCallback(){super.connectedCallback(),this.step=1,this.setAttribute("tabindex","0"),this.setAttribute("role","slider")}_onTouchMove(e){let r=l=>{let{x:c}=this.getPositionFromEvent(l),u=c-this._rail.getBoundingClientRect().left-document.documentElement.scrollLeft;this.calculateValue(u),l.stopPropagation()},s=()=>{document.removeEventListener("touchmove",r),document.removeEventListener("touchend",s),this.saveResponse(this.value.toString())};document.addEventListener("touchmove",r),document.addEventListener("touchend",s);let{x:n}=this.getPositionFromEvent(e),o=n-this._rail.getBoundingClientRect().left-document.documentElement.scrollLeft;this.calculateValue(o),e.stopPropagation()}_onMouseDown(e){let r=o=>{let l=o.pageX-this._rail.getBoundingClientRect().left-document.documentElement.scrollLeft;this.calculateValue(l),o.preventDefault(),o.stopPropagation()},s=()=>{document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",s),this.saveResponse(this.value.toString())};document.addEventListener("mousemove",r),document.addEventListener("mouseup",s);let n=e.pageX-this._rail.getBoundingClientRect().left-document.documentElement.scrollLeft;this.calculateValue(n),e.preventDefault(),e.stopPropagation()}calculateValue(e){let r=this.min+(this.max-this.min)*e/this._rail.getBoundingClientRect().width,s=this.min+Math.round((r-this.min)/this._step)*this._step;this.value=s}getPositionFromEvent(e){let r;if(e.type=="touchstart"||e.type=="touchmove"||e.type=="touchend"||e.type=="touchcancel"){let s=typeof e.originalEvent=="undefined"?e:e.originalEvent,n=s.touches[0]||s.changedTouches[0];r={x:n.pageX,y:n.pageY}}else(e.type=="mousedown"||e.type=="mouseup"||e.type=="mousemove"||e.type=="mouseover"||e.type=="mouseout"||e.type=="mouseenter"||e.type=="mouseleave")&&(r={x:e.clientX,y:e.clientY});return r}};k.styles=[b``],a([Fe("#knob")],k.prototype,"_knob",2),a([Fe("#rail")],k.prototype,"_rail",2),a([p({type:Number})],k.prototype,"value",2),a([p({type:Boolean,attribute:"step-label"})],k.prototype,"stepLabel",2),a([p({type:Boolean})],k.prototype,"reverse",2),a([p({type:Number,attribute:"lower-bound"})],k.prototype,"min",1),a([p({type:Number,attribute:"upper-bound"})],k.prototype,"max",1),a([p({type:Number,attribute:"step"})],k.prototype,"step",1),a([T("disabled",{waitUntilFirstUpdate:!0})],k.prototype,"_handleDisabledChange",2),a([T("readonly",{waitUntilFirstUpdate:!0})],k.prototype,"_handleReadonlyChange",2),k=a([h("qti-slider-interaction")],k);var ot=class extends g{render(){return d`<slot @slotchange=${this.handleSlotChange}></slot>`}handleSlotChange(t){var r,s,n;let e=Array.from((s=(r=this.firstElementChild)==null?void 0:r.childNodes)!=null?s:[]).find(o=>o.nodeType===Node.COMMENT_NODE);try{this.operatorFunction=new Function("context","fn","item",(n=e.textContent)!=null?n:"")}catch(o){console.error("custom-operator contains invalid javascript code",o)}}calculate(){let t={variable:r=>{var s,n,o;return(o=(n=(s=this._context)==null?void 0:s.variables.find(l=>l.identifier===r))==null?void 0:n.value)!=null?o:""},correct:r=>{var s,n,o;return(o=(n=(s=this._context)==null?void 0:s.variables.find(l=>l.identifier===r))==null?void 0:n.correctResponse)!=null?o:""}},e={getVariable:r=>{var s;return(s=this._context)==null?void 0:s.variables.find(n=>n.identifier===r)},updateOutcomeVariable:(r,s)=>{this.dispatchEvent(new CustomEvent("qti-set-outcome-value",{bubbles:!0,composed:!0,detail:{outcomeIdentifier:r,value:s}}))}};return this.operatorFunction(this._context,t,e)}};a([J({context:U,subscribe:!0}),_()],ot.prototype,"_context",2),ot=a([h("qti-custom-operator")],ot);var nt=class extends g{connectedCallback(){super.connectedCallback(),this.dispatchEvent(new CustomEvent("qti-register-hotspot",{bubbles:!0,cancelable:!1,composed:!0}))}render(){return d` <slot name="qti-gap-img"></slot> `}};nt.styles=b`
    :host {
      position: absolute;
    }
  `,nt=a([h("qti-associable-hotspot")],nt);var at=class extends g{constructor(){super(...arguments);this.tabindex=0}render(){return d` <slot name="qti-gap-text"></slot>`}};a([p({type:Number,reflect:!0})],at.prototype,"tabindex",2),at=a([h("qti-gap")],at);var lt=class extends g{constructor(){super(...arguments);this.tabindex=0}connectedCallback(){this.setAttribute("slot","qti-gap-img")}};a([p({type:Number,reflect:!0})],lt.prototype,"tabindex",2),lt=a([h("qti-gap-img")],lt);var ct=class extends g{constructor(){super(...arguments);this.tabindex=0}connectedCallback(){super.connectedCallback(),this.setAttribute("slot","qti-gap-text")}render(){return d`<slot></slot>`}};a([p({type:Number,reflect:!0})],ct.prototype,"tabindex",2),ct=a([h("qti-gap-text")],ct);var Me=class extends M{};Me.styles=b`
    :host {
      position: absolute;
    }
  `,a([p({attribute:"aria-ordervalue",type:Number,reflect:!0})],Me.prototype,"order",2),Me=a([h("qti-hotspot-choice")],Me);var Ft=class extends M{render(){return d`<div part="ch"><div part="cha"></div></div>
      <slot></slot> `}};Ft=a([h("qti-hottext")],Ft);var Bt=class extends g{};Bt=a([h("qti-inline-choice")],Bt);var pt=class extends M{render(){return d`<div part="ch"><div part="cha"></div></div>
      <slot part="slot"></slot> `}};pt.styles=b`
    :host {
      display: flex;
    }
    slot {
      width: 100%;
      display: block;
    }
  `,pt=a([h("qti-simple-choice")],pt);console.log("%cC\xBFTO%cLab%c: qti-components loaded","font-weight:bold; color:green",'font-family: "PT Sans", font-weight:bold; color:green; font-size: smaller;vertical-align: sub',"font-weight:unset");export{w as Interaction,Ge as QtPrintedVariable,Lt as QtiAnd,N as QtiAssessmentItem,Ce as QtiAssessmentStimulusRef,nt as QtiAssociableHotspot,Se as QtiAssociateInteraction,Nt as QtiBaseValue,M as QtiChoice,Te as QtiChoiceInteraction,At as QtiCompanionMaterialsInfo,V as QtiConditionExpression,ur as QtiContains,wt as QtiContentBody,hr as QtiCorrect,W as QtiCustomInteraction,ot as QtiCustomOperator,$e as QtiEndAttemptInteraction,Pt as QtiEqual,Ht as QtiEqualRounded,x as QtiExpression,X as QtiExtendedTextInteraction,je as QtiFeedbackBlock,Xe as QtiFeedbackInline,at as QtiGap,lt as QtiGapImg,Qe as QtiGapMatchInteraction,ct as QtiGapText,K as QtiGraphicAssociateInteraction,et as QtiGraphicGapMatchInteraction,tt as QtiGraphicOrderInteraction,mr as QtiGt,fr as QtiGte,Me as QtiHotspotChoice,rt as QtiHotspotInteraction,Ft as QtiHottext,kt as QtiHottextInteraction,Bt as QtiInlineChoice,ae as QtiInlineChoiceInteraction,gr as QtiIsNull,Mt as QtiLookupOutcomeValue,br as QtiLt,vr as QtiLte,Vt as QtiMapResponse,Re as QtiMapping,yr as QtiMatch,ge as QtiMatchInteraction,st as QtiMediaInteraction,xr as QtiMember,Ye as QtiModalFeedback,Er as QtiMultiple,_r as QtiNot,Cr as QtiOr,be as QtiOrderInteraction,qr as QtiOrdered,I as QtiOutcomeDeclaration,Ke as QtiOutcomeProcessing,ar as QtiOutcomeProcessingProcessor,te as QtiPortableCustomInteraction,it as QtiPositionObjectStage,Ar as QtiProduct,Ct as QtiPrompt,lr as QtiResponseCondition,Q as QtiResponseDeclaration,Je as QtiResponseElse,dr as QtiResponseElseIf,Ze as QtiResponseIf,me as QtiResponseProcessing,F as QtiRubricBlock,Y as QtiRule,It as QtiSPositionObjectInteraction,le as QtiSelectPointInteraction,cr as QtiSetOutcomeValue,pr as QtiSetOutcomeValueRule,fe as QtiSimpleAssociableChoice,pt as QtiSimpleChoice,k as QtiSliderInteraction,Dt as QtiStringMatch,qt as QtiStylesheet,wr as QtiSum,Tr as QtiSumExpression,P as QtiTextEntryInteraction,Rr as QtiVariable,U as itemContext,cs as itemContextVariables,li as qtiAndMixin,ps as qtiTransformItem,an as qtiTransformManifest,ln as qtiTransformTest};
/*! Bundled license information:

@lit/context/lib/context-request-event.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/create-context.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/controllers/context-consumer.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/value-notifier.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/controllers/context-provider.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/context-root.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/decorators/provide.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/decorators/consume.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit-labs/ssr-dom-shim/lib/element-internals.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit-labs/ssr-dom-shim/index.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
