var dsg_nickjr_games = {
  
  info: {
    id:           "dsg_nickjr_games",
    logo:         "/static/logos/nick.png",
    name:         "Nick Jr. Games",
    description:  "Focus on the games...",
    url:          "",
    shareable:    true,
    queueable:    false, 
  },
  
  buttons: {
    
    games: {
      label: [
        ["Dora Saves the Crystal Kingdom", "http://www.nickjr.com/playtime/cats/games/all_games/dora_crystalkingdom.jhtml?="],
        ["Diego's Snowboard Rescue", "http://www.nickjr.com/playtime/shows/diego/games/dieg_snowboard.jhtml"],
        ["Wubbzy's Amazing Adventure", "http://www.nickjr.com/playtime/shows/wubb/games/wubb_amazing_adv.jhtml"],
        ["Yo Gabba Gabba: Magic Word Adventure", "http://www.nickjr.com/playtime/shows/yoga/games/yoga_magic_word.jhtml"],
        ["Max & Ruby: Where's Max?", "http://www.nickjr.com/playtime/shows/max_ruby/games/maxr_wheresmax.jhtml"]
      ],
      style: { top: "10", left: "10", width: "297", height: "330" },
      mouseup: {
        action: function(presentation_url){
          tools.redirect(presentation_url);
        },
        responses: {
          success: function(message){
            tools.draw_screen("play");
          },
          failure: function(message){
            alert("the game did not load!");
          }
        }
      }
    },
    
    play: {
      label: "play",
      style: { top: "10", left: "10", width: "297", height: "160", color: "#aff4b2" },
      mouseup: {
        action: function(){
          tools.fullscreen("#flash_game");
        },
        responses: {
          success: function(message){ },
          failure: function(message){ }
        }
      }
    },
    
    stop: {
      label: "stop",
      style: { top: "180", left: "10", width: "297", height: "160", color: "#de9797" },
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
    home: ["games"],
    play: ["play", "stop"]
  },
  
  init: function(){
    tools.setup_remote();
    tools.draw_screen("home");
  }
  
}