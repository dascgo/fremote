var dsg_googlesearch = {
  
  info: {
    id:           "dsg_googlesearch",
    logo:         "/static/logos/google.png",
    name:         "Google Search",
    description:  "Just an example remote",
    url:          "",
    shareable:    true,
    queueable:    false, 
  },
  
  data: {
    
  },
  
  buttons: {
    
    search: {
      label: "",
      style: { top: "10", left: "10", width: "297", height: "40" },
      mouseup: {
        action: function(query){
          tools.redirect("http://google.com/search?q=" + query);
        },
        responses: {
          success: function(message){
            setTimeout("tools.collect('#res > div > ol > li')", 1000);
            tools.draw_screen("results");
          },
          failure: function(message){
            alert("the search did not load!");
          }
        }
      }
    },
    
    prev_result: {
      label: "Previous Result",
      style: { top: "63", left: "10", width: "297", height: "80" },
      mouseup: {
        action: function(){
          tools.collect_previous();
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    next_result: {
      label: "Next Result",
      style: { top: "155", left: "10", width: "297", height: "80" },
      mouseup: {
        action: function(){
          tools.collect_next();
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    go_to_page: {
      label: "Go to Page",
      style: { top: "246", left: "10", width: "297", height: "42", backgroundColor: "green" },
      mouseup: {
        action: function(){
          tools.trigger("#fremote_collection_viewer>div>h3>a", "MouseEvents", "click");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    next_page: {
      label: "Previous Set",
      style: { top: "300", left: "10", width: "140", height: "42" },
      mouseup: {
        action: function(){
          tools.trigger("#nav>tbody>tr>td:first-child>a", "MouseEvents", "click");
        },
        responses: {
          success: function(message){
            setTimeout("tools.collect('#res > div > ol > li')", 1000);
          },
          failure: function(message){ }
        }
      }
    },
    
    prev_page: {
      label: "Next Set",
      style: { top: "300", left: "164", width: "140", height: "42" },
      mouseup: {
        action: function(){
          tools.trigger("#nav>tbody>tr>td:last-child>a", "MouseEvents", "click");
        },
        responses: {
          success: function(message){
            setTimeout("tools.collect('#res > div > ol > li')", 1000);
          },
          failure: function(message){ }
        }
      }
    }
    
  },
  
  screens: {
    home: ["search"],
    results: ["search", "prev_result", "next_result", "go_to_page", "next_page", "prev_page"]
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}