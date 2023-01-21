
const BtnComp = (props) => {
    const { funtions = console.log, text = '', children = '', classN = '' } = props
    return (
        <button
            className={classN}
            onClick={(e) => {
                e.preventDefault();
                funtions(e)
            }}>
                {children}
                {text}
        </button>
    )

}
export default BtnComp