/* Magic Mirror
 * Module: MMM-MARS-Weather
 *
 * By Mykle1
 *
 */
Module.register("MMM-MARS-Weather", {

    // Module config defaults.
    defaults: {
        mode: "rotating", // rotating or static
        image: "current", // animation, current, DayNight or static (phases image)
        useHeader: false, // true if you want a header
        header: "Get your to Mars!", // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 3 * 60 * 1000, // 15 minutes
        rotateInterval: 30 * 1000,

    },

    getStyles: function() {
        return ["MMM-MARS-Weather.css"];
    },

    getScripts: function() {
        return ["moment.js"];
    },

    // getTranslations: function() {
    //     return {
    //         en: "translations/en.json",
    //         fr: "translations/fr.json",
    //         es: "translations/es.json",
    //         de: "translations/de.json",
    //         sv: "translations/sv.json",
    //         nl: "translations/nl.json"
    //     };
    // },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            //  Set locale.


        this.url = "https://api.maas2.jiinxt.com/";
//        this.Lunartic = {};
        this.info = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("When the Moon hits your eye . . .");
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


            // Rotating through the data objects
            var info = this.info;
            var keys = Object.keys(this.info);
            if (keys.length > 0) {
                if (this.activeItem >= keys.length) {
                    this.activeItem = 0;
                    //                    console.log(this.activeItem); // for checking
                }
                var info = info[info[this.activeItem]];


                if (this.activeItem == 0) {
                    // Mars sol date
                    var sol = document.createElement("div");
                    sol.classList.add("xsmall", "bright", "solDate");
                    sol.innerHTML = this.translate("Mars Sol date is ") + this.info[0].sol;
                    wrapper.appendChild(sol);
                }

                if (this.activeItem == 1) {
                  // season
                      var season = document.createElement("div");
                      season.classList.add("xsmall", "bright", "season");
                  if (this.info[1].season == "Month 10" || this.info[1].season == "Month 11" || this.this.info[1].season == "Month 12"){
                      season.innerHTML = "Summer at rover location, " + this.info[1].season;
                    } else if
                      (this.info[1].season == "Month 1" || this.info[1].season == "Month 2" || this.this.info[1].season == "Month 3"){
                      season.innerHTML = "Autumn at rover location, " + this.info[1].season;
                    } else if
                      (this.info[1].season == "Month 4" || this.info[1].season == "Month 5" || this.this.info[1].season == "Month 6"){
                      season.innerHTML = "Winter at rover location, " + this.info[1].season;
                    } else if
                      (this.info[1].season == "Month 7" || this.info[1].season == "Month 8" || this.this.info[1].season == "Month 9"){
                      season.innerHTML = "Spring at rover location, " + this.info[1].season;
                    }
                      wrapper.appendChild(season);
                }

                if (this.activeItem == 2) {
                  // minimum air temperature
                  var min_temp = document.createElement("div");
                  min_temp.classList.add("xsmall", "bright", "minAirTemp");
                  min_temp.innerHTML = "Min air temp is " + this.info[2].minAirTemp + "° C";
                  wrapper.appendChild(min_temp);
          }

                if (this.activeItem == 3) {
                  // max air temp
                  var max_temp = document.createElement("div");
                  max_temp.classList.add("xsmall", "bright", "maxAirTemp");
                  max_temp.innerHTML = "Max air temp is " + this.info[3].maxAirTemp + "° C";
                  wrapper.appendChild(max_temp);
                }

                if (this.activeItem == 4) {
                  // atmosphetic conditions (Sunny etc.)
                  var atmo = document.createElement("div");
                  atmo.classList.add("xsmall", "bright", "weather");
                  atmo.innerHTML = this.info[4].weather + " weather conditions";
                  wrapper.appendChild(atmo);
                }

                if (this.activeItem == 5) {
                  // min_gts_temp
                  var min_gts_temp = document.createElement("div");
                  min_gts_temp.classList.add("xsmall", "bright", "minGroundTemp");
                  min_gts_temp.innerHTML = "Min ground temp is " + this.info[5].minGroundTemp + "° C";
                  wrapper.appendChild(min_gts_temp);
                }

                if (this.activeItem == 6) {
                  // max_temp
                  var max_temp = document.createElement("div");
                  max_temp.classList.add("xsmall", "bright", "maxGroundTemp");
                  max_temp.innerHTML = "Max ground temp is " + this.info[6].maxGroundTemp + "° C";
                  wrapper.appendChild(max_temp);
               }

               if (this.activeItem == 7) {
                 // sunrise
                 var max_temp = document.createElement("div");
                 max_temp.classList.add("xsmall", "bright", "sunrise");
                 max_temp.innerHTML = "Sunrise at rover is " + this.info[7].sunrise;
                 wrapper.appendChild(max_temp);
              }

              if (this.activeItem == 8) {
                // sunset
                var max_temp = document.createElement("div");
                max_temp.classList.add("xsmall", "bright", "sunset");
                max_temp.innerHTML = "Sunset at rover is " + this.info[8].sunset;
                wrapper.appendChild(max_temp);
             }

           } // End of object loop

        return wrapper;
    }, // Close getDom


    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_MARS_WEATHER') {
            this.hide(1000);
            //    this.updateDom(300);
        } else if (notification === 'SHOW_MARS WEATHER') {
            this.show(1000);
            //   this.updateDom(300);
        }

    },


    processMARS: function(data) {
        this.info = data;
  //      console.log(this.info); // for checking
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of MARS-Weather");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getMARS();
        }, this.config.updateInterval);
        this.getMARS(this.config.initialLoadDelay);
        var self = this;
    },

    getMARS: function() {
        this.sendSocketNotification('GET_MARS'); // , this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MARS_RESULT") {
            this.processMARS(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
