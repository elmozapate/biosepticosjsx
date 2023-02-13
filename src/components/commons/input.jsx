import { UserObj } from "@/engine/content";
import { useState } from "react";

const InputComp = (props) => {
    const { checkedIn = false, max = false, min = 0, funtions = console.log, type = 'text', placeholder = '', id = '', required = false, defaultValue = UserObj(), classN = '', userData = { UserObj } } = props
    const [changing, setChanging] = useState(false)
    return (
        <>
            {checkedIn ?
                <>
                    {
                        !changing ?
                            <p>{userData[id]} <span onClick={(e) => { e.preventDefault(); setChanging(true) }}>modificar</span> </p> :
                            <input
                                max={max}
                                min={min}
                                id={id}
                                type={type}
                                className={classN}
                                placeholder={placeholder}
                                value={userData[id]}
                                required={required}
                                onChange={(e) => {
                                    e.preventDefault();
                                    funtions(e)
                                }} />
                    }
                </> :
                <input
                    max={max}
                    min={min}
                    id={id}
                    type={type}
                    className={classN}
                    placeholder={placeholder}
                    value={userData[id]}
                    required={required}
                    onChange={(e) => {
                        e.preventDefault();
                        funtions(e)
                    }} />
            }
        </>
    )
}
export default InputComp