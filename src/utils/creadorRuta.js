
export function createContact(contact = {}) {
    return {
        obra: contact.obra || "Sin nombre",
        nombre: contact.nombre || "Sin nombre",
        cargo: contact.cargo || "Sin nombre",
        avatar: {
            withPhoto: contact.avatar?.withPhoto ?? false,
            url: contact.avatar?.url || ""
        },
        correoElectronico: contact.correoElectronico || "Sin nombre",
        telefonoPrincipal: contact.telefonoPrincipal || "22222",
        telefonoSecundario: contact.telefonoSecundario || 0,
        direccion: {
            departamento: contact.direccion?.departamento || "",
            ciudad: contact.direccion?.ciudad || "",
            barrio: contact.direccion?.barrio || "",
            primerNumDireccion: contact.direccion?.primerNumDireccion || 0,
            segundoNumDireccion: contact.direccion?.segundoNumDireccion || 0,
            viaSelecionada: contact.direccion?.viaSelecionada || "",
            primerLetra: contact.direccion?.primerLetra || "",
            segundaLetra: contact.direccion?.segundaLetra || "",
            numero: contact.direccion?.numero || 0,
            otros: contact.direccion?.otros || "mnarique ",
            tipoDeZona: contact.direccion?.tipoDeZona || "",
            telefono: contact.direccion?.telefono || 0,
            letra: contact.direccion?.letra || "",
            coordenadas: {
                lat: contact.direccion?.coordenadas?.lat ?? false,
                lng: contact.direccion?.coordenadas?.lng ?? false
            }
        }
    };
}


export function createDireccion(direccion = {}) {
    return {
        departamento: direccion.departamento || "",
        ciudad: direccion.ciudad || "",
        barrio: direccion.barrio || "",
        primerNumDireccion: direccion.primerNumDireccion || 0,
        segundoNumDireccion: direccion.segundoNumDireccion || 0,
        viaSelecionada: direccion.viaSelecionada || "",
        primerLetra: direccion.primerLetra || "",
        segundaLetra: direccion.segundaLetra || "",
        numero: direccion.numero || 0,
        otros: direccion.otros || "mnarique ",
        tipoDeZona: direccion.tipoDeZona || "",
        telefono: direccion.telefono || 0,
        letra: direccion.letra || "",
        coordenadas: {
            lat: direccion.coordenadas?.lat ?? false,
            lng: direccion.coordenadas?.lng ?? false
        }
    };
}

export function createHorarios(horarios = {}) {
    const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
    ];

    const base = {};
    dias.forEach(dia => {
        base[dia] = {
            state: horarios[dia]?.state ?? false,
            horario: horarios[dia]?.horario || {}
        };
    });

    return base;
}

