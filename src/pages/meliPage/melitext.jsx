
import { useEffect, useState } from 'react'

const MeliText = (props) => {
    const mensajes = ['Hola Meli', 'Sabes algo....', 'Lo que te digo no es mentira, no quiero ser otro contigo', 'Me haces mucho bien', 'ademas....', 'te lo confesare', 'Me gustas mucho', 'te quiero en mi vida, como amiga  siempre', 'y ojala tambien como amantes, lo demas dejemoslo al destino', 'pase muy rico en amaga', ' Quieres que te haga un Blog, asi el mundo sabra lo mamacita que eres XD']
    const [usersArray, setUsersArray] = useState(0)
    setInterval(() => {
        if (mensajes.length > usersArray + 1) {
            const index = usersArray + 1
            setUsersArray(index)
        } else {
            setUsersArray(-1)
        }

    }, 5000);

    return (
        <>
            <div className='melipage'>
                {
                    usersArray !== -1 ? <p>{mensajes[usersArray]}</p>
                        : <p>Mamacita MUAKSS</p>
                }
            </div>

        </>
    )
}
export default MeliText