const dgram = require('dgram');
const dns = require('dns');

// Using Google's DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.invoice.c1y6mbu.mongodb.net', (err, addresses) => {
    if (err) {
        console.log('Error resolving SRV with 8.8.8.8:', err.message);
    } else {
        console.log('Got addresses:');
        console.log(JSON.stringify(addresses, null, 2));
    }
});
