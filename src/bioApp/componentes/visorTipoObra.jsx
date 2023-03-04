
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorTipoObra = (props) => {
    const { willShow = console.log, showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div id={`idShow-${parseInt(Math.random() * 9999)}`} className='container-bio' onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>

                <div className="dia">
                    <p className="centert flex-p-between">
                        <span className="treintraytres">{'Nombre'}</span>
                        <span className="treintraytres">{'contacto'}</span>
                        <span className="treintraytres">{'zona'}</span></p>

                    {showed.map((key, i) => {
                        return (
                            <>
                                <p className="centert flex-p-between ">
                                    <span className="treintraytres"><h2>{key.contact.obra}</h2> </span>
                                    <span className="treintraytres"  >
                                        <span>-{key.contact.nombre}</span>
                                        <span className="pointer">ver info</span>
                                    </span>
                                    <span className="treintraytres">
                                        <span>{key.direccion.ciudad}-{key.direccion.barrio}</span>
                                        <span className="pointer">mas</span>
                                    </span>
                                </p>
                            </>
                        )
                    })}
                </div>

            </div>

        </>
    )
}
export default VisorTipoObra