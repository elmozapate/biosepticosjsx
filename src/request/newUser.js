export const NewUser = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "newUser",
        reqId: res
    });
}
