import { io } from 'socket.io-client';

const socket = io('http://192.168.0.53:3030', {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function unsubscribeDev(subscribeFunction) {
    socket.on('removed-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();

    socket.on('message', text => {
        console.log(text);
    })
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect, disconnect, subscribeToNewDevs, unsubscribeDev
};