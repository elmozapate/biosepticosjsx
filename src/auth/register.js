export const RegisterAuth =  (userData,users={array:[]}) => {
    let found = 0
    users.array.map((key, i) => {
        if (key.nombre === userData.nombre ) {
            found = 1
        }
    })
    return found


}

export const SendNewPasword=(socket,props,res)=>{
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "changePasswordReq",
        reqId: res
    });

}