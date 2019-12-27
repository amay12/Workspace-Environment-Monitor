#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <DHT.h>
//#include <Math.h>

#if SIMULATED_DATA


float max(float a, float b)
{
  if(a>b) return a;
  else return b;
}



void initSensor()
{
    // use SIMULATED_DATA, no sensor need to be inited
}

float readTemperature()
{
    return random(20, 30);
}

float readHumidity()
{
    return random(30, 40);
}

#else
void soundISR()
{
  int pin_val;

  pin_val = digitalRead(PIN_GATE_IN);
  digitalWrite(PIN_LED_OUT, pin_val);   
}


static DHT dht(DHT_PIN, DHT_TYPE);
void initSensor()
{
    dht.begin();
}

float readTemperature()
{
    return dht.readTemperature();
}

float readHumidity()
{
    return dht.readHumidity();
}

#endif

float myabs(float a)
{
  if(a>0) return a;
  else return (float(0)-a);
}

bool readMessage(int messageId, char *payload)
{
    float temperature = readTemperature();
    float humidity = readHumidity();
    float Benchmark = 100;
    float TempFactor = 20;
    float optimalTemp = 24;
    float optimalHumidity = 64;
    float HumidityFactor = 1;
    float optimalSound = 400;
    float SoundFactor = 0.05;
    bool temperatureAlert = false;
    float value = analogRead(PIN_ANALOG_IN);
    float tempdiff = max(float(0), Benchmark - TempFactor * myabs(optimalTemp - temperature));
    float humiditydiff = max(float(0), Benchmark - HumidityFactor*myabs(optimalHumidity - humidity));
    float sounddiff = optimalSound>value?Benchmark: max(float(0), Benchmark - SoundFactor*(value - optimalSound));

    StaticJsonBuffer<MESSAGE_MAX_LEN> jsonBuffer;
    JsonObject &root = jsonBuffer.createObject();
    root["deviceId"] = DEVICE_ID;
    root["messageId"] = messageId;
    
    // NAN is not the valid json, change it to NULL
    if (std::isnan(temperature))
    {
        root["temperature"] = NULL;
    }
    else
    {
        root["temperature"] = temperature;
        if (temperature > TEMPERATURE_ALERT)
        {
            temperatureAlert = true;
        }
    }

    if (std::isnan(humidity))
    {
        root["humidity"] = NULL;
    }
    else
    {
        root["humidity"] = humidity;
    }
    if (std::isnan(value))
    {
        root["pressure"] = NULL;
    }
    else
    {
        root["pressure"] = value;
    }
    if (std::isnan(tempdiff))
    {
        root["tempdiff"] = NULL;
    }
    else
    {
        root["tempdiff"] = tempdiff;
    }
    if (std::isnan(humiditydiff))
    {
        root["humiditydiff"] = NULL;
    }
    else
    {
        root["humiditydiff"] = humiditydiff;
    }
    if (std::isnan(sounddiff))
    {
        root["sounddiff"] = NULL;
    }
    else
    {
        root["sounddiff"] = sounddiff;
    }
    
    root.printTo(payload, MESSAGE_MAX_LEN);
    return temperatureAlert;
}

void parseTwinMessage(char *message)
{
    StaticJsonBuffer<MESSAGE_MAX_LEN> jsonBuffer;
    JsonObject &root = jsonBuffer.parseObject(message);
    if (!root.success())
    {
        Serial.printf("Parse %s failed.\r\n", message);
        return;
    }

    if (root["desired"]["interval"].success())
    {
        interval = root["desired"]["interval"];
    }
    else if (root.containsKey("interval"))
    {
        interval = root["interval"];
    }
}
