/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
  // if deployed to a site supporting SSL, use wss://
  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);

  // A class for holding the last N points of telemetry for a device
  class DeviceData {
    constructor(deviceId) {
      this.deviceId = deviceId;
      this.maxLen = 50;
      this.timeData = new Array(this.maxLen);
      this.temperatureData = new Array(this.maxLen);
      this.humidityData = new Array(this.maxLen);
      this.pressureData = new Array(this.maxLen);
       this.tempData1 = new Array(this.maxLen);
       this.humidityData1 = new Array(this.maxLen);
       this.soundData1 = new Array(this.maxLen);

    }

    addData(time, tempdiff, humiditydiff, sounddiff, temperature, humidity, pressure) {
      this.timeData.push(time);
      this.temperatureData.push(temperature);
      this.humidityData.push(humidity || null);
      this.pressureData.push(pressure || null);
      this.tempData1.push(tempdiff);
      this.humidityData1.push(humiditydiff || null);
      this.soundData1.push(sounddiff);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.temperatureData.shift();
        this.humidityData.shift();
        this.pressureData.shift();
        this.tempData1.shift();
        this.humidityData1.shift();
        this.soundData1.shift();
      }
    }
  }

  // All the devices in the list (those that have been sending telemetry)
  class TrackedDevices {
    constructor() {
      this.devices = [];
    }

    // Find a device based on its Id
    findDevice(deviceId) {
      for (let i = 0; i < this.devices.length; ++i) {
        if (this.devices[i].deviceId === deviceId) {
          return this.devices[i];
        }
      }

      return undefined;
    }

    getDevicesCount() {
      return this.devices.length;
    }
  }

  const trackedDevices = new TrackedDevices();

  // Define the chart axes
  const chartData = {
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: true,
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: 'rgba(24, 120, 240, 1)',
        pointBoarderColor: 'rgba(24, 120, 240, 1)',
        backgroundColor: 'rgba(24, 120, 240, 0.4)',
        pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
        pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
        spanGaps: true,
      }
    ]
  };

  const chartOptions = {
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature (ºC)',
          display: true,
        },
        position: 'left',
      },
      {
        id: 'Humidity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity (%)',
          display: true,
        },
        position: 'right',
      }]
    }
  };
  const data2 = {
    datasets: [
      {
        fill: false,
        label: 'Sound',
        yAxisID: 'Pressure',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        //data: pressureData
      }
    ]
  };
  
  const chartOptions2 = {
    title: {
      display: true,
      text: 'Sound Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Pressure',
        type: 'linear',
        scaleLabel: {
          labelString: 'Sound',
          display: true
        },
        position: 'left',
      }]
    }
  };    

  //Fitness Data and Options start

  const tempData = {
    datasets: [
      {
        fill: false,
        label: 'Temperature_Fitness',
        yAxisID: 'Temperature_Fitness',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
      }
    ]
  };

  const tempOptions = {
    title: {
      display: true,
      text: 'Temperature Fitness Factor',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature_Fitness',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature_Fitness',
          display: true
        },
        position: 'left',
      }]
    }
  };

  const humidityData = {
    datasets: [
      {
        fill: false,
        label: 'Humidity_Fitness',
        yAxisID: 'Humidity_Fitness',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
      }
    ]
  };

  const humidityOptions = {
    title: {
      display: true,
      text: 'Humidity Fitness Factor',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Humidity_Fitness',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity_Fitness',
          display: true
        },
        position: 'left',
      }]
    }
  };

  const soundData = {
    datasets: [
      {
        fill: false,
        label: 'Sound_Fitness',
        yAxisID: 'Sound_Fitness',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
      }
    ]
  };

  const soundOptions = {
    title: {
      display: true,
      text: 'Sound Fitness Factor',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Sound_Fitness',
        type: 'linear',
        scaleLabel: {
          labelString: 'Sound_Fitness',
          display: true
        },
        position: 'left',
      }]
    }
  };

  //Fitness Data and Options End

  // Get the context of the canvas element we want to select
  const ctx = document.getElementById('iotChart').getContext('2d');
  const myLineChart = new Chart(
    ctx,
    {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myLineChart2 = new Chart(
    ctx2,
    {
      type: 'line',
      data: data2,
      options: chartOptions2,
    });

    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    const myTempChart = new Chart(
      ctxTemp,
      {
        type: 'line',
        data: tempData,
        options: tempOptions,
      });
      
    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    const myHumidityChart = new Chart(
      ctxHumidity,
      {
        type: 'line',
        data: humidityData,
        options: humidityOptions,
      });

    const ctxSound = document.getElementById('soundChart').getContext('2d');
    const mySoundChart = new Chart(
      ctxSound,
      {
        type: 'line',
        data: soundData,
        options: soundOptions,
      });

      

  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById('deviceCount');
  const listOfDevices = document.getElementById('listOfDevices');
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);
    chartData.labels = device.timeData;
    chartData.datasets[0].data = device.temperatureData;
    chartData.datasets[1].data = device.humidityData;

    data2.labels=device.timeData;
    data2.datasets[0].data = device.pressureData;

    tempData.labels=device.timeData;
    tempData.datasets[0].data = device.tempData1;

    humidityData.labels=device.timeData;
    humidityData.datasets[0].data = device.humidityData1;

    soundData.labels=device.timeData;
    soundData.datasets[0].data = device.soundData1;
  }
  listOfDevices.addEventListener('change', OnSelectionChange, false);

  // When a web socket message arrives:
  // 1. Unpack it
  // 2. Validate it has date/time and temperature
  // 3. Find or create a cached device to hold the telemetry data
  // 4. Append the telemetry data
  // 5. Update the chart UI
  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);

      // time and either temperature or humidity are required
      if (!messageData.MessageDate || (!messageData.IotData.temperature && !messageData.IotData.humidity)) {
        return;
      }

      // find or add device to list of tracked devices
      const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);

      if (existingDeviceData) {
        existingDeviceData.addData(messageData.MessageDate, messageData.IotData.tempdiff,messageData.IotData.humiditydiff, messageData.IotData.sounddiff, messageData.IotData.temperature, messageData.IotData.humidity, messageData.IotData.pressure);
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        newDeviceData.addData(messageData.MessageDate,messageData.IotData.tempdiff,messageData.IotData.humiditydiff, messageData.IotData.sounddiff,messageData.IotData.temperature,messageData.IotData.humidity, messageData.IotData.pressure);

        // add device to the UI list
        const node = document.createElement('option');
        const nodeText = document.createTextNode(messageData.DeviceId);
        node.appendChild(nodeText);
        listOfDevices.appendChild(node);

        // if this is the first device being discovered, auto-select it
        if (needsAutoSelect) {
          needsAutoSelect = false;
          listOfDevices.selectedIndex = 0;
          OnSelectionChange();
        }
      }

      myLineChart.update();
      myLineChart2.update();
      myTempChart.update();
      myHumidityChart.update();
      mySoundChart.update();
      
      
    } catch (err) {
      console.error(err);
    }
  };
});




