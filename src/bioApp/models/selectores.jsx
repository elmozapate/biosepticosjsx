export const nacionalidad = ["Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", "República Checa", "República de Macedonia", "República del Congo", "República Democrática del Congo", "República Dominicana", "República Sudafricana", "Ruanda", "Rumanía", "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"];
export const generos = ['m', 'f', 'no-binario', 'aDiario']
export const tipoDeDocumento = ['cedula', 'tarjetaDeIdentidad', 'pasaporte', 'cedulaDeExtranjeria']
export const sectores = ['Agricultura', 'Alimentación', 'Comercio', 'Construcción', 'Educación', 'Fabricación de material', 'Función pública', 'Hotelería', 'Industrias químicas', 'Ingenieria mecánica y eléctria', 'Medios de comunicación', 'Minería', 'Petroleo y producción de gas', 'Producción de metales básicos', 'Servicios de correos y de telecomunicaciones', 'Servicios de salud', 'Servicios financieros', 'servicios profesionales', 'Servicios públicos', 'Silvicultura', 'Textiles', 'Transporte terrrestre']
export const TipoDeServicios = ['Alquiler de baños', 'Servicio Retiro Materia Organica ']
export const TipoDeServiciosFull = [{ item: 'Alquiler de baños', costo: 400000 }, { item: 'Servicio Retiro Materia Organica ', costo: 20000 }]
export const SemanaArray = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
export const EstadosServicios = ['all', 'pending', 'active', 'inactive', 'done', 'verification']
export const EstadosUser = ['all', 'conductores', 'auxiliares', 'administrativo', 'operativo']
export const EstadosServiciosObj = {
    active: false,
    array: [],
    sort: 'all',
    all: { many: 0, array: [] },
    conductores: { many: 0, array: [] },
    auxiliares: { many: 0, array: [] },
    administrativo: { many: 0, array: [] },
    operativo: { many: 0, array: [] },
    verification: { many: 0, array: [] },

}
export const EstadosUsersObj = {
    active: false,
    array: [],
    sort: 'all',
    all: { many: 0, array: [] },
    conductores: { many: 0, array: [] },
    auxiliares: { many: 0, array: [] },
    administrativo: { many: 0, array: [] },
    operativo: { many: 0, array: [] },

}
export const EstadosServiciosObjShort = {
    all: { many: 0, array: [] },
    pending: { many: 0, array: [] },
    active: { many: 0, array: [] },
    inactive: { many: 0, array: [] },
    done: { many: 0, array: [] },
    verification: { many: 0, array: [] },

}
export const EstadosUsersObjShort = {
    all: { many: 0, array: [] },
    conductores: { many: 0, array: [] },
    auxiliares: { many: 0, array: [] },
    administrativo: { many: 0, array: [] },
    operativo: { many: 0, array: [] },

}
const EmptyReturn = () => {
    return (
        <>
        </>
    )
}
export default EmptyReturn