export const SetEmpresas = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setNewEmpresa",
        reqId: res
    });
}
