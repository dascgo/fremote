var dsg_goto_url = {
  
  info: {
    id:           "dsg_goto_url",
    logo:         "/static/logos/firefox.png",
    name:         "Just changes the url",
    description:  "Just changes the url",
    url:          "",
    shareable:    false,
    queueable:    false, 
  },
  
  data: {},
  
  buttons: {
    
    urlinput: {
      label: "",
      style: { top: "10", left: "10", width: "297", height: "40" },
      mouseup: {
        action: function(url_string){
          tools.redirect(url_string);
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    }
    
  },
  
  screens: { 
    home: ["urlinput"]
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}