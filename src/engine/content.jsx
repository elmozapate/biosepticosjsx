const StringsObj = () => {
    return {
        main: '',
        homePage: {
            intro: ''
        },
        app: {
            introBio:'',
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
                logOut: '',
                bioseptico:''
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
            calendario: false,
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
export const DayShedule = (day, week, elMes, diaAentrar) => {
    const hoyEs = parseInt(diaAentrar) === parseInt((new Date(day).toLocaleDateString()).split('/')[0]) ? true : false
    return {
        hoy: hoyEs, 
        fecha:(new Date(day)).setDate((parseInt(new Date(day).getDate()-1))) , 
        año: day !== '' ? day.toString().split(' ')[3] : 'off',
        semanaMes: week,
        mes: elMes,
        dia: day !== '' ? day.toString().split(' ')[2] : 'off',
        totalServicios: Number(),
        serviciosActivos: Number(),
        serviciosPendientes: Number(),
        serviciosRealizados: Number(),
        servicios: [],
        historial: [],
        rutas: [],
        novedades: []
    }
}
export const laSemana = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','servicios']
export const WeekShedule = (enSemanas, week = Number(), semana, elMes = Number(), diaAentrar) => {
    let semanaRes = {
        numSemana: parseInt(enSemanas),
        semanaMes: parseInt(week),
        dias: [DayShedule(semana['Mon'], week, elMes, diaAentrar), DayShedule(semana['Tue'], week, elMes, diaAentrar), DayShedule(semana['Wed'], week, elMes, diaAentrar), DayShedule(semana['Thu'], week, elMes, diaAentrar), DayShedule(semana['Fri'], week, elMes, diaAentrar), DayShedule(semana['Sat'], week, elMes, diaAentrar), DayShedule(semana['Sun'], week, elMes, diaAentrar)], totalServicios: Number(),
        totalServicios: Number(),
        serviciosActivos: Number(),
        serviciosPendientes: Number(),
        serviciosRealizados: Number(),
        servicios: [],
        historial: [],
        novedades: []
    }
    return semanaRes
}
export const MonthShedule = (month = [], mes, añoAentrar, diaAentrar, semanas) => {
    let semanaMonth = {
        Mon: '',
        Tue: '',
        Wed: '',
        Thu: '',
        Fri: '',
        Sat: '',
        Sun: '',
    }
    let Month = []
    let enSemana = 1
    let enSemanas = semanas + 1
    for (let index = 0; index < month.length; index++) {
        const element = month[index];
        if (element) {
            semanaMonth[element.toString().split(' ')[0]] = element
            if (element.toString().split(' ')[0] === 'Sun' || index === month.length - 1) {

                Month.push(WeekShedule(enSemanas, enSemana, semanaMonth, mes, diaAentrar))
                enSemana = enSemana + 1
                enSemanas = enSemanas + 1
                semanaMonth = {
                    Mon: '',
                    Tue: '',
                    Wed: '',
                    Thu: '',
                    Fri: '',
                    Sat: '',
                    Sun: '',
                }
            }
        }
    }

    /*     let mes = [WeekShedule(1), WeekShedule(2), WeekShedule(3),WeekShedule(4),WeekShedule(5)]
     */
    return Month
}
export default StringsObj