/*
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const VersalinkDevice = require('versalink-device');
const device = require('@agilatech/rmy85000');

module.exports = class Rmy85000 extends VersalinkDevice {
    
    constructor(options) {
        
        // The file must be defined. If not supplied in options, then default to ttyS0
        const file  = options['file'] || "/dev/ttyS0";
        
        const hardware = new device.Rmy85000(file);
        
        super(hardware, options);

        this.provideWindProperties();
        
    }

    addMonitoredProperties(config) {
    	this.avgWind =  0;
    	this.avgDir =   0;
    	this.gustWind = 0;
    	this.gustDir =  0;

    	config.monitor('avgWind').monitor('avgDir').monitor('gustWind').monitor('gustDir');
    }

    // add the properties which actually matter to wind speed/direction data
    provideWindProperties() {

    	var self = this;

    	self._speedTotal = 0;
    	self._dirTotal   = 0;
    	self._count      = 0;
    	self._maxSpeed   = 0;
    	self._maxDir     = 0;
    
    	this._windInterval = setInterval(function() {

    		const speed = parseFloat(self.hardware.valueAtIndexSync(0));
    		const dir = parseInt(self.hardware.valueAtIndexSync(1), 10);

    		self._speedTotal += speed;
    		self._dirTotal += dir;

    		if (self._count > 58) {

    			self.avgWind = Math.round(self._speedTotal/6) / 10;  // round to 1 decimal place

    			// Yes, yes, we know that this is a bogus way to calc avg dir
    			self.avgDir  = Math.round(self._dirTotal/60); 

    			self.gustWind = self._maxSpeed;
    			self.gustDir  = self._maxDir;

    			self._speedTotal = 0;
		    	self._dirTotal   = 0;
		    	self._count      = 0;
		    	self._maxSpeed   = 0;
		    	self._maxDir     = 0;
    		}
    		else {
    			if (speed > self._maxSpeed) {
    				self._maxSpeed = speed;
    				self._maxDir = dir;
    			}
    			self._count++;
    		}

    	}, 1000);
    }
}





