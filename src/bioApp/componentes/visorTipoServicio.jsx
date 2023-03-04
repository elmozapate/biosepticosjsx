
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorTipoServicio = (props) => {
    const { empresas = { array: [] }, willShow = console.log, showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const verLaEmpresa = (cliente) => {
        let elname = 'sinnombreaun'
        console.log(cliente);

        empresas.array.map((key, i) => {
            if (key.id === cliente) {
                console.log(key.contact.nombre);
                elname = key.contact.nombre
            }
        })
        return elname

    }
    return (
        <>
            <div id={`idShow-${parseInt(Math.random() * 9999)}`} className='container-bio' onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>

                <div className="dia">
                    <p className="centert flex-p-between">
                        <span className="treintraytres">{'CLIENTE'}</span>

                        <span className="treintraytres">{'SERVICIO'}</span>
                        <span className="treintraytres">{'ESTADO'}</span></p>

                    {showed.map((key, i) => {
                        return (
                            <>
                                <p className="centert flex-p-between ">
                                    <span className="treintraytres">{verLaEmpresa(key.empresa)}</span>
                                    <span className="treintraytres"  >
                                        <span>{key.tipoDeServicio.tipo}</span>
                                        <span>{key.tipoDeServicio.cantidad}{key.tipoDeServicio.tipo !== 'Alquiler de baños' ? ' Lt' : 'unidades'}</span>
                                    </span>
                                    <span className="treintraytres">
                                        <span>{key.shedule.estado}</span>
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
export default VisorTipoServicio