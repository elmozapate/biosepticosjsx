import { SendNewPasword } from "@/auth/register"
import EnvM from "@/envMachetero"
import { GetEmpresas } from "@/request/getEmpresas"
import { NewUser } from "@/request/newUser"
import { ContactData, PersonalData, SendAllData } from "@/request/personalData"
import io from "socket.io-client"

const envM = EnvM()

const socket = io(envM.hostBack)

export const MiddlewareSelector = (props) => {
    const res = parseInt(Math.random() * 988888888)
    switch (props.ask) {
        case 'newUser':
            NewUser(socket, props, res)
            break;
        case 'pedirEmpresas':
            GetEmpresas(socket, props, res)
            break;
        case 'changePassword':
            SendNewPasword(socket, props, res)
            break;
        case 'sendData-personal':
            PersonalData(socket, props, res)
            break;
        case 'sendData-contact':
            ContactData(socket, props, res)
            break;
            case 'sendData-all':
            SendAllData(socket, props, res)
            break;
        default:
            break;
    }
    return res
}
export default MiddlewareSelector