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
        type: 'newUser',
        permisions: {
            console: false,
            logistica: false,
            configuracion: false,
            empresas: false,
            vendedores: false,
        },
        nombre: '',
        status: 'unRegistered',
        password: '',
        passwordRepeat: '',
        dataRequired: true,
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