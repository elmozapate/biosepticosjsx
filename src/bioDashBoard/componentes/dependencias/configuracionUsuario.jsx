import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import { useEffect, useState } from "react"
const usuarioDefault=ModeloUsuario()
const ConfiguracionUsuario = (props) => {

    const { selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
const [activeUser,setActiveUser]=useState({
    selectOp:'',
    userInfo:usuarioDefault
})
    useEffect(() => {
        usersAll.array.map((key, i) => {
            if (key.id === selectioned.inSelection) {
                setActiveUser({
                    ...activeUser,
                    userInfo:key
                })
            }
        })
    }, [])
    /* for (let index = 0; index < usersAll.array.length; index++) {
        const element = usersAll.array[index];

    } */
    return (
        <>
            <div>
                {`usuario ${activeUser.userInfo.app.user} id ${activeUser.userInfo.id} `}
            </div>
        </>
    )

}

export default ConfiguracionUsuario