import { PopUpObj } from "@/engine/content";

export const InterfazRegistro = (type, funtions) => {
    const popStructure = PopUpObj()
    let returnPopInfo = popStructure
    switch (type) {
        case 'register':
            returnPopInfo.active = true
            returnPopInfo.type = 'register'
            returnPopInfo.funtions = funtions
            break;
        case 'login':
            returnPopInfo.active = true
            returnPopInfo.type = 'login'
            returnPopInfo.funtions = funtions
            break;
        case 'changePassword':
            returnPopInfo.active = true
            returnPopInfo.type = 'changePassword'
            returnPopInfo.funtions = funtions
            break
        default:
            break;
    }
    return returnPopInfo

}