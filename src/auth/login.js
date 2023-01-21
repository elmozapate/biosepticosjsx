import EnvM from "@/envMachetero"
import io from "socket.io-client"

const envM = EnvM()

const socket = io(envM.hostBack)
export const LoginAuth = (userData) => {

    const res = parseInt(Math.random() * 988888888)
    socket.emit('bioSepticos', {
        'dataIn': userData,
        actionTodo: "login",
        reqId: res
    });
    /* 
    
    console.log(users);
    users.array.map((key, i) => {
        if (key.nombre === userData.nombre && key.password === userData.password) {
            found = { status: 'found', data: key }
        }
    }) */
    return res


}