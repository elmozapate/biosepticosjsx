export const GetEmpresas = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "pedirEmpresas",
        reqId: res
    });
}
export const GetMisEmpresas = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askEmpresas",
        reqId: res
    });
}
export const GetMisObras = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askObras",
        reqId: res
    });
}
export const GetMisServicios = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askServicios",
        reqId: res
    });
}


export const GetMisEmpresasVendedor = (socket, props, res) => {
    socket.emit('bioSepticos', {
        dataIn: props.id,
        actionTodo: "askEmpresasVendedor",
        reqId: res
    });
}