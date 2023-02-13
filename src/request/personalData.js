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
export const EditPermisionData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.user,
        actionTodo: "editPermisionData",
        reqId: res
    });
}
export const EditCompanyPermisionData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.user,
        actionTodo: "editCompanyPermisionData",
        reqId: res
    });
}
export const EditSellPermisionData = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.user,
        actionTodo: "editCompanyPermisionData",
        reqId: res
    });
}
export const SendNewPerms = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': { id: props.id, permisions: props.permisions },
        actionTodo: "sendNewPerms",
        reqId: res
    });
}