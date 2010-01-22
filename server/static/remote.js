var self = false;
var debug = false;

function newMessage(form){
  //alert("newMessage is going to postJSON: " + form)
  $("#loading").fadeIn()
  $.postJSON("/a/message/new", {"message": form});
}

function getCookie(name){
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

jQuery.postJSON = function(url, args, callback){
  args._xsrf = getCookie("_xsrf");
  $.ajax({
    url: url, 
    data: $.param(args), 
    dataType: "text", 
    type: "POST",
    success: function(response) {
      if (callback) callback(eval("(" + response + ")"));
    },
    error: function( ) {
      tools.trace("ERROR: " + response)
    }
  });
};

jQuery.fn.formToDict = function(){
  var fields = this.serializeArray();
  var json = {}
  for (var i = 0; i < fields.length; i++) {
    json[fields[i].name] = fields[i].value;
  }
  if (json.next) delete json.next;
  return json;
};

var updater = {
  errorSleepTime: 500,
  cursor: null,

  poll: function(){
    var args = {"_xsrf": getCookie("_xsrf")};
    if (updater.cursor) args.cursor = updater.cursor;
    $.ajax({url: "/a/message/updates", type: "POST", dataType: "text",
      data: $.param(args),
      success: updater.onSuccess,
      error: updater.onError
    });
  },

  onSuccess: function(response){
    try {
      updater.newMessages(eval("(" + response + ")"));
    } catch (e) {
      updater.onError();
      return;
    }
    updater.errorSleepTime = 500;
    window.setTimeout(updater.poll, 0);
  },

  onError: function(response){
    updater.errorSleepTime *= 2;
    tools.trace("Poll error; sleeping for " + updater.errorSleepTime + " ms");
    window.setTimeout(updater.poll, updater.errorSleepTime);
  },

  newMessages: function(response){
    if (!response.messages) return;
    updater.cursor = response.cursor;
    var messages = response.messages;
    updater.cursor = messages[messages.length - 1].id;
    for (var i = 0; i < messages.length; i++) {
      updater.showMessage(messages[i]);
    }
  },

  showMessage: function(message){
    tools.trace("showMessage = " + message);
    message = message.split("**")
    if(message.length == 1){
      tools.callbacks.handle(message[0], message[1])
    }
  }
};


// This represent the built in tools for building a remote
var tools = {
  
  remote:       false,
  remote_list:  [],
  last_btn:     false,
  last_state:   false,
  
  init: function(remotes){
    for(var i=0,len=remotes.length; i<len; i++){
      var r = window[remotes[i]]
      tools.remote_list.push("<li onclick='tools.load(\"" + remotes[i] + "\")'>");
      tools.remote_list.push("  <div class='menu_icon'>");
      tools.remote_list.push("    <img src='" + r.info.logo + "' width='32' height='32'>");
      tools.remote_list.push("  </div>");
      tools.remote_list.push("  <div class='menu_content'>");
      tools.remote_list.push("    <p class='title'>" + r.info.name + "</p>");
      tools.remote_list.push("    <p class='info'>" + r.info.description + "</p>");
      tools.remote_list.push("  </div>");
      tools.remote_list.push("  <br style='clear:both;'>");
      tools.remote_list.push("</li>");
    }
    tools.setup()
    if(debug) $("#debugger").show();
  },
  
  setup: function(){
    $("#screen_info").empty().html(tools.info_html());
    $("#screen_area").empty();
    $("#home").fadeOut();
    $("#screen_area").append("<ul class='remote_list'>" + tools.remote_list.join("") + "</ul>");
  },
  
  info_html: function(){
    return '<table cellpadding="0" cellspacing="0" border="0" width="100%">' + 
           '  <tr>' + 
           '    <td width="45" height="45" valign="center">' + 
           '      <img id="logo" src="/static/fr_logo.png" width="45" height="45">' + 
           '    </td>' + 
           '    <td width="*" height="45" align="right" valign="center">' + 
           '      <img onclick="alert(\'Find public remotes to install. Not yet implemented.\')" src="/static/btn_get_remotes.png" width="32" height="32">' + 
           //'      <img onclick="alert(\'Find public broadcasts to follow. Not yet implemented.\')" src="/static/btn_get_broadcast.png" width="32" height="32" style="padding-left:5px;">' + 
           '      <img onclick="alert(\'Shows remote preferences, like background, etc.\')" src="/static/btn_preferences.png" width="32" height="32" style="padding-left:5px;">' + 
           '    </td>' +
           '  </tr>' + 
           '</table>'
  },
  
  load: function(remote){
    $("#screen_info").empty();
    $("#screen_area").empty();
    $("#home").fadeIn();
    tools.remote = window[remote];
    self = window[remote]
    window[remote].init();
  },
  
  responses: {
    success: function(message){ console.log(message); },
    failure: function(message){ console.log(message); }
  },
  
  callbacks: {
    handle: function(response, message){
      tools.trace(response + " : " + message)
      if(tools.last_btn){
        try{ 
          // Try to let their program handle the success message
          tools.remote.buttons[tools.last_btn][tools.last_state].responses[response](message);
        }catch(e){
          // Otherwise, we handle it
          tools.responses[response](message);
        }finally{
          $("#loading").fadeOut()
          tools.last_btn = false;
          tools.last_state = false;
        }
      }
    }
  },
  
  trace: function(message){
    if(debug){ 
      timestamp = new Date()
      $("#debugger").html(timestamp + " - " + message); 
    }
  },
  
  setup_remote: function(){
    $("#screen_info").append(
      "<div class='icon'>" + 
        "<img src='" + tools.remote.info.logo + "' width='42' height='42'>" + 
      "</div>" + 
      "<div style='margin-left:10px;'>" + 
        "<p class='title'>" + tools.remote.info.name + "</p>" + 
        "<p class='info'>" + tools.remote.info.description + "</p>" + 
      "</div>" + 
      "<br class='clear'/>"
    )
  },
  
  draw_screen: function(screen_set){
    $("#screen_area").empty();
    screen_set = tools.remote.screens[screen_set];
    for(var i=0,len=screen_set.length; i<len; i++){
      tools.draw_button(screen_set[i]);
    }
  },
  
  draw_button: function(button){
    var btn = tools.remote.buttons[button];
    var elm = document.createElement("div");
        elm.style.top = btn.style.top + "px"
        elm.style.left = btn.style.left + "px"
    var w = (btn.style.width) ? btn.style.width : "auto"
    var h = (btn.style.height) ? btn.style.height : "auto"
    var c = (btn.style.color) ? btn.style.color : "#ccc"
        
        
    if(typeof(btn.label) == "string"){
      
      if(btn.label == ""){
        
        // This is a search button
        var html = ''
            html += '<div class="outline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
            html += '<div class="inline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
            html += '<div class="background" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;background-color:' + c + '"></div>'
            html += '<div class="raised" style="width:' + ( w - 8 ) + 'px;height:' + ( h - 8 ) + 'px;"></div>'
            html += '<div class="overlay" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;"><img src="/static/button_overlay.png" width="' + ( w - 4 ) + '" height="' + ( h - 4 ) + '"></div>'
            html += '<div class="text" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;">'
            html += '<div>'
            html += '<input class="input input_field" type="text" id="' + button + '_input_field" style="width:' + ( w - 102 ) + 'px;height:' + ( h - 17 ) + 'px;">'
            html += '<input class="input input_submit" type="button" value="submit" onmousedown="tools.input_submit_down(\'' + button + '\')" onmouseup="tools.input_submit_up(\'' + button + '\')" style="width:80px;height:' + ( h - 13 ) + 'px;">'
            html += '</div>'
            html += '</div>'
        elm.innerHTML = html;
        
      }else{
        
        // This is a regular button
        if(btn.mousedown){
          elm.addEventListener("mousedown", function(e){ 
            tools.set_last_button(button, "mousedown");
            btn.mousedown.action();
          }, false);
        }
        if(btn.mouseup){
          elm.addEventListener("mouseup", function(e){ 
            tools.set_last_button(button, "mouseup");
            btn.mouseup.action();
          }, false);
        }
        var html = ''
            html += '<div class="outline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
            html += '<div class="inline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
            html += '<div class="background" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;background-color:' + c + '"></div>'
            html += '<div class="raised" style="width:' + ( w - 8 ) + 'px;height:' + ( h - 8 ) + 'px;"></div>'
            html += '<div class="text" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;"><div>' + btn.label + '</div></div>'
            html += '<div class="overlay" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;"><img src="/static/button_overlay.png" width="' + ( w - 4 ) + '" height="' + ( h - 4 ) + '"></div>'
        elm.innerHTML = html;
        
      }
      
      elm.className = "button";
      $("#screen_area").append(elm);
      
    }else{
      
      // This is a list of items
      var html = ''
          html += '<div class="outline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
          html += '<div class="inline" style="width:' + w + 'px;height:' + h + 'px;"></div>'
          html += '<div class="background" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;background-color:' + c + '"></div>'
          html += '<div class="raised" style="width:' + ( w - 8 ) + 'px;height:' + ( h - 8 ) + 'px;"></div>'
          html += '<div class="overlay" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;"><img src="/static/button_overlay.png" width="' + ( w - 4 ) + '" height="' + ( h - 4 ) + '"></div>'
          html += '<div class="text" style="width:' + ( w - 4 ) + 'px;height:' + ( h - 4 ) + 'px;"><ul id="list_container"></ul></div>'
          
      elm.innerHTML = html;
      
      elm.className = "button";
      $("#screen_area").append(elm);
      
      container = document.getElementById("list_container");
      for(var labels=0,len=btn.label.length; labels<len; labels++){
        var title   = btn.label[labels][0];
        var action  = btn.label[labels][1];
        var item    = document.createElement("li");
        item.addEventListener("mouseup", function(e){ 
          tools.set_last_button(this.getAttribute("data-button"), "mouseup");
          btn.mouseup.action(this.getAttribute("data-action"));
        }, false);
        item.setAttribute("data-action", action)
        item.setAttribute("data-button", button)
        item.innerHTML = title;
        item.className = "item";
        container.appendChild(item);
      }
      
      
    
    }
    
  },
  
  set_last_button: function(btn, state){
    tools.last_btn = btn;
    tools.last_state = state;
  },
  
  input_submit_down: function(button){
    btn = tools.remote.buttons[button];
    if(btn.mousedown){
      tools.set_last_button(button, "mousedown");
      btn.mousedown.action(document.getElementById(button + "_input_field").value);
    }
  },
  
  input_submit_up: function(button){
    btn = tools.remote.buttons[button];
    if(btn.mouseup){
      tools.set_last_button(button, "mouseup");
      btn.mouseup.action(document.getElementById(button + "_input_field").value);
    }
  },
  
  // ------------------------------------------------------
  // These functions need to send data to the add-on
  // The add-on needs to send back "success" or "failure"
  // The code here needs to accep the result and process
  // ------------------------------------------------------
  
  flash: function(flash, command){
    // function for redirecting to a page
    // needs to pass the url to the add-on
    newMessage("flash**" + flash+"?"+command)
    //newMessage(location)
    //console.log(location);
    //tools.callbacks.handle(true, "the redirect worked");
  },
  
  redirect: function(location){
    // function for redirecting to a page
    // needs to pass the url to the add-on
    newMessage("redirect**" + location)
    //newMessage(location)
    //console.log(location);
    //tools.callbacks.handle(true, "the redirect worked");
  },
  
  trigger: function(id, evt, evt_type, key){
    // function for triggering a click on an element
    // needs to pass the element to the add-on
    a = "trigger**" +  id + "|" + evt + "|" + evt_type
    if(key){
      a += "|" + key
    }
    newMessage(a)
    //console.log(id);
    //tools.callbacks.handle(true, "the element was clicked on");
  },
  
  collect: function(selector){
    // function for triggering a click on an element
    // needs to pass the element to the add-on
    newMessage("collect**" +  selector)
    //console.log(id);
    //tools.callbacks.handle(true, "the element was clicked on");
  },
  
  collect_next: function(){
    // function for triggering a click on an element
    // needs to pass the element to the add-on
    newMessage("collect_next")
    //console.log(id);
    //tools.callbacks.handle(true, "the element was clicked on");
  },
  
  collect_previous: function(){
    // function for triggering a click on an element
    // needs to pass the element to the add-on
    newMessage("collect_prev")
    //console.log(id);
    //tools.callbacks.handle(true, "the element was clicked on");
  },
  
  gallery: function(ids){
    // function for collecting a group of ids and displaying
    // them in a gallery like fashion
    newMessage({"gallery": ids})
    // console.log(ids);
    // tools.callbacks.handle(true, "the gallery was created");
  },
  
  fullscreen: function(selector){
    newMessage("fullscreen**" + selector)
  },
  
  set_style: function(styles){
    newMessage("set_styles**" + styles)
  },
  
  set_value: function(selector, value){
    newMessage("set_value**" +  selector + "|" + value)
  }
  
}