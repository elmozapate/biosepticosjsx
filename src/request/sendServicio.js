
export const SetServicio = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        id: props.id,
        actionTodo: "setNewServicio",
        reqId: res
    });

}
