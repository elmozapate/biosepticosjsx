import Head from 'next/head'
import Image from 'next/image'
import Declaraciones from '@/engine/declaraciones'
import UserCheck from '@/engine/userCheck'
import { useState } from 'react'
import { setCookies, removeCookies, getCookie } from 'cookies-next';


export default function Home() {
/*   const userIn = getCookie('user')
 */  const [usersArray, setUsersArray] = useState({
  array: [{
    id: '1234567890',
    nombre: 'moet', password: '1234', permisions: {
      console: true,
      logistica: true,
      configuracion: true
    }, appPermisions: {
      inicio: true,
      clientes: true,
      servicios: true,
      vehiculos: true,
      personalLogistico: true,
      rutas: true,
      novedades: true,
      historial: true,
      requerimientos: true,
      vendedores: true,
    }, avatar: {
      withPhoto: false,
      url: ''
    },
    dataRequired: false,
    status: 'registered',


  }, {
    id: '0987654321',
    nombre: 'oscar', password: '1234', permisions: {
      console: false,
      logistica: true,
      empresas: true,
      vendedores: true
    },
    appPermisions: {
      inicio: true,
      clientes: true,
      servicios: true,
      vehiculos: true,
      personalLogistico: true,
      rutas: false,
      novedades: false,
      historial: false,
      requerimientos: false,
      vendedores: false,
    },
    avatar: {
      withPhoto: true,
      url: '/image/oscar.png'
    },
    dataRequired: false,
  }]
}
)
  return (
    <>
      <Head>
        <title>Biosepticos App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={'div-main'}>
        <UserCheck /* user={userIn} */ usersArray={usersArray} setUsersArray={setUsersArray} />
      </main>
    </>
  )
}
