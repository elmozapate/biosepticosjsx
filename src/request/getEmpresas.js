export const GetEmpresas = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "pedirEmpresas",
        reqId: res
    });
}