import StringsObj, { UserObj } from "@/engine/content";
const objStringsInit = StringsObj()
const SelectComp = (props) => {
    const { inAdress = false, objStrings = objStringsInit, item = 'default', items = [], funtions = console.log, type = 'selector', placeHolder = '', id = '', required = true, children = '', classN = '', userData = { UserObj } } = props

    return (
        <div className={inAdress ? 'flex-adress' : 'flex-selector'}>
            <label for={item}>{item} </label>
            <select onChange={(e) => { e.preventDefault(); funtions(e) }} className={classN} name={item} id={item} defaultChecked={false} required={required} >
                <option disabled selected>{objStrings.selector[item]}</option>
                {items.map((key, i) => {
                    return <option onSelect={(e) => { e.preventDefault(); funtions(key) }} value={key}>{key}</option>

                })}
            </select>
        </div>
    )
}
export default SelectComp