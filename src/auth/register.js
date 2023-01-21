import EnvM from "@/envMachetero"
import io from "socket.io-client"
const envM = EnvM()
const socket = io(envM.hostBack)
export const RegisterAuth =  (userData,users={array:[]}) => {
    let found = 0
    users.array.map((key, i) => {
        if (key.nombre === userData.nombre ) {
            found = 1
        }
    })
    return found


}

export const SendNewPasword=(socket,props,res)=>{
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "changePasswordReq",
        reqId: res
    });

}