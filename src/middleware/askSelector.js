import { SendNewPasword } from "@/auth/register"
import EnvM from "@/envMachetero"
import io from "socket.io-client"

const envM = EnvM()

const socket = io(envM.hostBack)

export const MiddlewareSelector = (props) => {
    const res = parseInt(Math.random() * 988888888)
    switch (props.ask) {
        case 'newUser':
            socket.emit('bioSepticos', {
                'dataIn': props.data,
                actionTodo: "newUser",
                reqId: res
            });
            break;
        case 'changePassword':
            SendNewPasword(socket, props, res)
            break;
        default:
            break;
    }

    return res


}
export default MiddlewareSelector