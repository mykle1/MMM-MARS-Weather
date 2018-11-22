/* Magic Mirror
 * Module: MMM-MARS-Weather
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },


    getMARS: function(url) {
        var self = this;
        var data =[];
        request({
            url: "https://api.maas2.jiinxt.com/",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
      //          console.log(info); // for checking

                // create empty array to store your objects in
                var data = [];
                // set variables
                var sol  =  info.sol;
                var season  =  info.season;
                var minAirTemp  = info.min_temp;
                var maxAirTemp  = info.max_temp;
                var weather  = info.atmo_opacity;
                var minGroundTemp  = info.min_gts_temp;
                var maxGroundTemp  = info.max_gts_temp;
                var sunrise = info.sunrise;
                var sunset = info.sunset;

                // Convert each variable into an object so they can be put into a rotation courtesy of @cows and chickens (create each object).
                sol  =  {sol};
                season = {season};
                minAirTemp = {minAirTemp};
                maxAirTemp = {maxAirTemp};
                weather = {weather};
                minGroundTemp = {minGroundTemp};
                maxGroundTemp = {maxGroundTemp};
                sunrise = {sunrise};
                sunset = {sunset};

                data.push(sol,season,minAirTemp,maxAirTemp,weather,minGroundTemp,maxGroundTemp,sunrise,sunset); // push the objects into the array
          //      console.log(response.statusCode + data); // for checking
                this.sendSocketNotification('MARS_RESULT', data);
            }
        });
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_MARS') {
            this.getMARS(payload);
        }
    }
});
