
const BtnComp = (props) => {
    const { inSending = false, funtions = console.log, text = '', children = '', classN = '' } = props
    return (
        <>
            {
                inSending
                    ?
                    <>ENVIANDO::::</>
                    :
                    <button
                        className={classN}
                        onClick={(e) => {
                            e.preventDefault();
                            funtions(e)
                        }}>
                        {children}
                        {text}
                    </button>
            }
        </>

    )

}
export default BtnComp