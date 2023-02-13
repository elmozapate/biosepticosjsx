export const NewUser = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        id: props.id,
        actionTodo: "newUser",
        bioSepticos: false,
        reqId: res
    });
}
export const NewUserBio = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        props: props,
        id: props.id,
        actionTodo: "newUser",
        bioSepticos: true,
        reqId: res
    });
}
export const SendEmailCheck = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        id: props.id,
        actionTodo: "emailCheck",
        bioSepticos: true,
        reqId: res
    });
}