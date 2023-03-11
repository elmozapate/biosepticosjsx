import io from "socket.io-client"
import EnvM from "@/envMachetero"
import { PopUpObj } from "@/engine/content";
import { useEffect } from "react";

const envM = EnvM()
export const Socket = io(envM.hostBack)
let reqs = []
export const SocketOn = (props) => {
    const { socketDo = console.log, funtions = { setPopUp: console.log, acept: console.log }, setPopUp = console.log } = props
    Socket.on("bioApp", (msg) => {
        let recibed = false
        reqs.map((key, i) => {
            if (msg.resId === key) {
                recibed = true
            }
        })
        if (recibed) {
        } else {
            reqs.push(msg.resId)
            socketDo(msg)
            if (msg.actionTodo === 'dataRes-editPermisionData' || msg.actionTodo === 'newEntryRes' || msg.actionTodo === 'newBioRes') {
                (msg.actionTodo === 'newEntryRes' || msg.actionTodo === 'newBioRes') && setPopUp({
                    ...PopUpObj(),
                    type: 'acceptBox',
                    funtions: { ...funtions, setPopUp: setPopUp },
                    name: 'newUser',
                    active: true,
                    data: msg.body
                })
                if (msg.actionTodo === 'dataRes-editPermisionData' && msg.res === 'ok') {
                    setPopUp({
                        ...PopUpObj(),
                        type: 'acceptBox',
                        funtions: { ...funtions, setPopUp: setPopUp },
                        name: 'permisionEdit',
                        active: true,
                        data: msg.body
                    })
                }
            } else {

            }

        }
    })
  
    return (<></>)

}

export default SocketOn