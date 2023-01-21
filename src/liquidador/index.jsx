import { useEffect, useState } from "react"
import Liqui from "./liquid"

const Liquidador = (props) => {

    let elemto1 = true
    let elemto2 = true
    const [deuda, setDeuda] = useState({
        deuda: 0,
        interes: 0,
        actual: 0,
        mes: -1,
        historial: [],
        valorAbono: 0,
        abonoCapital: 0,
        interesDeuda: 0,
        simulacion: false
    })

    const crearCredito = () => {
        const newHstorial = [{
            tipo: 'Inicio Prestamo',
            actual: parseFloat(parseFloat(deuda.deuda)) + (parseFloat(deuda.deuda / 100) * parseFloat(deuda.interes)),
            valorAbono: 0,
            interesDeuda: (parseFloat(deuda.deuda / 100) * parseFloat(deuda.interes)),
        }]
        setDeuda({
            ...deuda,
            actual: parseFloat(parseFloat(deuda.deuda)) + (parseFloat(deuda.deuda / 100) * parseFloat(deuda.interes)),
            mes: deuda.mes + 1,
            interesDeuda: (parseFloat(deuda.deuda / 100) * parseFloat(deuda.interes)),
            historial: newHstorial,

        })

    }
    const mesSiguente = () => {
        elemto1 = document.getElementById('elemto1')
        elemto2 = document.getElementById('elemto2')
        const newDeuda = parseFloat(parseFloat(deuda.actual)) + (parseFloat(deuda.actual / 100) * parseFloat(deuda.interes))
        let newHstorial = deuda.historial
        const newDAta = {
            valorAbono: 0,
            tipo: 'Mes nuevo',
            actual: newDeuda > 0 ? newDeuda : 0,
            mes: deuda.mes + 1,
            interesDeuda: (parseFloat(deuda.actual / 100) * parseFloat(deuda.interes)),
        }

        newHstorial.push(newDAta)
        setDeuda({
            ...deuda,
            actual: newDeuda > 0 ? newDeuda : 0,
            mes: deuda.mes + 1,
            interesDeuda: (parseFloat(deuda.actual / 100) * parseFloat(deuda.interes)),
            historial: newHstorial
        })
        if (deuda.simulacion) {

            setTimeout(() => {
                try {
                    elemto2.click()

                } catch (error) {
                    console.log('listo');
                }
            }, 300);
        }
    }
    const handle = (e) => {
        e.preventDefault();
        const id = e.target.id
        const value = e.target.value
        setDeuda({
            ...deuda,
            [id]: !isNaN(parseFloat(value)) && parseFloat(value) >= 0 ? parseFloat(value) : 0
        })
    }
    const abonoCapital = () => {
        let newHstorial = deuda.historial
        elemto1 = document.getElementById('elemto1')
        elemto2 = document.getElementById('elemto2')
        const newDAta = {
            tipo: 'Abono',
            mes: deuda.mes,
            actual: parseFloat(deuda.actual) - deuda.valorAbono,
            interesDeuda: (deuda.interesDeuda),
            valorAbono: (deuda.valorAbono),
        }
        newHstorial.push(newDAta)

        setDeuda({
            ...deuda,
            actual: parseFloat(deuda.actual - deuda.valorAbono),
            valorAbono: deuda.simulacion ? deuda.valorAbono : 0
        })
        if (deuda.simulacion) {
            setTimeout(() => {
                try {
                    elemto1.click()

                } catch (error) {
                    console.log('listo');
                }
            }, 300);
        }



    }
    const simulacion = () => {
        elemto2 = document.getElementById('elemto2')
        let oldValue = deuda
        if (oldValue.simulacion) {

        } else {
            oldValue.simulacion = true

        }
        setDeuda(oldValue)
        elemto2.click()
    }
    let nownow = true
    useEffect(() => {
        if (deuda.actual > 0 && deuda.mes > -1 && nownow) {


            nownow = false
        }
    }, [])
    return (
        <>
            <Liqui deuda={deuda} setDeuda={setDeuda} abonoCapital={abonoCapital} mesSiguente={mesSiguente} simulacion={simulacion} crearCredito={crearCredito} handle={handle} />
        </>
    )


}
export default Liquidador