const Liqui = (props) => {
    const { deuda = {
        deuda: 0,
        interes: 0,
        actual: 0,
        mes: 0,
        historial: [],
        valorAbono: 0,
        abonoCapital: 0,
        interesDeuda: 0,

    }, setDeuda = console.log, mesSiguente = console.log, abonoCapital = console.log, handle = console.log, crearCredito = console.log } = props
    return (
        <div className="row">
            <div className="liquidar">
                <h1>Deuda : {deuda.deuda}</h1>
                <h1>Deuda Actual : {deuda.actual}</h1>
                <h2>Interes prestamo : {(deuda.interes)} %</h2>
                <h2>Año- {deuda.mes / 12 >= 1 ? parseInt(deuda.mes / 12) : 0}</h2>

                <h2>Mes- {deuda.mes - (parseInt(deuda.mes / 12) * 12)+1}</h2>
                <h2> Interes Deuda : {deuda.interesDeuda},
                    <h3>Valor abono : {deuda.valorAbono}</h3>
                </h2>
                {deuda.mes === -1 && <><input type={'number'} placeHolder={'deuda'} value={deuda.deuda} onChange={handle} id={'deuda'} />deuda</>}
                {deuda.mes === -1 && <><input type={'number'} placeHolder={'Interes prestamo'} value={deuda.interes} onChange={handle} id={'interes'} />{'Interes prestamo'}</>}
                {deuda.mes > -1 && <><input type={'number'} value={deuda.valorAbono} onChange={handle} id={'valorAbono'} min={deuda.interesDeuda}  defaultValue={deuda.interesDeuda}/>valorAbono</>}
                {deuda.actual > 0 && deuda.mes > -1 && <button id={'elemto2'} onClick={(e) => { e.preventDefault(); abonoCapital() }}>ABONO</button>}
                <button id={'elemto1'} onClick={(e) => { e.preventDefault(); deuda.actual !== 0 && deuda.mes > -1 ? mesSiguente() : crearCredito() }}>{deuda.mes > -1 ? 'mesSiguente' : 'crearCredito'}</button>
                <button onClick={(e) => {
                    e.preventDefault(); setDeuda({
                        deuda: 0,
                        interes: 0,
                        actual: 0,
                        mes: -1,
                        historial: [],
                        valorAbono: 0,
                        abonoCapital: 0,
                        interesDeuda: 0,

                    })
                }}>REINICIAR</button>

            </div>
            <div className="row-table"> <table>
                <tr id={`dataA1-${'1'}`}>
                    <th id={`dataA2-${'2'}`}>{'tipo'}</th>
                    <th id={`dataA2-${'2'}`}>{'mes'}</th>
                    <th id={`dataA3-${'3'}`}>{'actual'}</th>
                    <th id={`dataA4-${'4'}`}>{'interesDeuda'}</th>
                    <th id={`dataA4-${'4'}`}>{'Valor Abono'}</th>
                </tr>
                {deuda.historial.map((key, i) => {
                    return (
                        <>
                            <tr id={`data1-${i}`}>
                                <td id={`data2-${i}`}>{key.tipo}</td>
                                <td id={`data2-${i}`}>{key.mes}</td>
                                <td id={`data3-${i}`}>{key.actual}</td>
                                <td id={`data4-${i}`}>{key.interesDeuda}</td>
                                <td id={`data4-${i}`}>{key.tipo==='Abono'?key.valorAbono:'no aplica'}</td>

                            </tr>
                        </>

                    )
                })}
            </table></div>
           

        </div>)
}
export default Liqui