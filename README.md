# sports-standings
Sports Standings website

*{website link tbd}*


## About:
Sports standings website with real-time data for the most popular leagues.


## Approach:
This website utilizes [MySportsFeeds](https://www.mysportsfeeds.com/) data API, and incorporates their provided [NodeJS wrapper](https://github.com/MySportsFeeds/mysportsfeeds-node) in "data.js".
ExpressJS framework is used to deploy the web application from the static web files located in "public/" directory.
Socket.IO library is used to seamlessly communicate between the client and server. In this case, transferring the returned data from the server-side API request to the client-side to manipulate in "public/app.js".


## General guide to implement this repo into your own application:

1. Get an API key from MySportsFeeds, and store it in a separate "config.js" file in the root directory. The ".gitignore" file currently doesn't track this file so that my API key is hidden when pushing to GitHub. It is also not tracking "result/" directory which is a directory that is created by default to store the returned API data, and so I didn't want these directories to get pushed to GitHub either.

2. Update the value for "APIkey" variable in "index.js" so that it references to your hidden API key variable, or object property, etc, stored in "config.js".

3. Appropriately update the getData function(s) in "data.js" and their export modules calling the function(s) in "index.js" so that they store your requested response data accordingly.  
   Check out [MySportsFeeds NodeJS wrapper](https://github.com/MySportsFeeds/mysportsfeeds-node) for further info on retrieving specific sports data.

4. Update the socket.emit functions in "index.js" similarly so that they send the variables containing the response data from the getData function(s) to the client-side.

5. As for the client-side, update the socket.on function(s) in "public/app.js" with the corresponding eventName passed to the emit function(s) from the server-side. Now the client-to-server connection is made and the client will receive the data from the server.

Check out [this helpful article](https://code.tutsplus.com/tutorials/real-time-sports-application-using-nodejs--cms-30594) for using Node.js, Express.js, & Socket.io to create a real-time sports application.