// /* eslint-disable max-classes-per-file */
// /* eslint-disable no-restricted-globals */
// /* eslint-disable no-undef */
// $(document).ready(() => {
//   // if deployed to a site supporting SSL, use wss://
//   const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
//   const webSocket = new WebSocket(protocol + location.host);

//   const Benchmark = 100;
//   const TempFactor = 10;
//   const optimalTemp = 24;
//   const optimalHumidity = 64;
//   const HumidityFactor = 10;
//   const optimalSound = 400;
//   const SoundFactor = 0.05;

//   // A class for holding the last N points of telemetry for a device
//   class DeviceData {
//     constructor(deviceId) {
//       this.deviceId = deviceId;
//       this.maxLen = 50;
//       this.timeData = new Array(this.maxLen);
//       this.temperatureData = new Array(this.maxLen);
//       this.humidityData = new Array(this.maxLen);
//       this.pressureData = new Array(this.maxLen);
//       this.tempData1 = new Array(this.maxLen);
//       this.humidityData1 = new Array(this.maxLen);
//       this.soundData1 = new Array(this.maxLen);
//     }

//     addData(time, temperature, humidity, pressure) {
//       this.timeData.push(time);
//       this.temperatureData.push(temperature);
//       this.humidityData.push(humidity || null);
//       this.pressureData.push(pressure);
//       var tempdiff = Math.max(0, Benchmark - TempFactor * Math.abs(optimalTemp - temperature));
//       var humiditydiff = Math.max(0,Benchmark - HumidityFactor*Math.abs(optimalHumidity - humidity));
//       var sounddiff = optimalSound>pressure? 0: SoundFactor*(pressure - optimalSound);
//       this.tempData1.push(tempdiff);
//       this.humidityData1.push(humiditydiff);
//       this.soundData1.push(sounddiff);

//       if (this.timeData.length > this.maxLen) {
//         this.timeData.shift();
//         this.temperatureData.shift();
//         this.humidityData.shift();
//         this.pressureData.shift();
//         this.tempData1.shift();
//         this.soundData1.shift();
//         this.humidityData1.shift();
//       }
//     }
//   }

//   // All the devices in the list (those that have been sending telemetry)
//   class TrackedDevices {
//     constructor() {
//       this.devices = [];
//     }

