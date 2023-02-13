export const SetObras = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setNewObra",
        reqId: res
    });
}
