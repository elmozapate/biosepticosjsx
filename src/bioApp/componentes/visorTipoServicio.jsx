
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorTipoServicio = (props) => {
    const { hoy = false, completarServicio = console.log, obras = { array: [] }, empresas = { array: [] }, willShow = console.log, listos = [], showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const verLaEmpresa = (cliente) => {
        let elname = 'sinnombreaun'
        empresas.array.map((key, i) => {
            if (key.id === cliente) {
                elname = key.contact.nombre
            }
        })
        return elname
    }
    const verLaObra = (obra) => {
        let elname = 'sinnombreaun'
        obras.array.map((key, i) => {
            if (key.id === obra) {
                elname = key.nombre
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
                        <span className={!hoy ? 'cincuenta' : "treintraytres"}>{'CLIENTE'}</span>
                        <span className={!hoy ? 'cincuenta' : "treintraytres"}>{'SERVICIO'}</span>
                        {hoy && <span className="treintraytres">{'ESTADO'}</span>}</p>

                    {showed.map((key, i) => {
                        return (
                            <>
                                <p className="centert flex-p-between ">
                                    <span className={!hoy ? 'cincuenta' : "treintraytres"}>{verLaEmpresa(key.empresa)} <br /> <span className="">{verLaObra(key.obra)}</span></span>
                                    <span className={!hoy ? 'cincuenta' : "treintraytres"}  >
                                        <span>{key.tipoDeServicio.tipo}</span>
                                        <span>{key.tipoDeServicio.cantidad}{key.tipoDeServicio.tipo !== 'Alquiler de baños' ? ' Lt' : 'unidades'}</span>
                                    </span>
                                    {hoy &&<span className={ "treintraytres"}>
                                        <span>{key.shedule.estado}</span>
                                        <span onClick={(e) => { e.preventDefault(); completarServicio(key, true) }} className="pointer">ENTREGAR</span>                                    </span>}
                                </p>
                            </>
                        )
                    })}
                    {!(listos.length > 0) ? <>SIN ACTVIVIDAD</> :
                        <>
                            COMPLETADOS
                            {listos.map((key, i) => {
                                return (
                                    <>
                                        <p className="bgColor-green centert flex-p-between ">
                                            <span className={!hoy ? 'cincuenta' : "treintraytres"}>{verLaEmpresa(key.empresa)} <br /> <span className="">{verLaObra(key.obra)}</span></span>

                                            <span className={!hoy ? 'cincuenta' : "treintraytres"}  >
                                                <span>{key.tipoDeServicio.tipo}</span>
                                                <span>{key.tipoDeServicio.cantidad}{key.tipoDeServicio.tipo !== 'Alquiler de baños' ? ' Lt' : 'unidades'}</span>
                                            </span>
                                            {hoy &&<span className={ "treintraytres"}>
                                                <span>{key.shedule.estado}</span>
                                                <span onClick={(e) => { e.preventDefault(); completarServicio(key, false) }} className="pointer">DESENTREGAR</span>
                                            </span>}
                                        </p>
                                    </>
                                )
                            })}</>}
                </div>

            </div>

        </>
    )
}
export default VisorTipoServicio