//     // Find a device based on its Id
//     findDevice(deviceId) {
//       for (let i = 0; i < this.devices.length; ++i) {
//         if (this.devices[i].deviceId === deviceId) {
//           return this.devices[i];
//         }
//       }

//       return undefined;
//     }

//     getDevicesCount() {
//       return this.devices.length;
//     }
//   }

//   const trackedDevices = new TrackedDevices();

//   // Define the chart axes
//   const chartData = {
//     datasets: [
//       {
//         fill: false,
//         label: 'Temperature',
//         yAxisID: 'Temperature',
//         borderColor: 'rgba(255, 204, 0, 1)',
//         pointBoarderColor: 'rgba(255, 204, 0, 1)',
//         backgroundColor: 'rgba(255, 204, 0, 0.4)',
//         pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
//         pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
//         spanGaps: true,
//       },
//       {
//         fill: false,
//         label: 'Humidity',
//         yAxisID: 'Humidity',
//         borderColor: 'rgba(24, 120, 240, 1)',
//         pointBoarderColor: 'rgba(24, 120, 240, 1)',
//         backgroundColor: 'rgba(24, 120, 240, 0.4)',
//         pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
//         pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
//         spanGaps: true,
//       }
//     ]
//   };

//   const chartOptions = {
//     scales: {
//       yAxes: [{
//         id: 'Temperature',
//         type: 'linear',
//         scaleLabel: {
//           labelString: 'Temperature (ºC)',
//           display: true,
//         },
//         position: 'left',
//       },
//       {
//         id: 'Humidity',
//         type: 'linear',
//         scaleLabel: {
//           labelString: 'Humidity (%)',
//           display: true,
//         },
//         position: 'right',
//       }]
//     }
//   };

//   // Get the context of the canvas element we want to select
//   const ctx = document.getElementById('iotChart').getContext('2d');
//   const myLineChart = new Chart(
//     ctx,
//     {
//       type: 'line',
//       data: chartData,
//       options: chartOptions,
//     });



//   const data2 = {
//     datasets: [
//       {
//         fill: false,
//         label: 'Sound',
//         yAxisID: 'Pressure',
//         borderColor: "rgba(24, 120, 240, 1)",
//         pointBoarderColor: "rgba(24, 120, 240, 1)",
//         backgroundColor: "rgba(24, 120, 240, 0.4)",
//         pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
//         pointHoverBorderColor: "rgba(24, 120, 240, 1)",
//         //data: pressureData
//       }
//     ]
//   };
  
//   const basicOption2 = {
//     title: {
//       display: true,
//       text: 'Sound Real-time Data',
//       fontSize: 36
//     },
//     scales: {
//       yAxes: [{
//         id: 'Pressure',
//         type: 'linear',
//         scaleLabel: {
//           labelString: 'Sound',
//           display: true
//         },
//         position: 'left',
//       }]
//     }
//   };    


//   var ctx2 = document.getElementById("myChart2").getContext("2d");
//   var optionsNoAnimation2 = { animation: false }
//   var myLineChart2 = new Chart(
//     ctx2,
//     {
//       type: 'line',
//       data: data2,
//       options: basicOption2
//   });


//   const tempData = {
//       datasets: [
//         {
//           fill: false,
//           label: 'Temperature_Fitness',
//           yAxisID: 'Temperature_Fitness',
//           borderColor: "rgba(24, 120, 240, 1)",
//           pointBoarderColor: "rgba(24, 120, 240, 1)",
//           backgroundColor: "rgba(24, 120, 240, 0.4)",
//           pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
//           pointHoverBorderColor: "rgba(24, 120, 240, 1)",
//         }
//       ]
//     };
  
//     const basicOptionTemp = {
//       title: {
//         display: true,
//         text: 'Temperature Fitness Factor',
//         fontSize: 36
//       },
//       scales: {
//         yAxes: [{
//           id: 'Temperature Fitness',
//           type: 'linear',
//           scaleLabel: {
//             labelString: 'Temperature_Fitness',
//             display: true
//           },
//           position: 'left',
//         }]
//       }
//     };
  
//     const humidityData = {
//       datasets: [
//         {
//           fill: false,
//           label: 'Humidity_Fitness',
//           yAxisID: 'Humidity_Fitness',
//           borderColor: "rgba(24, 120, 240, 1)",
//           pointBoarderColor: "rgba(24, 120, 240, 1)",
//           backgroundColor: "rgba(24, 120, 240, 0.4)",
//           pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
//           pointHoverBorderColor: "rgba(24, 120, 240, 1)",
//         }
//       ]
//     };
  
