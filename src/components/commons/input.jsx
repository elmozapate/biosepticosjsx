import { UserObj } from "@/engine/content";

const InputComp = (props) => {
    const { funtions = console.log, type = 'text', placeHolder = '', id = '',required=false, children = '', classN = '', userData = { UserObj } } = props

    return (
        <input
            id={id}
            type={type}
            className={classN}
            placeHolder={placeHolder}
            value={userData[id]}
            required={required}
            onChange={(e) => {
                e.preventDefault();
                funtions(e)
            }} />
    )
}
export default InputComp