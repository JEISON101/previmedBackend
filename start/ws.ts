import app from "@adonisjs/core/services/app";
import {Server} from 'socket.io';
import server from "@adonisjs/core/services/server";

app.ready(()=>{
    const io = new Server(server.getNodeServer(),{
        cors:{
            origin:'*', // Esta configución se debe eliminar no olvidar solo permitir las fuentes de previmed ejemplo 'https://previmed.render.com'. o el dominio que compren... Saludos Jorge
        },
    })
    io?.on('connection', (socket)=>{
        console.log('Nueva conexion', socket.id)

        socket.on('disconnect',()=>{
            console.log('Usuario desconectado')
        })
        socket.on('solicitudVisita',(data)=>{
            io.emit('solicitudVisita', data)
        })
    })
})