//     const basicOptionHumidity = {
//       title: {
//         display: true,
//         text: 'Humidity Fitness Factor',
//         fontSize: 36
//       },
//       scales: {
//         yAxes: [{
//           id: 'Humidity Fitness',
//           type: 'linear',
//           scaleLabel: {
//             labelString: 'Humidity_Fitness',
//             display: true
//           },
//           position: 'left',
//         }]
//       }
//     };
  
//     const soundData = {
//       datasets: [
//         {
//           fill: false,
//           label: 'Sound_Fitness',
//           yAxisID: 'Sound_Fitness',
//           borderColor: "rgba(24, 120, 240, 1)",
//           pointBoarderColor: "rgba(24, 120, 240, 1)",
//           backgroundColor: "rgba(24, 120, 240, 0.4)",
//           pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
//           pointHoverBorderColor: "rgba(24, 120, 240, 1)",
//         }
//       ]
//     };
  
//     const basicOptionSound = {
//       title: {
//         display: true,
//         text: 'Sound Fitness Factor',
//         fontSize: 36
//       },
//       scales: {
//         yAxes: [{
//           id: 'Sound Fitness',
//           type: 'linear',
//           scaleLabel: {
//             labelString: 'Sound_Fitness',
//             display: true
//           },
//           position: 'left',
//         }]
//       }
//     };
  

//   var ctxTemp = document.getElementById("tempFitness").getContext("2d");
//   var myTempChart = new Chart(
//     ctxTemp,
//     {
//       type: 'line',
//       data: tempData,
//       options: basicOptionTemp
//   });

//   var ctxHumidity = document.getElementById("humidityFitness").getContext("2d");
//   var myHumidityChart = new Chart(
//     ctxHumidity,
//     {
//       type: 'line',
//       data: humidityData,
//       options: basicOptionHumidity
//   });

//   var ctxSound = document.getElementById("soundFitness").getContext("2d");
//   var mySoundChart = new Chart(
//     ctxSound,
//     {
//       type: 'line',
//       data: soundData,
//       options: basicOptionSound
//   });


//   // Manage a list of devices in the UI, and update which device data the chart is showing
//   // based on selection
//   let needsAutoSelect = true;
//   const deviceCount = document.getElementById('deviceCount');
//   const listOfDevices = document.getElementById('listOfDevices');
//   function OnSelectionChange() {
//     const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);
//     chartData.labels = device.timeData;
//     chartData.datasets[0].data = device.temperatureData;
//     chartData.datasets[1].data = device.humidityData;

//     data2.labels=device.timeData;
//     data2.datasets[0].data = device.pressureData;

//     tempData.labels=device.timeData;
//     tempData.datasets[0].data = device.tempData1;

//     humidityData.labels=device.timeData;
//     humidityData.datasets[0].data = device.humidityData1;

//     soundData.labels=device.timeData;
//     soundData.datasets[0].data = device.soundData1;
//   }
//   listOfDevices.addEventListener('change', OnSelectionChange, false);

//   // When a web socket message arrives:
//   // 1. Unpack it
//   // 2. Validate it has date/time and temperature
//   // 3. Find or create a cached device to hold the telemetry data
//   // 4. Append the telemetry data
//   // 5. Update the chart UI
//   webSocket.onmessage = function onMessage(message) {
//     try {
//       const messageData = JSON.parse(message.data);
//       console.log(messageData);

//       // time and either temperature or humidity are required
//       if (!messageData.MessageDate || (!messageData.IotData.temperature && !messageData.IotData.humidity)) {
//         return;
//       }

//       // find or add device to list of tracked devices
//       const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);

//       if (existingDeviceData) {
//         existingDeviceData.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.IotData.humidity, messageData.IotData.pressure);
//       } else {
//         const newDeviceData = new DeviceData(messageData.DeviceId);
//         trackedDevices.devices.push(newDeviceData);
//         const numDevices = trackedDevices.getDevicesCount();
//         deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
//         newDeviceData.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.IotData.humidity, messageData.IotData.pressure);

//         // add device to the UI list
//         const node = document.createElement('option');
//         const nodeText = document.createTextNode(messageData.DeviceId);
//         node.appendChild(nodeText);
//         listOfDevices.appendChild(node);

//         // if this is the first device being discovered, auto-select it
//         if (needsAutoSelect) {
//           needsAutoSelect = false;
//           listOfDevices.selectedIndex = 0;
//           OnSelectionChange();
//         }
//       }

//       myLineChart.update();
//       myLineChart2.update();
//       myTempChart.update();
//       myHumidityChart.update();
//       mySoundChart.update();
//     } catch (err) {
//       console.error(err);
//     }
//   };
// });