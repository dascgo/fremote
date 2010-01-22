var dsg_googledocs = {
  
  info: {
    id:           "dsg_googledocs",
    logo:         "/static/logos/googledocs.png",
    name:         "Presentation Viewer",
    description:  "Control and Share Presentations from Google Docs",
    url:          "",
    shareable:    true,
    queueable:    true, 
  },
  
  buttons: {
    
    presentations: {
      label: [
        ["pres1", "http://docs.google.com/present/view?id=dfzbxv77_12dpcdh2dc"],
        ["pres2", "http://docs.google.com/present/view?id=dfzbxv77_12424mt9gk"]
      ],
      style: { top: "10", left: "10", width: "297", height: "330" },
      mouseup: {
        action: function(presentation_url){
          tools.redirect(presentation_url);
        },
        responses: {
          success: function(message){
            tools.draw_screen("presentation");
          },
          failure: function(message){
            alert("the presentation did not load!");
          }
        }
      }
    },
    
    next: {
      label: "next",
      style: { top: "10", left: "10", width: "287", height: "166", color: "#aff4b2" },
      mouseup: {
        action: function(){
          tools.trigger("#ToolbarNext", "MouseEvents", "mousedown");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    previous: {
      label: "prev",
      style: { top: "198", left: "10", width: "150", height: "80" },
      mouseup: {
        action: function(){
          tools.trigger("#ToolbarPrev", "MouseEvents", "mousedown");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    end: {
      label: "end presentation",
      style: { top: "198", left: "182", width: "117", height: "80", color: "#de9797" },
      mouseup: {
        action: function(){
          tools.draw_screen("home");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    }
  },
  
  screens: {
    home: ["presentations"],
    presentation: ["next", "previous", "end"]
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}