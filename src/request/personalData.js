export const PersonalData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "personalData-first",
        reqId: res
    });
}
export const ContactData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "contactData-first",
        reqId: res
    });
}
export const SendAllData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "allUserData",
        reqId: res
    });
}