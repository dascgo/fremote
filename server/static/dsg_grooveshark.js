var dsg_grooveshark = {
  
  info: {
    id:           "dsg_grooveshark",
    logo:         "/static/logos/grooveshark.png",
    name:         "Grooveshark Controls",
    description:  "Control Grooveshark without getting up",
    url:          "",
    shareable:    true,
    queueable:    false, 
  },
  
  buttons: {
    
    play: {
      label: "Play/Pause",
      style: { top: "10", left: "15", width: "289", height: "189", color: "#a0c9f4" },
      mouseup: {
        action: function(query){
          tools.flash("gsliteswf","togglePlayback");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    next: {
      label: "Next Song",
      style: { top: "218", left: "168", width: "134", height: "80", color: "#a0c9f4" },
      mouseup: {
        action: function(){
          tools.flash("gsliteswf","next");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    previous: {
      label: "Prev Song",
      style: { top: "218", left: "15", width: "134", height: "80", color: "#a0c9f4" },
      mouseup: {
        action: function(){
          tools.flash("gsliteswf","previous");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
  },
  
  screens: {
    home: ["play", "next", "previous"],
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}