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
        companies: {
            firsTime_0: '',
            firsTime_1: '',
            dataForm: ''
        },
        navBar: {
            menu: {
                console: '',
                logistic: '',
                config: '',
                page: '',
                logOut: ''
            }
        },
        selector: {
            default: '',
            nacionalidad: '',
            genero: '',
            tipoDeDocumento: '',
        }
    }
}
export const UserObj = () => {
    return {
        appType: '',
        type: 'newUser',
        token: '',
        permisions: {
            console: false,
            logistica: false,
            bioseptico: false,
            empresas: false,
            vendedores: false,
        },
        nombre: '',
        status: 'unRegistered',
        password: '',
        passwordRepeat: '',
        dataRequired: true,
        emailConfirmation: false,
        id: '',
        avatar: {
            withPhoto: false,
            url: ''
        },
        appPermisions: {
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
        },
        companyPermisions: {
            inicio: true,
            empresa: true,
            obras: false,
            servicios: false,
            personalLogistico: false,
            rutas: false,
            novedades: false,
            historial: false,
            requerimientos: false,
            vendedores: false,
        },
        sellPermisions: {
            inicio: true,
            clientes: false,
            servicios: false,
            rutas: false,
            novedades: false,
            ventas: false,
            novedades: false,
            historial: false,
            requerimientos: false,
        }

    }
}
export const PopUpObj = () => {
    return {
        type: '',
        funtions: {},
        name: '',
        active: false,
        data: {}

    }
}
export default StringsObj