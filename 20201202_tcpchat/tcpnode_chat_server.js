
net = require('net');
var clients = [];

console.log("test\n");

net.createServer((socket) => {

    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    clients.push(socket);

    socket.write("Welcome " + socket.name + "\n");
    broadcast(socket.name + " joined the chat\n",socket);

    socket.on('data',function(data){
        var index = data.indexOf('/nickname');
        if(index != -1){
            this.name = data.slice(index + 10).toString();
            return;
        }
        var index = data.indexOf('/msg');
        if(index != -1){
            var res = data.toString().split(" ");
            var name = res[1];
            var msg = res[2];
            privateMessage(msg,name.toString());
            return;
        }
        broadcast(socket.name + "> " + data,socket);
    });
    socket.on('end',function(){
        clients.splice(clients.indexOf(socket),1);
        broadcast(socket.name + "left the chat.\n");
    });

    function privateMessage(message,receiver_name){
        clients.forEach(function (client){
                if(client.name === receiver_name){
                    client.write(message);
                }
        });
    }

    function broadcast(message,sender){
        clients.forEach(function(client){
            if(client === sender) return;
            client.write(message);
        });
        process.stdout.write(message);
    }

}).listen(5000);

console.log("Chat server running at port 5000\n");