# Workspace-Environment-Monitor
This project was implemented as a part Internet of Things (CS244P) course at the University of California, Irvine.
<br>

This project monitors temperature, humidity and noise levels for a workspace using Sparkfun ESP8266 Development Board, Sparkfun SEN-12642 Sound Detector, and Sparkfun DHT22 temperature-humidity sensor to calculate real-time fitness scores.
Data is visualized using two telemetry graphs and three score graphs. The score graphs depict fitness factors of Temperature, Humidity and Sound Measurements. If a workspace has optimal working conditions i.e. optimal temperature, sound and humidity, the Fitness factors will be 100. 
Hence, Fitness Factors represent how fit the workspace is for the employees to work in.

## Run a daemon application to send data to your IoT hub
You can refer the related [lesson](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-live-data-visualization-in-web-apps) to run an daemon application, to send data to your IoT hub.

## Add new consumer group to your event hub
Go to [Azure Portal](https://portal.azure.com) and select your IoT hub. Click `Endpoints -> Events`, add a new consumer group and then save it.

## Deploy to Azure web application
Go to [Azure Portal](https://portal.azure.com) to create your own Azure web app service. Then do the following setting:

* Go to `Application settings`, add key/value pairs `Azure.IoT.IoTHub.ConnectionString` and `Azure.IoT.IoTHub.ConsumerGroup` to `App settings` slot.
* Go to `Deployment options`, set `Local git repository` to deploy your web app.
* Go to `Deployment credentials`, set your deploy username and password.
* In the `Overview` page, note the `Git clone url`.
* Push the repo's code to the git repo url you note in last step.
* After the push and deploy finished, you can view the page to see the real-time data chart.

## Local deploy
* Open a console and set the following environment variable:
  * `set Azure.IoT.IoTHub.ConnectionString=<your connection string>`
  * `set Azure.IoT.IoTHub.ConsumerGroup=<your consumer group name>`
* Open ./public/javascripts/index.js, and change the code around line 69

    from
    ```js
    var ws = new WebSocket('wss://' + location.host);
    ```
    to
    ```js
    var ws = new WebSocket('ws://' + location.host);
    ```
* `npm install`
* `npm start`

