import * as os from 'os';

export const getIpAddress = () => {
  const ifaces = os.networkInterfaces();
  let address: string[] = [];

  for (var dev in ifaces) {

    var iface = ifaces[dev].filter(function (details) {
      return details.family === 'IPv4' && details.internal === false;
    });
    if (iface.length > 0) address.push(iface[0].address);
  }
  return address[0];
}