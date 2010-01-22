var dsg_math = {
  
  info: {
    id:           "dsg_math",
    logo:         "/static/logos/mathbook.png",
    name:         "The Principles of Mathematics",
    description:  "Volume 1 By Bertrand Russell",
    url:          "",
    shareable:    true,
    queueable:    false, 
  },
  
  data: {
  },
  
  buttons: {
    
    start: {
      label: "start",
      style: { top: "80", left: "60", width: "210", height: "164", color: "#aff4b2" },
      mouseup: {
        action: function(){
          tools.redirect("http://books.google.com/books?id=hh5LAAAAIAAJ&printsec=frontcover&dq=subject:%22Mathematics%22&as_brr=1&ei=RrEiS4TUIp_-ygTTo9WDCw&rview=1&cd=2#v=onepage&q=&f=true");
        },
        responses: {
          success: function(message){
            tools.draw_screen("navigation");
          },
          failure: function(message){ }
        }
      }
    },
    
    next: {
      label: "next page",
      style: { top: "10", left: "164", width: "140", height: "125" },
      mouseup: {
        action: function(){
          tools.trigger("#next_btn", "MouseEvents", "click")
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    prev: {
      label: "previous page",
      style: { top: "10", left: "10", width: "140", height: "125" },
      mouseup: {
        action: function(){
          tools.trigger("#prev_btn", "MouseEvents", "click")
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    go_to_page: {
      label: "",
      style: { top: "150", left: "10", width: "297", height: "42" },
      mousedown: {
        action: function(val){
          tools.set_value("#jtp", val)
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      },
      mouseup: {
        action: function(val){
          tools.trigger("#jtp", "KeyboardEvent", "keypress", 13)
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    hide_toolbar: {
      label: "hide tools",
      style: { top: "285", left: "10", width: "140", height: "58", color: "#828282" },
      mouseup: {
        action: function(val){
          tools.set_style("#toolbar_container|{\"display\": \"none\"}")
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    make_fullscreen: {
      label: "fullscreen",
      style: { top: "285", left: "164", width: "140", height: "58", color: "#828282" },
      mousedown: {
        action: function(val){
          tools.trigger("div.SPRITE_fullscreen_v2", "MouseEvents", "mousedown")
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      },
      mouseup: {
        action: function(val){
          tools.trigger("div.SPRITE_fullscreen_v2", "MouseEvents", "mouseup")
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    }
    
    
    
    
    
  },
  
  screens: {
    home: ["start"],
    navigation: ["next", "prev", "go_to_page", "hide_toolbar", "make_fullscreen"]
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}