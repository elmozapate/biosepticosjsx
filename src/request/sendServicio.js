
export const SetServicio = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        id: props.id,
        actionTodo: "setNewServicio",
        reqId: res
    });

}

export const EditServicios = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "editServicios",
        reqId: res
    });

}
