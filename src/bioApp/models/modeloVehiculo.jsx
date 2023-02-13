import { HorarioObj } from "./modeloObra"
import { HorarioVehiculo } from "./modeloShedule"

export const ModeloDatosTomador = {
    nombre: '',
    apellidos: '',
    telefono: '',
    documento: '',
    tipoDePersona: ''
}
export const ModeloDatosSeguros = {
    seguroAlDia: false,
    fechaDeVencimientoSeguro: new Date(),
    fechaDeInicioSeguro: new Date(),
    empresaAseguradora: '',
    datosTomador: ModeloDatosTomador,
    poliza: '',
}

export const ModeloSegurosVehiculo = {
    soat: ModeloDatosSeguros,
    mecanico: ModeloDatosSeguros,
    terceros: ModeloDatosSeguros,
    rastreo: ModeloDatosSeguros

}
export const ModeloMatriculaVehiculo = {
    placa: '',
    marca: '',
    cilindraje: Number(),
    chasis: '',
    pesoMax: Number(),
    numeroMatricula: '',
    cantidadPasajeros: Number(),
    color: String(),
    lugarMatricula: '',
    fechaMatricula: []
}
export const ModeloLegalVehiculo = {
    propietario: ModeloDatosTomador,
    ...ModeloMatriculaVehiculo
}
export const ModeloSemanaVehiculo = {
    dias: HorarioVehiculo,
    historial: [],
    novedades: []
}
export const ModeloOperativoVehiculo = {
    estado: '',
    activo: false,
    rutaActual: '',
    programacionSemana: ModeloSemanaVehiculo
}
export const ModeloVehiculo = {
    id: '',
    datosSeguros: ModeloSegurosVehiculo,
    datosLegales: ModeloLegalVehiculo,
    datosOperativos: ModeloOperativoVehiculo,
    historial: [],
    servicios: [],
    conductores: [],
    rutas: [],
    novedades: [],
}
