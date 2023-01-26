import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const NavMenu = (props) => {
    const { objStrings = objStringsInit, userData = userStructure, setUserData = console.log, setMenuOpen = console.log, objCss = objCssInit, cleanUserData = console.log } = props
    return (
        <div id="nav-menu-div">

            <div id="nav-menu-abs" className="column-abs">
                {
                    userData.type !=='adminUser' && userData.permisions.console && <p id="nav-menu-opt-0" onClick={(e) => { e.preventDefault(); setUserData('changeType', 'adminUser'); setMenuOpen(false) }}>{objStrings.navBar.menu.console}</p>

                }
                {
                    userData.type !=='operativeUser' && userData.permisions.logistica && <p id="nav-menu-opt-1" onClick={(e) => { e.preventDefault(); setUserData('changeType', 'operativeUser'); setMenuOpen(false) }}>{objStrings.navBar.menu.logistic}</p>

                }
                {
                    userData.type !=='clientUser' && userData.permisions.empresas && <p id="nav-menu-opt-2" onClick={(e) => { e.preventDefault(); setUserData('changeType', 'clientUser'); setMenuOpen(false) }}>{objStrings.navBar.menu.empresas}</p>

                }
                {
                    userData.type !=='vendedor' && <p id="nav-menu-opt-3" onClick={(e) => { e.preventDefault(); setUserData('changeType', 'vendedor'); setMenuOpen(false) }}>{objStrings.navBar.menu.vendedores}</p>

                }
                {
                    userData.type !=='newUser' && <p id="nav-menu-opt-3" onClick={(e) => { e.preventDefault(); setUserData('changeType', 'newUser'); setMenuOpen(false) }}>{objStrings.navBar.menu.page}</p>

                }
                <p id="nav-menu-opt-4" onClick={(e) => { e.preventDefault(); cleanUserData(); setMenuOpen(false) }}> {objStrings.navBar.menu.logOut}</p>

            </div>
        </div>
    )
}

export default NavMenu