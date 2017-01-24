
const VersalinkDevice = require('@agilatech/versalink-device');
const device = require('@agilatech/rmy85000');

module.exports = class Rmy85000 extends VersalinkDevice {
    
    constructor(options) {
        
        // The file must be defined. If not supplied in options, then default to ttyS0
        const file  = options['file'] || "/dev/ttyS0";
        
        const hardware = new device.Rmy85000(file);
        
        super(hardware, options);

    }
}

