export const AskBioseptico = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askBiosepticos",
        reqId: res
    });
}
