const StringsObj = () => {
    return {
        main: '',
        homePage: {
            intro: ''
        },
        app: {
            intro: ''
        },
        dashBoard: {
            intro: ''
        },
        navBar: {
            menu: {
                console:'',
                logistic:'',
                config:'',
                page:'',
                logOut:''
            }
        }
    }
}
export const UserObj = () => {
    return {
        type: 'newUser',
        permisions: {
            console: false,
            logistica: false,
            configuracion: false
        },
        nombre: '',
        status: 'unRegistered',
        password: '',
        passwordRepeat: '',
        avatar:{
            withPhoto:false,
            url:''
        },
        appPermisions:{
            inicio: true,
            clientes: false,
            servicios: false,
            vehiculos: false,
            personalLogistico: false,
            rutas: false,
            novedades: false,
            historial: false,
            requerimientos: false,
            vendedores: false,
        }

    }
}
export const PopUpObj = () => {
    return {
        type: '',
        funtions: {},
        name: '',
        active: false

    }
}
export default StringsObj