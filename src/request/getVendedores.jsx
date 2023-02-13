export const GetVendedores = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askVendedores",
        reqId: res
    });
}