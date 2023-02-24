import StringsObj, { UserObj } from "@/engine/content";
const objStringsInit = StringsObj()
const SelectorVendedores = (props) => {
    const { idSelect = false, inAdress = false, objStrings = objStringsInit, item = 'default', items = [], funtions = console.log, type = 'selector', placeholder = '', id = '', required = true, children = '', classN = '', userData = { UserObj } } = props

    return (
        <div  id={(parseInt(Math.random() * 9999999999)).toString()} className={inAdress ? 'flex-adress' : 'flex-selector'}>
            <label  for={item}>{item} </label>
            <select  onChange={(e) => { e.preventDefault(); funtions(e) }} className={classN} name={item} id={item} defaultChecked={false} required={required} >
                <option  disabled selected>{objStrings.selector[item]}</option>
                {items.map((key, i) => {
                    return (<option  id={`iesd-${i}`} onSelect={(e) => { e.preventDefault(); funtions(key) }} value={key.id}>{`${key.datosPersonales.nombre} ${key.datosPersonales.apellido.split(' ')[0]}`}</option>)

                })}
            </select>
        </div>
    )
}
export default SelectorVendedores