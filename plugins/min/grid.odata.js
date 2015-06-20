(function(c){String.prototype.format||(String.prototype.format=function(){var c=arguments;return this.replace(/\{\{|\}\}|\{(\d+)\}/g,function(d,e){return"{{"===d?"{":"}}"===d?"}":c[e]})});c.jgrid.odataHelper={resolveJsonReferences:function(c,d){function e(b,n,c){if("object"!==typeof b||!b)return b;if("[object Array]"===Object.prototype.toString.call(b)){for(g=0;g<b.length;g++){if("object"!==typeof b[g]||!b[g])return b[g];b[g]=b[g].$ref?e(b[g],g,b):e(b[g],n,b)}return b}if(b.$ref){h=b.$ref;if(p[h])return p[h];
d.push([c,n,h])}else{if(b.$id){n=b.$id;delete b.$id;if(b.$values)b=b.$values.map(e);else for(var a in b)b.hasOwnProperty(a)&&(b[a]=e(b[a],a,b));p[n]=b}return b}}var g,h,p={};d=d||[];"string"===typeof c&&(c=JSON.parse(c));c=e(c);for(g=0;g<d.length;g++)h=d[g],h[0][h[1]]=p[h[2]];return c},convertXmlToJson:function(a){var d={},e,g,h,p;if(!a)return null;if(1===a.nodeType){if(0<a.attributes.length)for(d["@attributes"]={},e=0;e<a.attributes.length;e++)g=a.attributes.item(e),d["@attributes"][g.nodeName]=
g.nodeValue}else 3===a.nodeType?d=a.nodeValue:a.nodeType||(d=a);if(a.hasChildNodes&&a.hasChildNodes())for(e=0;e<a.childNodes.length;e++){g=a.childNodes.item(e);if(3===g.nodeType)return g.nodeValue;h=g.nodeName;void 0===d[h]?d[h]=c.jgrid.odataHelper.convertXmlToJson(g):(void 0===d[h].push&&(p=d[h],d[h]=[],d[h].push(p)),d[h].push(c.jgrid.odataHelper.convertXmlToJson(g)))}return c.isEmptyObject(d)?null:d},cmTemplateFormatter:function(a,d,e){if(!d.colModel.odataexpand||"link"===d.colModel.odataexpand||
"subgrid"===d.colModel.odataexpand)return"xml"!==this.p.datatype?e["@odata.editLink"]&&e[d.colModel.name+"@odata.navigationLink"]?(a=e[d.colModel.name+"@odata.navigationLink"],a='<a href="{0}/{1}" target="_self" data-id="{1}" data-type="" onclick="">{2}</a>'.format(this.p.odataBaseUrl,a,d.colModel.name)):(a=e[this.p.jsonReader.id],a='<a href="{0}({1})/{2}" target="_self" data-id="{1}" data-type="" onclick="">{2}</a>'.format(this.p.url,a,d.colModel.name)):(a=function(a){return c(e).filter(function(){return this.localName&&
this.localName.toLowerCase()===a}).text()}(this.p.xmlReader.id.toLowerCase()),a='<a href="{0}({1})/{2}" target="_self" data-id="{1}" data-type="" onclick="">{2}</a>'.format(this.p.url,a,d.colModel.name)),"subgrid"===d.colModel.odataexpand&&(a=a.replace('onclick=""','onclick="javascript: return $.jgrid.odataHelper.subgridRowExpandClick(this);"'),a=a.replace('data-type=""','data-type="'+d.colModel.type+'"')),a;if("json"===d.colModel.odataexpand)return"xml"===this.p.datatype&&(a=c(e).filter(function(){return this.localName.toLowerCase()===
d.colModel.name.toLowerCase()}),a=c.jgrid.odataHelper.convertXmlToJson(a[0])),JSON.stringify(a,null,1)},subgridRowExpandClick:function(a){var d=c("#grid");c(d).jqGrid("setGridParam",{odataActiveSubgridUrl:c(a).prop("href")});c(d).jqGrid("setGridParam",{odataActiveSubgridType:c(a).data("type")});c(d).jqGrid("expandSubGridRow",c(a).data("id"));return!1},loadError:function(a,d,e){var g=a.status,h=e;if(!a.responseJSON)if(a.responseXML)a.responseText=a.responseText.replace(/<(\/?)([^:>\s]*:)?([^>]+)>/g,
"<$1$3>"),a.responseXML=c.parseXML(a.responseText),a.responseJSON=c.jgrid.odataHelper.convertXmlToJson(a.responseXML);else if(a.responseText)try{a.responseJSON=c.parseJSON(a.responseText)}catch(p){}if(a.responseJSON){if(a=a.responseJSON["@odata.error"]||a.responseJSON["odata.error"]||a.responseJSON.error)a.innererror?a.innererror.internalexception?(d=a.innererror.internalexception.message,h=a.innererror.internalexception.stacktrace||""):(d=a.innererror.message,h=a.innererror.stacktrace||""):(d=a.message.value||
a.message,h=a.stacktrace||"")}else e&&c.isPlainObject(e)&&(d=e.message,h=e.stack,g=e.code);return"<div>Status/error code: "+g+"</div><div>Message: "+d+'</div><div style="font-size: 0.8em;">'+h+"</div><br/>"}};c.jgrid.cmTemplate.odataComplexType={editable:!1,formatter:c.jgrid.odataHelper.cmTemplateFormatter};c.jgrid.cmTemplate.odataNavigationProperty={editable:!1,formatter:c.jgrid.odataHelper.cmTemplateFormatter};c.jgrid.extend({odataInit:function(a){function d(b,n,a,f){var d,k;if(n&&(a||"nu"===f||
"nn"===f)){if(a)for(d=0;d<b.colModel.length;d++)if(k=b.colModel[d],k.name===n){if(!1===k.odata||k.odataunformat&&(n=c.isFunction(k.odataunformat)?k.odataunformat(n,a,f):k.odataunformat,!n))return;k.searchrules&&(k.searchrules.integer||k.searchrules.number||k.searchrules.date)?k.searchrules&&k.searchrules.date&&(a=(new Date(a)).toISOString()):a="'"+a+"'";break}switch(f){case "in":case "cn":return"indexof("+n+",tolower("+a+")) gt -1";case "ni":case "nc":return"indexof("+n+",tolower("+a+")) eq -1";case "bw":return"startswith("+
n+","+a+") eq true";case "bn":return"startswith("+n+","+a+") eq false";case "ew":return"endswith("+n+","+a+") eq true";case "en":return"endswith("+n+","+a+") eq false";case "nu":return n+" eq null";case "nn":return n+" ne null";default:return n+" "+f+" "+a}}}function e(b,n){var a,c,m="";if(b.groups&&b.groups.length){for(a=0;a<b.groups.length;a++)m+="("+e(b.groups[a],n)+")",a<b.groups.length-1&&(m+=" "+b.groupOp.toLowerCase()+" ");b.rules&&b.rules.length&&(m+=" "+b.groupOp.toLowerCase()+" ")}if(b.rules.length)for(a=
0;a<b.rules.length;a++)c=b.rules[a],(c=d(n,c.field,c.data,c.op))&&(m+=c+" "+b.groupOp.toLowerCase()+" ");return m=m.trim().replace(/\s(and|or)$/,"").trim()}function g(b,a,q){var f={$top:q.rows,$skip:(parseInt(q.page,10)-1)*b.rowNum},m=b.colModel.filter(function(b){return"json"===b.odataexpand||"subgrid"===b.odataexpand});0<m.length&&(f.$expand=m.reduce(function(b,a){return b+","+a.name},"").substring(1));"jsonp"===a.datatype&&(f.$callback=a.callback);!a.version||4>a.version?(f.$inlinecount="allpages",
f.$format="xml"===a.datatype?"atom":"application/json;odata=fullmetadata"):(f.$count=!0,f.$format="xml"===a.datatype?"atom":"application/json;odata.metadata=full");q.sidx&&(f.$orderby=q.sidx+" "+q.sord);if(!q._search)return f;q.filters?(a=c.parseJSON(q.filters),b=e(a,b),0<b.length&&(f.$filter=b)):f.$filter=d(b,q.searchField,q.searchString,q.searchOper);return f}function h(b,a,d,f){var m={datatype:a.datatype,version:a.version,gencolumns:!1,entityType:b.odataActiveSubgridType,expandable:a.expandable,
odataurl:b.odataActiveSubgridUrl,errorfunc:a.errorfunc,annotations:a.annotations,useXmlSerializer:a.useXmlSerializer};c("#"+d).html('<table id="'+d+'_t" class="scroll"></table>');c("#"+d+"_t").jqGrid({colModel:b.odataSubgridCols[b.odataActiveSubgridType],beforeInitGrid:function(){c(this).jqGrid("odataInit",m)}})}function p(b,a){var d;d={datatype:a.datatype,jsonpCallback:a.callback};var f=function(c,d){return h(b,a,c,d)};c.extend(b,{serializeGridData:function(c){c=g(b,a,c);return this.p.odataPostData=
c},ajaxGridOptions:d,mtype:"GET",url:a.odataurl},d);for(d=0;d<b.colModel.length;d++)if("subgrid"===b.colModel[d].odataexpand){b.subGrid=!0;b.subGridRowExpanded=f;break}f={contentType:"application/"+("jsonp"===a.datatype?"json":a.datatype)+";charset=utf-8",datatype:"jsonp"===a.datatype?"json":a.datatype};b.inlineEditing=c.extend(!0,{beforeSaveRow:function(b,c,d){"edit"===b.extraparam.oper?(b.url=a.odataurl,b.mtype=a.odataverbs.inlineEditingEdit,b.url+="("+c+")"):(b.url=a.odataurl,b.mtype=a.odataverbs.inlineEditingAdd);
return!0},serializeSaveData:function(a){return JSON.stringify(a)},ajaxSaveOptions:f},b.inlineEditing||{});c.extend(b.formEditing,{onclickSubmit:function(c,d,f){"add"===f?(c.url=a.odataurl,c.mtype=a.odataverbs.formEditingAdd):"edit"===f&&(c.url=a.odataurl+"("+d[b.id+"_id"]+")",c.mtype=a.odataverbs.formEditingEdit);return d},ajaxEditOptions:f,serializeEditData:function(a){return JSON.stringify(a)}});c.extend(b.formDeleting,{url:a.odataurl,mtype:"DELETE",serializeDelData:function(a){return""},onclickSubmit:function(a,
b){a.url+="("+b+")";return""},ajaxDelOptions:f});f=(f=b.colModel.filter(function(a){return!!a.key})[0])?f.name:b.sortname||"id";if("xml"===a.datatype){a.annotations&&c.extend(!0,b,{loadBeforeSend:function(a){a.setRequestHeader("Prefer",'odata.include-annotations="*"')}});var m=a.useXmlSerializer?">feed":"ArrayOf"+a.entityType,k=a.useXmlSerializer?">entry":a.entityType,e=a.useXmlSerializer?">content>properties":"";c.extend(!0,b,{xmlReader:{root:function(a){a=c(m,a).get(0);a.innerHTML=a.innerHTML.replace(/<(\/?)([^:>\s]*:)?([^>]+)>/g,
"<$1$3>");var d=c(a).attr("m:context");d&&(b.odataBaseUrl=d.substring(0,d.indexOf("/$metadata")),b.odataEntitySet=d.substring(d.indexOf("#")+1).replace("/$entity",""));return a},row:function(a){var b,d,f;a=c(k,a);for(f=0;f<a.length;f++)c(">link",a[f]).each(function(){0<=c(this).attr("href").indexOf("$links")||(d=c(this).attr("title"),0<c(this).html().length?(b=c(this).find(">inline"+m+k+e),0===b.length&&(b=c(this).find(">inline"+k+e)),0<b.length&&(b=b.get(0).childNodes),c(e+" "+d,a[f]).remove(),c(e,
a[f]).append(c("<"+d+">").append(b).get(0))):("edit"===c(this).attr("rel")&&0<c(this).attr("href").length&&(d="odata.editLink"),c(e,a[f]).append(c("<"+d+">").text(c(this).attr("href")).get(0))))});return a},cell:function(a){return c(e,a).get(0).childNodes},records:function(a){return c(m+k,a).length},page:function(a){return Math.ceil((b.odataPostData.$skip+b.rowNum)/b.rowNum)},total:function(a){a=c(m+k,a).length;return Math.ceil((b.odataPostData.$skip+b.rowNum)/b.rowNum)+(0<a?1:0)},repeatitems:!0,
userdata:a.useXmlSerializer?"userdata":"ArrayOfUserData UserData",id:f}})}else a.annotations?c.extend(!0,b,{loadBeforeSend:function(a){a.setRequestHeader("Prefer",'odata.include-annotations="*"')},jsonReader:{root:"value",repeatitems:!1,records:function(b){return b[a.annotationName].records},page:function(b){return b[a.annotationName].page},total:function(b){return b[a.annotationName].total},userdata:function(b){return b[a.annotationName].userdata},id:f}}):c.extend(!0,b,{jsonReader:{root:function(a){var c=
a["@odata.context"];c&&(b.odataBaseUrl=c.substring(0,c.indexOf("/$metadata")),b.odataEntitySet=c.substring(c.indexOf("#")+1).replace("/$entity",""));return a.value},repeatitems:!0,records:function(a){return a["odata.count"]||a["@odata.count"]},page:function(a){var c;a["odata.nextLink"]?c=parseInt(a["odata.nextLink"].split("skip=")[1],10):(c=b.odataPostData.$skip+b.rowNum,a=a["odata.count"]||a["@odata.count"],c>a&&(c=a));return Math.ceil(c/b.rowNum)},total:function(a){return Math.ceil(parseInt(a["odata.count"]||
a["@odata.count"],10)/b.rowNum)},userdata:"userdata",id:f}})}return this.each(function(){var b=this,d=c(b),e=b.p;if(b.grid&&e){var f=c.extend(!0,{gencolumns:!1,odataurl:e.url,datatype:"json",entityType:null,annotations:!1,annotationName:"@jqgrid.GridModelAnnotate",useXmlSerializer:!0,odataverbs:{inlineEditingAdd:"POST",inlineEditingEdit:"PATCH",formEditingAdd:"POST",formEditingEdit:"PUT"}},a||{});"jsonp"===f.datatype&&(f.callback="jsonpCallback");if(f.entityType){if(f.gencolumns){var m=c.extend(!0,
{parsecolfunc:null,parsemetadatafunc:null,successfunc:null,errorfunc:null,async:!1,entityType:null,metadatatype:a.datatype||"xml",metadataurl:(a.odataurl||e.url)+"/$metadata"},a||{});m.async&&(m.successfunc=function(){b.grid.hDiv&&(b.grid.hDiv.loading=!1);d.trigger("reloadGrid")},b.grid.hDiv&&(b.grid.hDiv.loading=!0));d.jqGrid("odataGenColModel",m)}p(e,f)}else c.isFunction(f.errorfunc)&&f.errorfunc({},"entityType cannot be empty")}})},odataGenColModel:function(a){function d(a,b,f){var e=[],k,g,h,
l,v,w,p,t,x={};v=c("Schema",a).attr("Namespace")+".";k=c('EntityType[Name="'+b+'"]',a).find("Property,NavigationProperty");h=(g=c('EntityType[Name="'+b+'"] Key PropertyRef',a))&&0<g.length?g.first().attr("Name"):"";k&&(f[b]=e,k.each(function(b,k){c.each(k.attributes,function(){x[this.name]=this.value});t=x.Type;l=x.Name===h;w="Property"===k.tagName&&!!v&&0<=t.indexOf(v);if(p="NavigationProperty"===k.tagName)0===t.indexOf("Collection(")&&(t=t.replace("Collection(","").slice(0,-1)),t=t.replace(v,""),
f[t]||d(a,t,f);e.push(c.extend({iskey:l,isComplex:w,isNavigation:p,entityType:t},x))}));return e}function e(a,b,c){var d=[],e,g,h,l,v,w;for(l=0;l<a.SchemaElements.length;l++)if(a.SchemaElements[l].Name===b){e=a.SchemaElements[l].DeclaredProperties;a.SchemaElements[l].NavigationProperties&&(e=e.concat(a.SchemaElements[l].NavigationProperties));g=a.SchemaElements[l].DeclaredKey;w=a.SchemaElements[l].Namespace;break}a=g&&0<g.length?g[0].Name:"";if(e)for(c[b]=d,l=0;l<e.length;l++)b=e[l].Name,h=b===a,
g=e[l].Type.IsNullable,c=e[l].Type.Definition.Namespace+"."+e[l].Type.Definition.Name,v=!!w&&0<=c.indexOf(w),d.push({Name:b,Type:c,Nullable:g,iskey:h,isComplex:v,isNavigation:!1,entityType:c});return d}var g=this[0],h=g.p,p=c(g),b=c.extend(!0,{parsecolfunc:null,parsemetadatafunc:null,successfunc:null,errorfunc:null,entityType:null,metadataurl:h.url+"/$metadata",metadatatype:"xml",expandable:"link",async:!1},a||{});"jsonp"===b.metadatatype&&(b.callback="jsonpCallback");b.entityType?c.ajax({url:b.metadataurl,
type:"GET",dataType:b.metadatatype,jsonpCallback:b.callback,async:b.async,cache:!1}).done(function(a,g,f){function m(a){for(var d=0,e,f,g,h,k,l=[],m,d=0;d<a.length;d++)e=0<="Edm.Int16,Edm.Int32,Edm.Int64".indexOf(a[d].Type),f=0<="Edm.Decimal,Edm.Double,Edm.Single".indexOf(a[d].Type),h=0<="Edm.Byte,Edm.SByte".indexOf(a[d].Type),g=a[d].Type&&0<=a[d].Type.indexOf("Edm.")&&(0<=a[d].Type.indexOf("Date")||0<=a[d].Type.indexOf("Time")),k=a[d].isComplex?"odataComplexType":a[d].isNavigation?"odataNavigationProperty":
e?"integerStr":f?"numberStr":h?"booleanCheckbox":"text",m={integer:e,number:f,date:g,required:!a[d].Nullable||"false"===a[d].Nullable},e=e?"integer":f?"number":g?"datetime":h?"checkbox":"text",l.push(c.extend({label:a[d].Name,name:a[d].Name,index:a[d].Name,editable:!a[d].isNavigation&&!a[d].iskey,searchrules:m,editrules:m,searchtype:e,inputtype:e,edittype:e,key:a[d].iskey,odataexpand:a[d].isNavigation||a[d].isComplex?b.expandable:null,type:a[d].entityType},c.jgrid.cmTemplate[k]));return l}var k=0,
r=0,u={};"xml"!==b.metadatatype&&(a=c.jgrid.odataHelper.resolveJsonReferences(a));var l=p.triggerHandler("jqGridODataParseMetadata",a);void 0===l&&c.isFunction(b.parsemetadatafunc)&&(l=b.parsemetadatafunc(a,g,f));if(void 0===l)if(r="xml"===b.metadatatype?d(a,b.entityType,u):e(a,b.entityType,u),0===r.length)c.isFunction(b.errorfunc)&&b.errorfunc({data:a,status:g,xhr:f},"parse $metadata error");else if(l=p.triggerHandler("jqGridODataParseColumns",[r,u]),void 0===l&&c.isFunction(b.parsecolfunc)&&(l=
b.parsecolfunc([r,u])),void 0===l)for(k in l=m(r),u)u.hasOwnProperty(k)&&(u[k]=m(u[k]));if(l){for(k=0;k<h.colModel.length;k++)for(r=0;r<l.length;r++)if(l[r].name===h.colModel[k].name){c.extend(!0,l[r],h.colModel[k]);break}h.colModel=l;h.odataSubgridCols=u;c.isFunction(b.successfunc)&&b.successfunc()}else c.isFunction(b.errorfunc)&&b.errorfunc({data:a,status:g,xhr:f},"parse $metadata error")}).fail(function(a,d,e){if(c.isFunction(b.errorfunc)){var g=c.jgrid.odataHelper.loadError(a,d,e);b.errorfunc({xhr:a,
error:d,code:e},g)}}):c.isFunction(b.errorfunc)&&b.errorfunc({},"entityType cannot be empty")}})})(jQuery);
