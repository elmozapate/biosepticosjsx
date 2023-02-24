import EnvM from "@/envMachetero"
import io from "socket.io-client"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"


const socket = Socket
export const LoginAuth = (userData) => {

    const res = parseInt(Math.random() * 988888888)
    socket.emit('bioSepticos', {
        'dataIn': userData,
        actionTodo: "login",
        reqId: res
    });
   
    return res


}