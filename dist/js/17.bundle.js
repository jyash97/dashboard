(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{332:function(e,t,a){"use strict";t.__esModule=!0;var n=a(1),i=l(n),s=a(39),r=l(a(379)),o=a(16);function l(e){return e&&e.__esModule?e:{default:e}}var p=[{label:"Editor",link:"editor"},{label:"UI Demos",link:"ui-demos"},{label:"Settings",link:"settings"}],c=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.state={},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props.params.appId,t=o.appbaseService.userInfo.body.apps[e];return this.pageInfo={currentView:"search-sandbox",appName:e,appId:t},i.default.createElement(r.default,{pageInfo:this.pageInfo},i.default.createElement("div",{className:"ad-detail-page ad-dashboard row sandbox-wrapper"},i.default.createElement("nav",null,i.default.createElement("ul",null,p.map(function(t){return i.default.createElement("li",{key:t.link},i.default.createElement(s.Link,{activeClassName:"active",to:"/search-sandbox/"+e+"/"+t.link},t.label))}))),i.default.Children.map(this.props.children,function(a){return i.default.cloneElement(a,{appId:t,appName:e})})))},t}(n.Component);t.default=c},378:function(e,t,a){"use strict";t.__esModule=!0;var n=a(1),i=u(n),s=a(39),r=u(a(36)),o=u(a(141)),l=a(38),p=u(a(93)),c=a(16);function u(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.config=p.default,n.contextPath=c.appbaseService.getContextPath(),n.state={activeApp:n.props.appName},n.stopUpdate=!1,n.links=[{label:"Dashboard",link:n.contextPath+"dashboard/",type:"internal",name:"dashboard",tooltip:"View app usage stats",img:i.default.createElement("img",{className:"img-responsive",alt:"dashboard",src:"../../../assets/images/"+n.config.name+"/sidebar/dashboard.svg"})},{label:"Mappings",link:n.contextPath+"mappings/",type:"internal",name:"mappings",tooltip:"View or update mappings",img:i.default.createElement("img",{className:"img-responsive",alt:"mappings",src:"../../../assets/images/"+n.config.name+"/sidebar/mapping.svg"})},{label:"Search Sandbox",link:n.contextPath+"search-sandbox/",type:"internal",name:"search-sandbox",tooltip:"Update search preferences",img:i.default.createElement("img",{className:"img-responsive",alt:"search-sandbox",src:"../../../assets/images/"+n.config.name+"/sidebar/dashboard.svg"})},{label:"Browser",link:n.contextPath+"browser/",type:"internal",name:"browser",tooltip:"Create, view and manage app data",img:i.default.createElement("img",{className:"img-responsive",alt:"browser",src:"../../../assets/images/"+n.config.name+"/sidebar/browser.svg"})},{label:"Analytics",link:n.contextPath+"analytics/",type:"internal",name:"analytics",tooltip:"View app analytics",img:i.default.createElement("img",{className:"img-responsive",alt:"analytics",src:"../../../assets/images/"+n.config.name+"/sidebar/dashboard.svg"})},{label:"Credentials",link:n.contextPath+"credentials/",type:"internal",name:"credentials",tooltip:"View and manage API access credentials",img:i.default.createElement("img",{className:"img-responsive",alt:"credentials",src:"../../../assets/images/"+n.config.name+"/sidebar/credentials.svg"})},{label:"Team",link:n.contextPath+"team/",type:"internal",name:"team",tooltip:"Manage who can access your app data",img:i.default.createElement("img",{className:"img-responsive",alt:"team",src:"../../../assets/images/"+n.config.name+"/sidebar/team.svg"})}],n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.changeView=function(e){this.props.changeView(e)},t.prototype.componentWillMount=function(){var e=this;this.listenEvent=l.eventEmitter.addListener("activeApp",function(t){e.stopUpdate||e.setState(t)})},t.prototype.componentDidMount=function(){var e=this,t=function(){$(".ad-detail").css({"min-height":$(e.sidebarRef).height()+30})};setTimeout(t.bind(this),1e3),$(window).resize(t.bind(this))},t.prototype.componentWillUnmount=function(){this.stopUpdate=!0,this.listenEvent&&this.listenEvent.remove(),$(window).unbind("resize")},t.prototype.renderElement=function(e){var t=this,a=null;switch(e){case"links":a=this.links.filter(function(e){return t.config.appDashboard.indexOf(e.name)>-1}).map(function(e,a){var n=(0,r.default)({active:t.props.currentView===e.name}),l=i.default.createElement("div",{className:"img-container"},e.img),p=i.default.createElement(s.Link,{className:n,to:e.link+t.state.activeApp},l,i.default.createElement("span",{className:"ad-detail-sidebar-item-label"},e.label));return i.default.createElement(o.default,{overlay:i.default.createElement("div",null,e.tooltip),mouseLeaveDelay:0,key:e.name+"-"+(a+1)},i.default.createElement("li",{className:"ad-detail-sidebar-item",key:e.name+"-item-"+(a+1)},p))})}return a},t.prototype.render=function(){var e=this;return i.default.createElement("aside",{className:"ad-detail-sidebar"},i.default.createElement("ul",{className:"ad-detail-sidebar-container",ref:function(t){e.sidebarRef=t}},this.renderElement("links")))},t}(n.Component);t.default=d},379:function(e,t,a){"use strict";t.__esModule=!0;var n=p(a(0)),i=a(1),s=p(i),r=p(a(378)),o=p(a(93)),l=a(16);function p(e){return e&&e.__esModule?e:{default:e}}var c=function(){return s.default.createElement("div",{className:"page404"},s.default.createElement("div",{className:"row"},s.default.createElement("div",{className:"col s12"},s.default.createElement("i",{className:"fa fa-exclamation-triangle"}),"  Seems like this app view doesn","'","t exist or you don","'","t have access to it.")),s.default.createElement("div",{className:"row"},s.default.createElement("div",{className:"col s12"},"Go to"," ",s.default.createElement("a",{href:"/apps"},"/apps",s.default.createElement("i",{className:"fa fa-cursor"})))))},u=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.state={showChild:!1},n.selectedApp=n.props.pageInfo.appName,n.config=o.default,n.getAllApps(),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillReceiveProps=function(){this.props.pageInfo.appName!==this.selectedApp&&(this.selectedApp=this.props.pageInfo.appName,this.getAllApps())},t.prototype.isAllowed=function(){this.config.appDashboard.indexOf(this.props.pageInfo.currentView)<0&&l.appbaseService.pushUrl("./apps")},t.prototype.getAllApps=function(){var e=this;l.appbaseService.allApps(!0).then(function(t){var a=t.body.filter(function(t){return e.props.pageInfo.appName===t.appname});e.setState({showChild:!(!a||!a.length)||null})})},t.prototype.render=function(){this.isAllowed();var e=s.default.Children.map(this.props.children,function(e){return s.default.cloneElement(e,{})});return s.default.createElement("div",{className:"ad-detail row"},s.default.createElement(r.default,{currentView:this.props.pageInfo.currentView,appName:this.props.pageInfo.appName,appId:this.props.pageInfo.appId}),s.default.createElement("div",{className:"ad-detail-view-container"},s.default.createElement("div",{className:"ad-detail-view"},this.state.showChild?e:null,null===this.state.showChild?s.default.createElement(c,null):null)))},t}(i.Component);t.default=u,u.propTypes={pageInfo:n.default.shape({currentView:n.default.string.isRequired,appName:n.default.string.isRequired,appId:n.default.oneOfType([n.default.number.isRequired,n.default.string.isRequired])})},u.defaultProps={}}}]);