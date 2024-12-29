import { UAParser } from 'ua-parser-js';

const extractDeviceInfo = (req, res, next) => {
    let device = req.headers['x-device'];

    if (!device) {
        const { os, browser, device: uaDevice } = UAParser(req.headers['user-agent']);
        if (uaDevice.vendor && uaDevice.model) device = `${uaDevice.vendor} ${uaDevice.model}`;
        else if (os.name && os.version) device = `${os.name} ${os.version}`;
        else if (browser.name && browser.version) device = `${browser.name} ${browser.version}`;
    }

    req.device = device || 'unknown';
    next();
};

export default extractDeviceInfo;
