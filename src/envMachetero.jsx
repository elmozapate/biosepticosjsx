export const EnvM = () => {
    /*
     MODOS  Front/back
    1 => locallocal
    2 => localDev
    3 => Devlocal
    4 => DevDev
     */
    const mode=2  /* COLOCAR EL NUMERO DEL MODO */
    const ambiente = mode === 1 ? 'locallocal' : mode === 2 ? 'localDev' : mode === 3 ? 'Devlocal' : mode === 4 ? 'DevDev' : 'bad'
    const HostBack = ambiente === 'locallocal' ? 'http://localhost:3002/' : ambiente === 'localDev' ? "https://swift-lands-care-191-156-34-228.loca.lt/" : ambiente === 'Devlocal' ? 'http://localhost:3002/' : ambiente === 'DevDev' ? "https://swift-lands-care-191-156-34-228.loca.lt/" : 'bad'
    const HostBackEnd = ambiente === 'locallocal' ? 'http://localhost:3001' : ambiente === 'localDev' ? 'https://swift-lands-care-191-156-34-228.loca.lt/' : ambiente === 'Devlocal' ? 'http://localhost:3001' : ambiente === 'DevDev' ? 'https://swift-lands-care-191-156-34-228.loca.lt/' : 'bad'
    const HostFront = ambiente === 'locallocal' ? 'http://localhost:3000/' : ambiente === 'localDev' ? 'http://localhost:3000/' : ambiente === 'Devlocal' ? 'https://super-app-liard.vercel.app/' : ambiente === 'DevDev' ? "https://super-app-liard.vercel.app/" : 'bad'
    const envMachete = {
        hostBack: HostBack,
        hostFront: HostFront,
        hostBackProto:HostBackEnd
    }
    return envMachete
}
export default EnvM