export function createLegal(legal = {}) {
    return {
        fechaDeCreacion: legal.fechaDeCreacion || new Date().toISOString(),
        documento: legal.documento || "1128395070",
        representante: {
            id: legal.representante?.id || "",
            app: {
                user: legal.representante?.app?.user || "",
                email: legal.representante?.app?.email || "",
                type: legal.representante?.app?.type || "",
                password: legal.representante?.app?.password || "",
                fechaDeCreacion:
                    legal.representante?.app?.fechaDeCreacion ||
                    new Date().toString(),
                creadoPor: legal.representante?.app?.creadoPor || "",
                data: {
                    personal: legal.representante?.app?.data?.personal ?? false,
                    contacto: legal.representante?.app?.data?.contacto ?? false
                },
                relationed: {
                    biosepticos: legal.representante?.app?.relationed?.biosepticos || [],
                    empresas: legal.representante?.app?.relationed?.empresas || [],
                    ventas: legal.representante?.app?.relationed?.ventas || [],
                    obras: legal.representante?.app?.relationed?.obras || [],
                    servicios: legal.representante?.app?.relationed?.servicios || []
                },
                permisions: {
                    console: legal.representante?.app?.permisions?.console ?? false,
                    logistica: legal.representante?.app?.permisions?.logistica ?? false,
                    bioseptico: legal.representante?.app?.permisions?.bioseptico ?? false,
                    empresas: legal.representante?.app?.permisions?.empresas ?? false,
                    vendedores: legal.representante?.app?.permisions?.vendedores ?? false
                }
            },
            userObj: {
                appType: legal.representante?.userObj?.appType || "",
                type: legal.representante?.userObj?.type || "newUser",
                token: legal.representante?.userObj?.token || "",
                permisions: {
                    console: legal.representante?.userObj?.permisions?.console ?? false,
                    logistica: legal.representante?.userObj?.permisions?.logistica ?? false,
                    bioseptico: legal.representante?.userObj?.permisions?.bioseptico ?? false,
                    empresas: legal.representante?.userObj?.permisions?.empresas ?? false,
                    vendedores: legal.representante?.userObj?.permisions?.vendedores ?? false
                },
                nombre: legal.representante?.userObj?.nombre || "",
                status: legal.representante?.userObj?.status || "unRegistered",
                password: legal.representante?.userObj?.password || "",
                passwordRepeat: legal.representante?.userObj?.passwordRepeat || "",
                dataRequired: legal.representante?.userObj?.dataRequired ?? true,
                emailConfirmation:
                    legal.representante?.userObj?.emailConfirmation ?? false,
                id: legal.representante?.userObj?.id || "",
                avatar: {
                    withPhoto:
                        legal.representante?.userObj?.avatar?.withPhoto ?? false,
                    url: legal.representante?.userObj?.avatar?.url || ""
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
                    ...legal.representante?.userObj?.appPermisions
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
                    ...legal.representante?.userObj?.companyPermisions
                },
                sellPermisions: {
                    inicio: true,
                    clientes: false,
                    servicios: false,
                    rutas: false,
                    novedades: false,
                    ventas: false,
                    historial: false,
                    requerimientos: false,
                    ...legal.representante?.userObj?.sellPermisions
                }
            },
            datosPersonales: {
                nombre: legal.representante?.datosPersonales?.nombre || "",
                apellido: legal.representante?.datosPersonales?.apellido || "",
                fechaDeNacimiento:
                    legal.representante?.datosPersonales?.fechaDeNacimiento ||
                    new Date().toISOString(),
                genero: legal.representante?.datosPersonales?.genero || "",
                nacionalidad: legal.representante?.datosPersonales?.nacionalidad || "",
                tipoDeDocumento:
                    legal.representante?.datosPersonales?.tipoDeDocumento || "",
                numeroDeDocumento:
                    legal.representante?.datosPersonales?.numeroDeDocumento || 0
            },
            datosContacto: {
                correoElectronico:
                    legal.representante?.datosContacto?.correoElectronico || "",
                telefonoPrincipal:
                    legal.representante?.datosContacto?.telefonoPrincipal || 0,
                telefonoSecundario:
                    legal.representante?.datosContacto?.telefonoSecundario || 0,
                direccion: {
                    departamento:
                        legal.representante?.datosContacto?.direccion?.departamento || "",
                    ciudad: legal.representante?.datosContacto?.direccion?.ciudad || "",
                    barrio: legal.representante?.datosContacto?.direccion?.barrio || "",
                    primerNumDireccion:
                        legal.representante?.datosContacto?.direccion?.primerNumDireccion ||
                        0,
                    segundoNumDireccion:
                        legal.representante?.datosContacto?.direccion
                            ?.segundoNumDireccion || 0,
                    viaSelecionada:
                        legal.representante?.datosContacto?.direccion?.viaSelecionada || "",
                    primerLetra:
                        legal.representante?.datosContacto?.direccion?.primerLetra || "",
                    segundaLetra:
                        legal.representante?.datosContacto?.direccion?.segundaLetra || "",
                    numero: legal.representante?.datosContacto?.direccion?.numero || 0,
                    otros: legal.representante?.datosContacto?.direccion?.otros || "",
                    tipoDeZona:
                        legal.representante?.datosContacto?.direccion?.tipoDeZona || "",
                    telefono: legal.representante?.datosContacto?.direccion?.telefono || 0,
                    letra: legal.representante?.datosContacto?.direccion?.letra || "",
                    coordenadas: {
                        lat:
                            legal.representante?.datosContacto?.direccion?.coordenadas?.lat ||
                            0,
                        lng:
                            legal.representante?.datosContacto?.direccion?.coordenadas?.lng ||
                            0
                    }
                }
            },
            historial: legal.representante?.historial || []
        },
        contratos: legal.contratos || [],
        cartera: {
            maximo: legal.cartera?.maximo || 20000000,
            cartera: legal.cartera?.cartera || 0,
            historial: legal.cartera?.historial || []
        },
        vendedor: legal.vendedor || "1234567890"
    };
}

export class Obra {
    constructor(data = {}) {
        this.type = data.type || "obra";
        this.id = data.id || `OBRA-${Date.now()}-${Math.floor(Math.random() * 9999999999)}`;
        this.nombre = data.nombre || "Sin nombre";
        this.dataRequired = data.dataRequired ?? true;
        this.fechaDeCreacion = data.fechaDeCreacion || new Date().toString();
        this.empresa = data.empresa || "";
        this.contact = createContact({ ...data.contact, obra: data.nombre || "Sin nombre"});
        this.direccion = createDireccion(data.direccion);
        this.horarios = createHorarios(data.horarios);
        this.historial = data.historial || [];
        this.novedades = data.novedades || [];
        this.servicios = data.servicios || [];
        this.requerimientos = data.requerimientos || [];
        this.legal = createLegal(data.legal);
        this.idUser = data.idUser || "";
    }

    // ===== Métodos útiles =====

    toJSON() {
        return { ...this };
    }

    static fromJSON(json) {
        return new Obra(json);
    }

    agregarNovedad(novedad) {
        this.novedades.push(novedad);
    }

    agregarServicio(servicio) {
        this.servicios.push(servicio);
    }

    agregarRequerimiento(req) {
        this.requerimientos.push(req);
    }

    actualizarContacto(contact) {
        this.contact = createContact(contact);
    }

    actualizarDireccion(direccion) {
        this.direccion = createDireccion(direccion);
    }

    actualizarLegal(legal) {
        this.legal = createLegal(legal);
    }
}