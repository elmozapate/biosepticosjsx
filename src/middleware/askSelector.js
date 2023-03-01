import { SendNewPasword } from "@/auth/register"
import { GetEmpresas, GetMisEmpresas, GetMisEmpresasVendedor, GetMisObras, GetMisServicios } from "@/request/getEmpresas"
import { NewUser, NewUserBio, SendEmailCheck } from "@/request/newUser"
import { ContactData, EditCompanyPermisionData, EditPermisionData, EditSellPermisionData, PersonalData, SendAllData, SendNewPerms } from "@/request/personalData"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { SetEmpresas } from "@/request/sendEmpresa"
import { SetObras } from "@/request/sendObra"
import { EditServicios, SetServicio } from "@/request/sendServicio"
import { ActualizarEstadoVehiculo, CrearRutaVehiculo, SetVehiculo } from "@/request/sendVehiculo"
import { GetVendedores } from "@/request/getVendedores"
import { AskBioseptico, CrearCalendarioReq, CrearRutaDiariaReq, GetMisVehiculos } from "@/request/getBioseptico"


const socket = Socket

export const MiddlewareSelector = (props) => {
    const res = parseInt(Math.random() * 988888888)
    switch (props.ask) {
        case 'newUser':
            NewUser(socket, props, res)
            break;
        case 'newUser-Bio':
            NewUserBio(socket, props, res)
            break;
        case 'actualizarEstado':
            if (props.data && props.data.tipo && props.data.tipo === 'vehiculo') {
                ActualizarEstadoVehiculo(socket, props, res)
            }
            break;
        case 'crearRutaVehiculo':
            CrearRutaVehiculo(socket, props, res)
            break;
        case 'pedirEmpresas':
            GetEmpresas(socket, props, res)
            break;
        case 'getVendedores':
            GetVendedores(socket, props, res)
            break;
        case 'getMisEmpresasVendedor':
            GetMisEmpresasVendedor(socket, props, res)
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
        case 'sendData-all-Empresas':
            SetEmpresas(socket, props, res)
            break;
        case 'edit-permision':
            EditPermisionData(socket, props, res)
            break;
        case 'edit-companyPermisions':
            EditCompanyPermisionData(socket, props, res)
            break;
        case 'edit-sellPermisions':
            EditSellPermisionData(socket, props, res)
            break;
        case 'edit-servicios':
            EditServicios(socket, props, res)
            break;
        case 'sendNewCar':
            SetVehiculo(socket, props, res)
            break;
        case 'edit-all':
/*             SendAllData(socket, props, res)
 */            break;
        case 'sendData-emailCheck':
            SendEmailCheck(socket, props, res)
            break;
        case 'newPerms':
            SendNewPerms(socket, props, res)
            break;
        case 'askCompanies':
            GetMisEmpresas(socket, props, res)
            break;
        case 'askObras':
            GetMisObras(socket, props, res)
            break;
        case 'askServicios':
            GetMisServicios(socket, props, res)
            break;
        case 'askVehiculos':
            GetMisVehiculos(socket, props, res)
            break;
        case 'sendData-all-Obra':
            SetObras(socket, props, res)
            break;
        case 'setServicio':
            SetServicio(socket, props, res)
            break
        case 'askBioseptico':
            AskBioseptico(socket, props, res)
            break
        case 'crearAno':
            CrearCalendarioReq(socket, props, res)
            break
        case 'crearRutaDiaria':
            CrearRutaDiariaReq(socket, props, res)
            break

        default:
            break;
    }
    return res
}
export const CrearCalendario = (ano) => {
    MiddlewareSelector({ ask: 'crearAno', data: ano })
}
export const CrearRutaDiaria = (ruta) => {
    MiddlewareSelector({ ask: 'crearRutaDiaria', data: ruta })
}
export default MiddlewareSelector
