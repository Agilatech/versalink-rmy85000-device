##VersaLink RMY85000 Ultrasonic Anemometer sensor device driver

This device driver is specifically designed to be used with the Agilatech VersaLink IOT System.

###Install
```
$> npm install @agilatech/versalink-rmy85000-device
```

###Usage
This device driver is designed to be consumed by the Agilatech VersaLink IOT system.
```

const rmy85000 = require('@agilatech/versalink-rmy85000-device');
const versalink = require('@agilatech/versalink-server');

versalink()
.use(rmy85000, [options])  // where [options] define operational paramters -- omit to accept defaults
.listen(<port number>)   // where <port number> is the port on which the zetta server should listen
```

####options
_options_ is an object which contains key/value pairs used for driver configuration.

```
"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"devicePoll":<period>
Period in milliseconds in which device will be polled to check for new data

"deltaPercent":<percent>
Percent of the data range which must be exceeded (delta) to qualify as "new" data

"file":<serial device file>
Serial device file descriptor, i.e. /dev/ttys0
```

####deltaPercent in detail
_deltaPercent_ is the percentage of the current numerical data range which a polled data value must exceed to be considred "new". As an example, consider a temperature range of 100, a deltaPercent of 2, and the current temerature of 34.  In such a case, a device poll must produce a value of 36 or greater, or 32 or less than in order to be stored as a current value.  35 or 33 will be ignored.  deltaPercent may be any value greater than 0 or less than 100, and may be fractional. If not defined, the default is 5 percent.


####Defining the value ranges
Value ranges may also be defined in the options, and are closely related to deltaPercent.  If not defined, the software will keep track of minimum and maximum values and derive the range from them.  However, that takes time for the software to "learn" the ranges, so they can be defined in the options object:
```
"speed_range":<numeric range>
"direction_range":<numeric bearing range>
```
where the &lt;numeric range&gt; is a number representing the absolute range of the value.

####options example
Here is an example of an options varible which stream values every 10 seconds, polls the device every second, requires an 8% delta change to register a new monitored value, and defines valid ranges on all parameters:
```
const options = {
    "streamPeriod":10000, 
    "devicePoll":1000, 
    "deltaPercent":8,
    "file":"/dev/ttyS1",
    "speed_range":40,
    "direction_range":360
}
```

  
####Default values
If not specified in the options object, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)
* _deltaPercent_ : 5 (polled values must exceed the range by &plusmn; 5%)

    
####&lt;port number&gt;
Agilatech has definied the open port number 1107 as its standard default for IIOT (Industrial Internet Of Things) server application. In practice, most any port above 1024 may be used.


###Example
Using directly in the zetta server, and accepting all defaults:
```
const zetta = require('zetta');
const sensor = require('versalink-rmy85000-device');
zetta().use(sensor).listen(1107);
```

To easily specify some options, simply supply them in an object in the use statement like this:
```
zetta().use(sensor, { "file":"/dev/ttyS1", "devicePoll":8000, "streamPeriod":15000 });
```
Overrides the defaults to initialize the bus on **/dev/ttyS1** with a data monitoring period of **8 seconds** and streaming data every **15 seconds**

###Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


####Monitored Properties
In the *on* state, the driver software for this device monitors three values.
1. **speed** - wind speed in m/s
2. **direction** - wind direction from 0-360 degrees

  
####Streaming Properties
In the *on* state, the driver software continuously streams three values in isochronal 
fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **speed_stream**
2. **direction_stream**


###State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
###Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.

###Design

This device driver is designed for both streaming and periodic monitored data collection from the RM Young 85000 
series ultrasonic anemometer.  The hardware measures wind speed from 0-60 m/s with an accuracy of ±0.1 m/s. Wind 
direction is measured from 0-360 degrees with an accuracy of ±3 degrees.

Wind speed and direction values are instantaneous, with no averaging or time weighting performed.  Any analysis 
of averages and gusts will need to be performed downstream of this driver.  Because of this, consider frequent streaming, but infrequent monitoring, and then averaging streams for more accurate time-based averages as well
as gust speeds and directions.

The hardware interfaces via RS-232 or RS-485, so your hardware must support one of these protocols.  The serial 
device file can be specified in the constructor.


### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC


###Copyright
Copyright © 2016 Agilatech. All Rights Reserved.
