"use strict";(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[414],{55767:function(Pe,W,r){r.r(W),r.d(W,{default:function(){return Oe}});var q=r(15009),l=r.n(q),ee=r(99289),I=r.n(ee),te=r(19632),M=r.n(te),A=r(5574),B=r.n(A),H=r(93769),ae=r(12121),j=r(38345),h=r(14373),T=r(89129),ne=r(47375),L=r(97269),V=r(64317),G=r(97462),Y=r(67294),re=r(96974),N=r(84908),O=r(26713),U=r(20550),v=r(69677),m=r(30381),g=r.n(m),y=r(48555),d=r(63430),k=r(12461),Te=r(80737),Ce=r(71577),ve=r(10010),he=r(24969),C=r(49748),J=r(80854),Ye={tag:"tag___kCu44"},e=r(85893),Ze=H.Z.Divider,Se=[{title:"\u63D2\u4EF6\u540D\u79F0",dataIndex:"name"},{title:"\u7248\u672C",search:!1,dataIndex:"pversion"},{title:"\u72B6\u6001",search:!1,dataIndex:"status",valueEnum:{true:{text:"\u5728\u7EBF",status:"Success"},false:{text:"\u79BB\u7EBF",status:"Error"}}},{title:function(){return(0,e.jsx)(N.Z,{title:"kbps",children:(0,e.jsxs)(O.Z,{children:["\u4E0A\u4F20\u901F\u7387",(0,e.jsx)(ve.Z,{style:{color:"#1890ff"}})]})})},search:!1,width:"10%",dataIndex:"tx_speed",renderText:function(o){return(o/1024).toFixed(2)}},{title:function(){return(0,e.jsxs)(O.Z,{children:["\u4E0A\u4F20 tps",(0,e.jsx)(ve.Z,{style:{color:"#1890ff"}})]})},search:!1,width:"10%",dataIndex:"tx_tps",renderText:function(o){return o.toFixed(2)}},{title:"\u4E0A\u7EBF\u65F6\u95F4",search:!1,dataIndex:"start_at",renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}},{title:"\u6700\u8FD1\u5FC3\u8DF3\u65F6\u95F4",search:!1,dataIndex:"last_heartbeat_time",renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}},{title:"\u64CD\u4F5C",search:!1,valueType:"option",key:"option",dataIndex:"",render:function(o,c,F,R){return[(0,e.jsx)("a",{href:"javascript:void(0);",onClick:function(){var _;return(0,C.nc)({name:(_=c.name)!==null&&_!==void 0?_:"",pversion:c.pversion,agent_id:window.location.pathname.replace("/assetcenter/host/",""),action:"upgrade"}).then(function(Z){return Z.code!=0?(k.ZP.error("\u5347\u7EA7\u5931\u8D25:"+Z.data),!1):(k.ZP.success("\u5347\u7EA7\u6210\u529F"),Z)})},rel:"noopener noreferrer",children:"\u5347\u7EA7"},"remove"),(0,e.jsx)("a",{href:"javascript:void(0);",onClick:function(){var _;return(0,C.nc)({name:(_=c.name)!==null&&_!==void 0?_:"",pversion:c.pversion,agent_id:window.location.pathname.replace("/assetcenter/host/",""),action:"delete"}).then(function(Z){return Z.code!=0?(k.ZP.error("\u5220\u9664\u5931\u8D25:"+Z.data),!1):(k.ZP.success("\u5220\u9664\u6210\u529F"),Z)})},rel:"noopener noreferrer",children:"\u5378\u8F7D"},"remove")]}}],Me=[{title:"PID",dataIndex:"pid",width:"5%",defaultSortOrder:"descend"},{title:"PPID",search:!1,dataIndex:"ppid",width:"5%"},{title:"\u8FDB\u7A0B\u540D",dataIndex:"name",width:"10%",copyable:!0,ellipsis:!0},{title:"\u6267\u884C\u6587\u4EF6",dataIndex:"exe",ellipsis:!0,width:"30%",copyable:!0},{title:"UID",search:!1,dataIndex:"uid",width:"5%"},{title:"\u7528\u6237\u540D",search:!1,dataIndex:"username",width:"10%",ellipsis:!0,order:1},{title:"\u542F\u52A8\u65F6\u95F4",search:!1,width:"17.5%",dataIndex:"start_time",renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}},{title:"\u6570\u636E\u66F4\u65B0\u65F6\u95F4",search:!1,width:"17.5%",dataIndex:"update_time",renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}],Ae=[{title:"UID",dataIndex:"uid",width:"5%",defaultSortOrder:"descend"},{title:"GID",search:!1,dataIndex:"gid",width:"5%"},{title:"\u7528\u6237\u540D",dataIndex:"username",width:"10%",ellipsis:!0,copyable:!0},{title:"\u7528\u6237\u7EC4\u540D",dataIndex:"group_name",width:"10%",ellipsis:!0,copyable:!0},{title:"\u5386\u53F2\u767B\u5F55 IP",dataIndex:"last_login_ip",ellipsis:!0,width:"10%",search:!1},{title:"\u5BC6\u7801\u66F4\u65B0\u65F6\u95F4",search:!1,dataIndex:"password_update_time",ellipsis:!0,width:"14%"},{title:"Home \u76EE\u5F55",search:!1,dataIndex:"home_dir",ellipsis:!0,width:"13%"},{title:"shell",search:!1,dataIndex:"shell",ellipsis:!0,width:"13%"},{title:"\u7528\u6237\u4FE1\u606F",search:!1,ellipsis:!0,dataIndex:"info",width:"20%"}],He=[{title:"PID",dataIndex:"pid",width:"5%"},{title:"\u547D\u4EE4",search:!1,copyable:!0,dataIndex:"comm",width:"10%"},{title:"dip",dataIndex:"dip",width:"10%"},{title:"dport",dataIndex:"dport",ellipsis:!0,width:"5%"},{title:"sip",search:!1,dataIndex:"sip",width:"10%"},{title:"sport",search:!1,dataIndex:"sport",width:"5%"},{title:"\u547D\u4EE4",search:!1,dataIndex:"cmdline",width:"20%",ellipsis:!0,copyable:!0}],ze=[{title:"\u6587\u4EF6\u8DEF\u5F84",dataIndex:"path",width:"20%",ellipsis:!0,copyable:!0},{title:"\u7528\u6237\u540D",search:!1,dataIndex:"user",width:"10%",ellipsis:!0},{title:"minute",search:!1,dataIndex:"minute",width:"5%",ellipsis:!0},{title:"hour",search:!1,dataIndex:"hour",width:"5%",ellipsis:!0},{title:"dom",search:!1,dataIndex:"day_of_month",width:"5%",ellipsis:!0},{title:"month",search:!1,dataIndex:"month",width:"5%",ellipsis:!0},{title:"dow",search:!1,dataIndex:"day_of_week",width:"5%",ellipsis:!0},{title:"\u547D\u4EE4",dataIndex:"command",width:"45%",ellipsis:!0,copyable:!0}],Be=[{title:"PID",search:!1,dataIndex:"pid",width:"5%",ellipsis:!0},{title:"\u7C7B\u578B",dataIndex:"type",width:"10%",ellipsis:!0},{title:"\u540D\u79F0",dataIndex:"name",width:"13%",copyable:!0,ellipsis:!0},{title:"\u5BB9\u5668\u540D\u79F0",dataIndex:"container_name",width:"8%",ellipsis:!0,copyable:!0},{title:"\u7248\u672C",search:!1,dataIndex:"version",width:"5%",ellipsis:!0},{title:"\u76D1\u542C\u7AEF\u53E3",search:!1,dataIndex:"listen_addrs",width:"15%",ellipsis:!0},{title:"UID",search:!1,dataIndex:"uid",width:"5%",ellipsis:!0},{title:"\u6267\u884C\u547D\u4EE4",search:!1,dataIndex:"cmdline",width:"35%",ellipsis:!0,copyable:!0}],Re=[{title:"\u540D\u79F0",dataIndex:"name",width:"15%",copyable:!0,ellipsis:!0},{title:"Size",search:!1,dataIndex:"size",width:"10%",ellipsis:!0,sorter:!0},{title:"\u5F15\u7528\u8BA1\u6570",dataIndex:"refcount",width:"5%",ellipsis:!0,search:!1},{title:"Used by",search:!1,dataIndex:"used_by",width:"30%",ellipsis:!0},{title:"State",dataIndex:"state",width:"6%",search:!1,ellipsis:!0,filters:!0,onFilter:!0,valueEnum:{Live:{text:"Live",status:"success"},Loading:{text:"Loading",status:"default"}}},{title:"Addr",dataIndex:"addr",width:"15%",ellipsis:!0,copyable:!0},{title:"\u66F4\u65B0\u65F6\u95F4",search:!1,dataIndex:"update_time",renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}],$e=[{title:"PID",dataIndex:"pid",width:"5%",ellipsis:!0,search:!1},{title:"ID",search:!1,dataIndex:"id",width:"18%",ellipsis:!0,copyable:!0},{title:"\u8FD0\u884C\u65F6",dataIndex:"runtime",width:"5%",ellipsis:!0,search:!1,filters:!0,onFilter:!0,valueEnum:{containerd:{text:"containerd"},docker:{text:"docker"},kubelet:{text:"kubelet"},"kube-apiserver":{text:"kube-apiserver"}}},{title:"\u540D\u79F0",dataIndex:"names",width:"10%",copyable:!0,ellipsis:!0},{title:"\u955C\u50CF\u540D\u79F0",dataIndex:"image_name",width:"10%",copyable:!0,ellipsis:!0},{title:"\u72B6\u6001",dataIndex:"state",width:"5%",ellipsis:!0,valueEnum:{running:{text:"\u8FD0\u884C\u4E2D",status:"Success"},exited:{text:"\u5DF2\u9000\u51FA",status:"Error"}},filters:!0,onFilter:!0,search:!1},{title:"\u72B6\u6001\u8BE6\u60C5",dataIndex:"status",width:"12%",ellipsis:!0,search:!1},{title:"\u5BB9\u5668\u6807\u7B7E",search:!1,dataIndex:"labels",width:"20%",ellipsis:!0},{title:"\u521B\u5EFA\u65F6\u95F4",search:!1,dataIndex:"created",sorter:!0,renderText:function(o){var c=new Date(o*1e3);return g()(c).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}];function se(x){var o,c,F=0;if(x.plugins_info!==void 0)for(var R in x.plugins_info){var E,_;F+=(E=(_=x.plugins_info[R])===null||_===void 0?void 0:_.cpu)!==null&&E!==void 0?E:0}return F+=(o=(c=x.agent_info)===null||c===void 0?void 0:c.cpu)!==null&&o!==void 0?o:0,F}function ie(x){var o,c,F=0;if(x.plugins_info!==void 0)for(var R in x.plugins_info){var E,_;F+=(E=(_=x.plugins_info[R])===null||_===void 0?void 0:_.rss)!==null&&E!==void 0?E:0}return F+=(o=(c=x.agent_info)===null||c===void 0?void 0:c.rss)!==null&&o!==void 0?o:0,F=F/(1024*1024),F}var Ke=function(){var o,c,F,R,E,_,Z,ue,le,S=(0,re.UO)(),Ue=(0,Y.useRef)(),ke=(0,Y.useState)(!1),me=B()(ke,2),ge=me[0],Le=me[1],xe={},Ge=Y.useState(xe),Ie=B()(Ge,2),f=Ie[0],Ne=Ie[1],We=Te.Z.useForm(),Ve=B()(We,1),Je=Ve[0],Qe=(0,J.useRequest)(function(i){return(0,C.pi)({agent_id:S.agent_id})},{pollingInterval:30*1e3}),$=Qe.data,K=(o=(0,J.useRequest)(C.UV).data)===null||o===void 0?void 0:o.plugins,Xe=(0,Y.useState)(!1),_e=B()(Xe,2),de=_e[0],we=_e[1],be=(0,Y.useRef)(null),qe=(0,Y.useState)(""),ye=B()(qe,2),Q=ye[0],je=ye[1];(0,Y.useEffect)(function(){if(de){var i;(i=be.current)===null||i===void 0||i.focus()}},[de]);var et=function(){we(!0)},De=function(){we(!1),je(""),(0,J.request)("/api/v1/tag",{method:"PUT",params:{agent_id:S.agent_id,name:Q}});var n=[],a=new Set;z!==void 0&&(a=new Set(z)),a.has(Q)||n.push.apply(n,M()(z).concat([Q])),oe(n)},tt=function(n){je(n.target.value)},at=(0,Y.useState)([]),Fe=B()(at,2),z=Fe[0],oe=Fe[1],nt={width:60,verticalAlign:"top"},rt=function(n){var a=z==null?void 0:z.filter(function(p){return p!==n});(0,J.request)("/api/v1/tag",{method:"DELETE",params:{agent_id:S.agent_id,name:n}}),oe(a)};return Y.useEffect(function(){Ne($!=null?$:xe),oe($==null?void 0:$.tags)},[$]),(0,e.jsxs)(ae._z,{title:" ",children:[(0,e.jsx)(j.Z,{title:"\u57FA\u7840\u4FE1\u606F",children:(0,e.jsxs)(h.vY,{actionRef:Ue,column:4,dataSource:f,children:[(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","hostname"],label:"\u4E3B\u673A\u540D\u79F0"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","intranet_ipv4"],label:"\u5185\u7F51 IPv4"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","pid"],label:"PID"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","boot_at"],label:"\u7CFB\u7EDF\u542F\u52A8\u65F6\u95F4",renderText:function(n){var a=new Date(n*1e3);return g()(a).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","arch"],label:"\u7CFB\u7EDF\u67B6\u6784"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","intranet_ipv6"],label:"\u5185\u7F51 IPv6"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","addr"],label:"\u8FDE\u63A5\u5730\u5740"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","last_heartbeat_time"],label:"\u6700\u8FD1\u5FC3\u8DF3\u65F6\u95F4",renderText:function(n){var a=new Date(n*1e3);return g()(a).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}),(0,e.jsx)(h.vY.Item,{dataIndex:"agent_info",label:"\u7CFB\u7EDF\u7248\u672C",renderText:function(n){return n!==void 0?n.platform+" "+n.platform_family+" "+n.platform_version:"-"}}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","extranet_ipv4"],label:"\u516C\u7F51 IPv4"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","nfd"],label:"FD"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","start_at"],label:"Agent \u542F\u52A8\u65F6\u95F4",renderText:function(n){var a=new Date(n*1e3);return g()(a).utc(!0).format("YYYY-MM-DD HH:mm:ss")}}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","kernel_version"],label:"\u5185\u6838\u7248\u672C"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","extranet_ipv6"],label:"\u516C\u7F51 IPv6"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","cpu_num"],label:"CPU"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","version"],label:"Agent \u7248\u672C"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","cpu_name"],label:"CPU\u540D\u79F0"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","tags"],label:"\u6807\u7B7E",render:function(){return(0,e.jsxs)(O.Z,{size:[0,8],children:[(0,e.jsx)(O.Z,{size:[0,8],children:z==null?void 0:z.map(function(n,a){return(0,e.jsx)(U.Z,{closable:!0,onClose:function(){return rt(n)},color:"green",children:n},n)})}),de?(0,e.jsx)(v.Z,{ref:be,type:"text",size:"small",style:nt,value:Q,onChange:tt,onBlur:De,onPressEnter:De}):(0,e.jsx)(U.Z,{onClick:et,className:Ye.tag,children:(0,e.jsx)(he.Z,{style:{fontSize:"10px",width:"10px",height:"10px"}})})]})}}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","ngr"],label:"goroutine"}),(0,e.jsx)(h.vY.Item,{dataIndex:["agent_info","online"],label:"\u5BA2\u6237\u7AEF\u72B6\u6001",valueEnum:{false:{text:"\u79BB\u7EBF",status:"Error"},true:{text:"\u5728\u7EBF",status:"Success"}}})]})}),(0,e.jsx)("p",{}),(0,e.jsx)(j.Z,{title:"\u6027\u80FD\u8D1F\u8F7D",children:(0,e.jsx)(y.Z,{onResize:function(n){Le(n.width<596)},children:(0,e.jsxs)(H.Z.Group,{direction:ge?"column":"row",children:[(0,e.jsx)(H.Z,{statistic:{title:"Agent CPU",value:se(f)*100,suffix:"%",precision:2},chart:(0,e.jsx)(d.Z,{height:70,width:70,innerRadius:.7,renderer:"svg",data:[{name:"",value:.1-se(f)},{name:"CPU",value:se(f)}],angleField:"value",colorField:"name",statistic:void 0,legend:!1,tooltip:!1,label:!1,color:["#f5f5f5","#6394f9"]}),chartPlacement:"left"}),(0,e.jsx)(H.Z,{statistic:{title:"Agent \u5185\u5B58",value:ie(f),suffix:"Mb",precision:2},chart:(0,e.jsx)(d.Z,{height:70,width:70,innerRadius:.7,renderer:"svg",data:[{name:"",value:250-ie(f)},{name:"\u5185\u5B58",value:ie(f)}],angleField:"value",colorField:"name",statistic:void 0,legend:!1,tooltip:!1,label:!1,color:["#f5f5f5","#6394f9"]}),chartPlacement:"left"}),(0,e.jsx)(Ze,{type:ge?"horizontal":"vertical"}),(0,e.jsx)(H.Z,{statistic:{title:"\u7CFB\u7EDF CPU",value:f==null||(c=f.agent_info)===null||c===void 0?void 0:c.sys_cpu,suffix:"%",precision:2},chart:(0,e.jsx)(d.Z,{height:70,width:70,innerRadius:.7,renderer:"svg",data:[{name:"",value:100-((F=f==null||(R=f.agent_info)===null||R===void 0?void 0:R.sys_cpu)!==null&&F!==void 0?F:0)},{name:"CPU",value:f==null||(E=f.agent_info)===null||E===void 0?void 0:E.sys_cpu}],angleField:"value",colorField:"name",statistic:void 0,legend:!1,tooltip:!1,label:!1,color:["#f5f5f5","#6394f9"]}),chartPlacement:"left"}),(0,e.jsx)(H.Z,{statistic:{title:"\u7CFB\u7EDF\u5185\u5B58",value:f==null||(_=f.agent_info)===null||_===void 0?void 0:_.sys_mem,suffix:"%",precision:2},chart:(0,e.jsx)(d.Z,{height:70,width:70,innerRadius:.7,renderer:"svg",data:[{name:"",value:100-((Z=f==null||(ue=f.agent_info)===null||ue===void 0?void 0:ue.sys_mem)!==null&&Z!==void 0?Z:0)},{name:"\u5185\u5B58",value:f==null||(le=f.agent_info)===null||le===void 0?void 0:le.sys_mem}],angleField:"value",colorField:"name",statistic:void 0,legend:!1,tooltip:!1,label:!1,color:["#f5f5f5","#6394f9"]}),chartPlacement:"left"})]})},"resize-observer")}),(0,e.jsx)("p",{}),(0,e.jsxs)(j.Z,{tabs:{type:"card"},title:"\u4E3B\u673A\u8BE6\u60C5",children:[(0,e.jsx)(j.Z.TabPane,{tab:"\u63D2\u4EF6\u5217\u8868",children:(0,e.jsx)(T.Z,{columns:Se,options:!1,rowKey:function(){return Math.random()},dataSource:f.plugins_info,search:{defaultCollapsed:!1,labelWidth:"auto",optionRender:function(n,a,p){return[(0,e.jsx)(ne.Y,{title:"\u4E0B\u53D1\u63D2\u4EF6",trigger:(0,e.jsxs)(Ce.Z,{type:"primary",children:[(0,e.jsx)(he.Z,{}),"\u4E0B\u53D1\u63D2\u4EF6"]}),form:Je,autoFocusFirstInput:!0,modalProps:{destroyOnClose:!0,onCancel:function(){return console.log("run")}},submitTimeout:2e3,onFinish:function(u){var s,D;return(0,C.nc)({name:(s=u.name)!==null&&s!==void 0?s:"",pversion:u.pversion,agent_id:(D=S.agent_id)!==null&&D!==void 0?D:"",action:"insert"}).then(function(t){return t.code!=0?(k.ZP.error("\u4E0B\u53D1\u5931\u8D25:"+t.data),!1):(k.ZP.success("\u4E0B\u53D1\u6210\u529F"),t)})},children:(0,e.jsxs)(L.A.Group,{children:[(0,e.jsx)(V.Z,{width:"md",name:"name",label:"\u63D2\u4EF6\u540D\u79F0",labelAlign:"left",request:I()(l()().mark(function w(){var u,s,D,t,X;return l()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(u=new Array,s=new Map,K===void 0){b.next=16;break}b.t0=l()().keys(K);case 4:if((b.t1=b.t0()).done){b.next=16;break}if(D=b.t1.value,t=K[D].name,s.get(t)!==!0){b.next=11;break}return b.abrupt("continue",4);case 11:s.set(t,!0);case 12:X={label:t,value:t},u.push(X),b.next=4;break;case 16:return b.abrupt("return",u);case 17:case"end":return b.stop()}},w)})),placeholder:"\u8BF7\u9009\u62E9\u540D\u79F0",rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u63D2\u4EF6\u540D\u79F0"}]}),(0,e.jsx)(G.Z,{name:["name"],ignoreFormListField:!0,children:function(u){var s=u.name;return(0,e.jsx)(V.Z,{width:"md",name:"pversion",params:{name:s},request:function(){var D=I()(l()().mark(function t(X){var ce,b,fe,pe,Ee;return l()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:if(ce=X.name,b=new Array,K===void 0){P.next=13;break}P.t0=l()().keys(K);case 4:if((P.t1=P.t0()).done){P.next=13;break}if(fe=P.t1.value,K[fe].name==ce){P.next=8;break}return P.abrupt("continue",4);case 8:pe=K[fe].pversion,Ee={label:pe,value:pe},b.push(Ee),P.next=4;break;case 13:return P.abrupt("return",b);case 14:case"end":return P.stop()}},t)}));return function(t){return D.apply(this,arguments)}}(),label:"\u63D2\u4EF6\u7248\u672C",placeholder:"\u8BF7\u8F93\u5165\u7248\u672C",rules:[{required:!0}]})}})]})})].concat(M()(p.reverse()))}}})},"tab1"),(0,e.jsx)(j.Z.TabPane,{tab:"\u8FDB\u7A0B\u5217\u8868",children:(0,e.jsx)(T.Z,{columns:Me,options:!1,rowKey:function(){return Math.random()},pagination:{pageSize:10,pageSizeOptions:["10","20","50"]},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"processes",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{pid:a.pid,name:a.name,exe:a.exe}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab2"),(0,e.jsx)(j.Z.TabPane,{tab:"\u7F51\u7EDC\u5217\u8868",children:(0,e.jsx)(T.Z,{columns:He,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"sockets",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{pid:a.pid,dip:a.dip,dport:a.dport}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab3"),(0,e.jsx)(j.Z.TabPane,{tab:"\u7528\u6237\u5217\u8868",children:(0,e.jsx)(T.Z,{columns:Ae,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"users",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{username:a.username,group_name:a.group_name,uid:a.uid}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab4"),(0,e.jsx)(j.Z.TabPane,{tab:"\u5B9A\u65F6\u4EFB\u52A1",children:(0,e.jsx)(T.Z,{columns:ze,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"crons",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{command:a.command,path:a.path}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab5"),(0,e.jsx)(j.Z.TabPane,{tab:"\u5E94\u7528\u8D44\u4EA7",children:(0,e.jsx)(T.Z,{columns:Be,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"apps",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{type:a.type,name:a.name,container_name:a.container_name}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab6"),(0,e.jsx)(j.Z.TabPane,{tab:"\u5185\u6838\u6A21\u5757",children:(0,e.jsx)(T.Z,{columns:Re,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,C.Nh)({type:"kmods",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{addr:a.addr,name:a.name}});case 2:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 4:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab7"),(0,e.jsx)(j.Z.TabPane,{tab:"\u5BB9\u5668\u8D44\u4EA7",children:(0,e.jsx)(T.Z,{columns:$e,options:!1,pagination:{pageSize:10},rowKey:function(){return Math.random()},request:function(){var i=I()(l()().mark(function n(a,p,w){var u,s;return l()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log(p,w),t.next=3,(0,C.Nh)({type:"containers",agent_id:(u=S.agent_id)!==null&&u!==void 0?u:"",page:a.current,size:a.pageSize,sort:p,filter:w,keyword:{names:a.names,image_name:a.image_name}});case 3:return s=t.sent,t.abrupt("return",{data:s.data.assets,success:s.code==0,total:s.data.total});case 5:case"end":return t.stop()}},n)}));return function(n,a,p){return i.apply(this,arguments)}}()})},"tab8")]})]})},Oe=Ke},49748:function(Pe,W,r){r.d(W,{Ek:function(){return B},LH:function(){return re},Nh:function(){return O},UV:function(){return V},Zs:function(){return ae},nc:function(){return ne},pi:function(){return h},sk:function(){return Y}});var q=r(15009),l=r.n(q),ee=r(97857),I=r.n(ee),te=r(99289),M=r.n(te),A=r(80854);function B(v){return H.apply(this,arguments)}function H(){return H=M()(l()().mark(function v(m){return l()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.abrupt("return",(0,A.request)("/api/v1/grpc/conn/count",I()({method:"GET"},m||{})));case 1:case"end":return y.stop()}},v)})),H.apply(this,arguments)}function ae(v,m){return j.apply(this,arguments)}function j(){return j=M()(l()().mark(function v(m,g){return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,A.request)("/api/v1/grpc/conn/basic",I()({method:"GET",params:I()({},m)},g||{})));case 1:case"end":return d.stop()}},v)})),j.apply(this,arguments)}function h(v,m){return T.apply(this,arguments)}function T(){return T=M()(l()().mark(function v(m,g){return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,A.request)("/api/v1/grpc/conn/stat",I()({method:"GET",params:I()({},m)},g||{})));case 1:case"end":return d.stop()}},v)})),T.apply(this,arguments)}function ne(v,m){return L.apply(this,arguments)}function L(){return L=M()(l()().mark(function v(m,g){return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,A.request)("/api/v1/plugin/send",I()({method:"POST",data:JSON.stringify({name:m.name,pversion:m.pversion,agent_id:m.agent_id,action:m.action}),headers:{"Content-Type":"application/json"}},g||{})));case 1:case"end":return d.stop()}},v)})),L.apply(this,arguments)}function V(v){return G.apply(this,arguments)}function G(){return G=M()(l()().mark(function v(m){return l()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.abrupt("return",(0,A.request)("/api/v1/plugin/list",I()({method:"GET"},m||{})));case 1:case"end":return y.stop()}},v)})),G.apply(this,arguments)}function Y(v){return(0,A.request)("/api/v1/plugin/delete",I()({method:"GET"},v||{}))}function re(v,m){return N.apply(this,arguments)}function N(){return N=M()(l()().mark(function v(m,g){return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,A.request)(m,I()({},g||{})));case 1:case"end":return d.stop()}},v)})),N.apply(this,arguments)}function O(v,m){return U.apply(this,arguments)}function U(){return U=M()(l()().mark(function v(m,g){return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,A.request)("/api/v1/asset/get",I()({method:"GET",params:m},g||{})));case 1:case"end":return d.stop()}},v)})),U.apply(this,arguments)}}}]);
