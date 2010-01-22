var fremote = {
  on: false,
  vars: {
    user: {
      username: "",
      password: ""
    },
    page: {
      url: false
    },
    collection: {
      data: [],
      step: 0
    }
  },
  timers: {
    change: false
  },
  startup: {
    init: function(){
      if(fremote.on){
        fremote.startup.turn_off()
      }else{
        fremote.startup.turn_on()
      }
    },
    turn_on: function(){
      fremote.on = true;
      $("#fremote-toolbar").attr("hidden", "false");
      $("#nav-bar").attr("hidden", "true");
      $("#status-bar").attr("hidden", "true");
      fremote.startup.check_user()
      fremote.vars.page.url = content.document.location.href + ""
      fremote.timers.change = setInterval("fremote.startup.check_for_page_change()", 2000)
      fremote.updater.poll()
    },
    turn_off: function(){
      clearInterval(fremote.timers.change);
      fremote.on = false;
      $("#fremote-toolbar").attr("hidden", "true");
      $("#nav-bar").attr("hidden", "false");
      $("#status-bar").attr("hidden", "false");
    },
    check_user: function(){
      if(fremote.vars.user.username == ""){
        fremote.tools.logger("need to look up the user")
      }
    },
    check_for_page_change: function(){
      var current_page = content.document.location.href + ""
      if(current_page != fremote.vars.page.url){
        // do whatever else is needed when the page changes...
        fremote.vars.page.url = current_page
      }
    }
  },
  tools: {
    getNextHighestZindex: function(obj){
      var highestIndex = 0;
      var currentIndex = 0;
      var elArray = Array();
      if(obj){ elArray = obj.getElementsByTagName('*'); }else{ elArray = content.document.getElementsByTagName('*'); }
      for(var i=0; i < elArray.length; i++){
        if(elArray[i].currentStyle){
          currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);
        }else if(window.getComputedStyle){
          currentIndex = parseFloat(content.document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));
        }
        if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }
      }
      return(highestIndex+1);
    },
    logger: function(msg) {
      Components.utils.reportError("fremote: " + msg);
    },
    prettyDate: function(time){
      /*
       * JavaScript Pretty Date
       * Copyright (c) 2008 John Resig (jquery.com)
       * Licensed under the MIT license.
       */
      // Takes an ISO time and returns a string representing how
      // long ago the date represents.
      var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    		diff = (((new Date()).getTime() - date.getTime()) / 1000),
    		day_diff = Math.floor(diff / 86400);
    	if ( isNaN(day_diff) || day_diff >= 31 ) return;
    	return day_diff == 0 && (
    			diff < 60 && "just now" ||
    			diff < 120 && "1 minute ago" ||
    			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
    			diff < 7200 && "1 hour ago" ||
    			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    		day_diff == 1 && "yesterday" || 
    		day_diff < 0 && "just now" ||
    		day_diff < 7 && day_diff + " days ago" ||
    		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
    },
  },
  comm: {
    postJSON: function(url, args, callback){
      $.ajax({
        url:      url, 
        data:     $.param(args), 
        dataType: "text", 
        type:     "POST", 
        success: function(response){
          if (callback) callback(eval("(" + response + ")"));
        },
        error: function(response){
          console.log("ERROR:", response)
        }
      });
    },
    received: function(event){
      if(event.originalTarget instanceof HTMLDocument){
        var doc = event.originalTarget;
        doc.addEventListener("CollectaEvent", dsgc.comm.handler, false, true);
      }
    },
    handler: function(e){
      msg = e.target.getAttribute("application_state");
      msg = msg.split("|");
      if(msg[0] == "func"){         eval(msg[1]);}
      if(msg[0] == "newterm"){      dsgc.tags.add(msg[1], "dsgc_tag_throwaway_container");}
      if(msg[0] == "removeterm"){   remove_from_terms(msg[1]);}
      if(msg[0] == "lockterm"){     remove_from_terms(msg[1]);}
      if(msg[0] == "manualterm"){   dsgc.tags.add(content.document.getElementById(msg[1]).value, "dsgc_tag_throwaway_container");}
    }
  },
  updater: {
    errorSleepTime: 500,
    cursor: null,
    poll: function() {
      $.ajax({
        url: "http://localhost:8888/a/message/updates", 
        type: "POST", 
        dataType: "text",
        data: $.param({}),
        success: fremote.updater.onSuccess,
        error: fremote.updater.onError
      });
    },
    onSuccess: function(response) {
      try{
        fremote.updater.newMessages(eval("(" + response + ")"));
      }catch(e){
        fremote.updater.onError();
        return;
      }
      fremote.updater.errorSleepTime = 500;
      window.setTimeout(fremote.updater.poll, 0);
    },
    onError: function(response) {
      fremote.updater.errorSleepTime *= 2;
      fremote.tools.logger("Poll error; sleeping for " + fremote.updater.errorSleepTime + "ms");
      window.setTimeout(fremote.updater.poll, fremote.updater.errorSleepTime);
    },
    newMessages: function(response) {
      if (!response.messages) return;
      fremote.updater.cursor = response.cursor;
      var messages = response.messages;
      fremote.updater.cursor = messages[messages.length - 1].id;
      fremote.tools.logger(messages.length + " new messages, cursor: " + fremote.updater.cursor);
      for (var i = 0; i < messages.length; i++) {
        fremote.updater.showMessage(messages[i]);
        fremote.updater.runMessage(messages[i]);
      }
    },
    showMessage: function(message) {
      fremote.tools.logger(message)
      // var existing = $("#m" + message.id);
      // if (existing.length > 0) return;
      // var node = $(message.html);
      // node.hide();
      // $("#inbox").append(node);
      // node.slideDown();
    },
    runMessage: function(message){
      message = message.split("**");
      command = message[0];
      values = message[1];
      fremote.tools.logger("command = " + command + " and values = " + values)
      if(command != "success"){
        fremote.commands[command](values);
      }
    }
  },
  commands: {
    completed: function(result){
      fremote.comm.postJSON("http://localhost:8888/a/message/new", {"message": result});
    },
    redirect: function(location){
      try{
        content.document.location.href = location;
        document.addEventListener("DOMContentLoaded", function(){
          fremote.commands.completed("success")
        }, false);
      }catch(e){ 
        fremote.commands.completed("failure")
      }
    },
    set_value: function(data){
      data = data.split("|")
      var selector = data[0],
          value = data[1]
      content.document.querySelector(selector).value = value;
    },
    trigger: function(data){
      try{
        data = data.split("|")
        var selector = data[0],
            event_kind = data[1],
            event_type = data[2]
        if(data[3]){
          keycode = data[3]
        }
        var evt = content.document.createEvent(event_kind),
            elm = content.document.querySelector(selector);
        if(event_kind == "MouseEvents"){
          evt.initMouseEvent(event_type, true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        if(event_kind == "KeyboardEvent"){
          evt.initKeyEvent(event_type, true, true, null, false, false, false, false, keycode, 0);
        }
        elm.dispatchEvent(evt);
        fremote.commands.completed("success")
      }catch(e){ 
        fremote.commands.completed("failure")
      }
    },
    flash: function(command){
      try{
        command = command.split("?")
        var flash = command[0]
        var action = command[1]
        var script = content.document.createElement("script")
        script.innerHTML = "document." + flash + "." + action + "()"
        content.document.getElementsByTagName("head")[0].appendChild(script)
      }catch(e){ 
        fremote.commands.completed("failure");
      }
    },
    collect_next: function(){
      try{
        var div = content.document.getElementById("fremote_collection_viewer")
        fremote.vars.collection.step = fremote.vars.collection.step + 1
        if(fremote.vars.collection.step >= fremote.vars.collection.data.length){
          fremote.vars.collection.step = 0
        }
        div.innerHTML = "<div style='background-color:#fff;width:80%;padding:15px;margin:0 auto;'>" + 
                          fremote.vars.collection.data[fremote.vars.collection.step] + 
                          "<hr>" + 
                          "<div>showing " + (fremote.vars.collection.step + 1) + " of " + fremote.vars.collection.data.length + "</div>" + 
                        "</div>"
        fremote.commands.completed("success")
      }catch(e){ 
        fremote.commands.completed("failure")
      }
    },
    collect_prev: function(){
      try{
        var div = content.document.getElementById("fremote_collection_viewer")
        fremote.vars.collection.step = fremote.vars.collection.step - 1
        if(fremote.vars.collection.step < 0){
          fremote.vars.collection.step = fremote.vars.collection.data.length - 1
        }
        div.innerHTML = "<div style='background-color:#fff;width:80%;padding:15px;margin:0 auto;'>" + 
                          fremote.vars.collection.data[fremote.vars.collection.step] + 
                          "<hr>" + 
                          "<div>showing " + (fremote.vars.collection.step + 1) + " of " + fremote.vars.collection.data.length + "</div>" + 
                        "</div>"
        fremote.commands.completed("success")
      }catch(e){ 
        fremote.commands.completed("failure")
      }
    },
    collect: function(selector){
      try{
        fremote.vars.collection.data = []
        fremote.vars.collection.step = 0
        elms = $(selector, content.document);
        elms.each(function(i){
          fremote.vars.collection.data.push(this.innerHTML)
        });
        // disable scrolling
        content.document.body.style.overflow = "hidden"
        var w = parseInt(window.innerWidth);
        var h = parseInt(window.innerHeight);
        // Create overlay element
        var div = content.document.createElement("div")
        div.style.backgroundColor = "#000"
        div.style.opacity = ".8"
        div.style.width = w + "px"
        div.style.height = h + "px"
        div.style.position = "absolute"
        div.style.top = "0"
        div.style.left = "0" 
        content.document.body.appendChild(div)
        // Create container element
        var div = content.document.createElement("div")
        div.id = "fremote_collection_container"
        div.style.width = "100%"
        div.style.height = "100%"
        div.style.position = "absolute"
        div.style.top = "0"
        div.style.left = "0"
        div.style.display = "table"
        content.document.body.appendChild(div)
        // create popup window
        var div = content.document.createElement("div")
        div.id = "fremote_collection_viewer"
        div.style.width = "80%"
        div.style.height = "auto"
        div.style.padding = "10px"
        div.style.display = "table-cell"
        div.style.verticalAlign = "middle"
        div.style.fontSize = "200%"
        var container = content.document.getElementById("fremote_collection_container")
        container.appendChild(div)
        fremote.vars.collection.step = fremote.vars.collection.data.length
        fremote.commands.collect_next()
        // show first item in the collection in the popup
        // show (1 of 10) or something similar
        // fremote.commands.completed("success")
      }catch(e){ 
        fremote.commands.completed("failure")
      }
    },
    fullscreen: function(selector){
      // get the element
      var elm = content.document.querySelector(selector);
      elm.width = "100%"
      elm.style.width = "100%"
      elm.height = "100%"
      elm.style.height = "100%"
      // disable scrolling
      content.document.body.style.overflow = "hidden"
      // Create container element
      var div = content.document.createElement("div")
      div.id = "fremote_fullscreen_container"
      div.style.width = "100%"
      div.style.height = "100%"
      div.style.position = "absolute"
      div.style.top = "0"
      div.style.left = "0"
      div.style.display = "table"
      content.document.body.appendChild(div)
      content.document.getElementById("fremote_fullscreen_container").appendChild(elm.parentNode.removeChild(elm));
    },
    set_styles: function(styles){
      var data        = styles.split("|")
      var selector    = data[0]
      var elm         = content.document.querySelector(selector);
      var styles      = JSON.parse(data[1])
      for(var i in styles){
        elm.style[i] = styles[i]
      }
    }
  }
}
//--------------------------------------------------------------------------
function getCookie(name) {
  var r = content.document.cookie.match("\\b" + name + "=([^;]*)\\b");
  return r ? r[1] : undefined;
}