import Head from 'next/head'
import Image from 'next/image'
import Declaraciones from '@/engine/declaraciones'
import UserCheck from '@/engine/userCheck'
import { useEffect, useState } from 'react';
import MobileDetect from "mobile-detect";


let off = true
export default function Home() {
/*   const userIn = getCookie('user')
 */  const [usersArray, setUsersArray] = useState({ array: [] })
  const [onMobil, setOnMobil] = useState({ state: false, device: { iPhone: false, android: false, tablet: false, phone: false, mobile: false } })



  useEffect(() => {
    if (off) {
      let isMobile = new MobileDetect(navigator.userAgent)
      document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      }, false);
      if ((isMobile.is('iPhone') || isMobile.is('Android') || isMobile.tablet() !== null || isMobile.phone() !== null || isMobile.mobile() !== null)) {
        setOnMobil({ state: true, device: { iPhone: isMobile.is('iPhone'), android: isMobile.is('Android'), tablet: isMobile.tablet() !== null, phone: isMobile.phone() !== null, mobile: isMobile.mobile() !== null } })
      }
      off = false
    }

  }, [off])
  return (
    <>
      <Head>
        <title>Biosepticos App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={'div-main '}>


        <UserCheck onMobil={onMobil} usersArray={usersArray} setUsersArray={setUsersArray} />
      </main>
    </>
  )
}
