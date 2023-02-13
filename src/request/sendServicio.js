export const SetServicio = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setNewServicio",
        reqId: res
    });
}
