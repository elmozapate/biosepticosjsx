import Head from 'next/head'
import Image from 'next/image'
import MeliText from './melitext'

export default function Home(props) {
    const { usersArray = [], mensajes = {} } = props



    return (
        <>
            <Head>
                <title>Para Meli</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={'div-main'}>
                <MeliText /* usersArray={usersArray} */ /* mensajes={mensajes} */ />
                {/*    <div className='melipage'>
                    {
                        usersArray !== -1 ? <p>{mensajes[usersArray]}</p>
                            : <p>Mamacita MUAKSS</p>
                    }
                </div> */}

            </main>
        </>
    )
}