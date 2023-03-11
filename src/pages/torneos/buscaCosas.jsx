import { useEffect } from "react"

const letras = [ ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const Bobada = (props) => {
    let ganarCarrerafullMatris = []
    for (let index = 0; index < letras.length; index++) {
        ganarCarrerafullMatris.push([])
        letras.map((key, i) => {
            const element = key;
            ganarCarrerafullMatris[index].push(element)
        })
    }
    const sheduleCreator = (array, father, valuesIn, letras, letrero) => {
        let resArray = []
        array.map((key, i) => {
            let ELetrero = letrero
            let letra = ''
            if (letras.length > 20) {
                ELetrero.push(letras)
                letra =`${key.item}` 
            } else {
                letra = `${letras}${key.item}` 
            }
            let newArreglo = []
            let newValues = key.values
            ganarCarrerafullMatris[key.position].map((keyMap, iMap) => {
                const keyMapVar =`${letra}${keyMap}` 
                newValues = key.values

                if (newValues.length < (ganarCarrerafullMatris[key.position].length * ganarCarrerafullMatris[key.position].length)) {
                    newValues.push(iMap)
                    newArreglo.push({ item: `${letra}${keyMap}`, position: iMap, values: newValues })
                    let resArrayReq = sheduleCreator(newArreglo, father, [], letra, ELetrero)
                    newValues.length + 1 < ganarCarrerafullMatris[key.position].length ? resArray.push(resArrayReq) : resArray.push({ item: `${keyMapVar}` , position: iMap, values: newValues, ELetrero: ELetrero })

                }
            })

        })
        return resArray
    }


    const sheduleCreators = (array, values = [], letras, father, letrero) => {
        let arrgelado = () => {
            let newArreglo = []
            array.map((key, i) => {
                key.map((keyM, iM) => {
                    let isInRuta = false
                    values.map((keyComp, iComp) => {
                        if (keyComp === i) {
                        }
                    })
                    if (iM === father) {
                        let valuesUsed = []
                        valuesUsed.push(father)
                        valuesUsed.push(i)
                        newArreglo.push({ item: `${keyM}`, position: i, values: valuesUsed, ELetrero: [] })
                    }
                })
            })
            return newArreglo
        }
        const elArreglo = arrgelado()

        const res = sheduleCreator(elArreglo, father, [], '', [])
        return res

    }
    let newToSearchE, resSearhE = []
    const Doit = () => {
        for (let index = 0; index < letras.length; index++) {
            newToSearchE = []
            newToSearchE.push(index)
            resSearhE.push(sheduleCreators(ganarCarrerafullMatris, newToSearchE, '', index))
        }
        let deLocos = []
        resSearhE.map((key, i) => {
            key.map((keyIna, iIna) => {
                keyIna.ELetrero.map((keyInb, iInb) => {
                    deLocos.push(keyInb)
                })
            })
        })
        let deCrazy = []

        deLocos.map((key, i) => {
            let locura = key.split(' ')
            if (locura.length > 0) {
                locura.map((keyI, iI) => {
                    if (keyI.length === 3) {
                        deCrazy.push(keyI)
                    }
                })
            }
        })
        console.log(deCrazy);
    }
    useEffect(() => {
        Doit()
    }, [])


    return (
        <>
            hola

        </>
    )
}
export default Bobada