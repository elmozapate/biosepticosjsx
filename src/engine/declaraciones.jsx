import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
const Declaraciones = (props) => {
    const { language = 'spanish', type = 'empty' } = props
    const styles = StylesObj()
    const text = StringsObj()
    let strings = {
        state: 'empty',
        styles: styles,
        text: text
    }
    switch (type) {
        case 'styles':
            switch (language) {
                case 'spanish':
                    strings.styles = {
                        main: 'div-main',
                        barraNav: {
                            main: 'nav-main',
                            logoContainer: 'nav-logo',
                            infoContainer: 'nav-userContain',
                            languageSelect: 'nav-languageSelect',
                            dataContainer: 'nav-userData',
                            menuActivator: 'nav-menuActivator',
                            photoContainer: 'nav-photoContainer',
                        },
                        absoluteBox: {
                            main: 'absolutedialog',
                            cardBox: 'absolutedialog_popout'
                        },
                        page: {
                            main: 'div-page'
                        },
                        forms: {
                            register: {
                                main: 'form-registro'
                            }
                        },
                        app: {
                            main: 'app-container',
                            cardContainer: 'app-cardContainer',
                            cardView: 'app-cardView',
                            sideContainer: 'app-sideContainer',
                            sideContainerOpen: 'app-sideContainer-open',
                            sideNav: 'app-sideNav',
                            sideNavOpen: 'app-sideNav-open',
                            smallViews: 'app-smallViews',
                            smallViewsSelected: 'app-smallViews-selected',
                            smallViewsOpen: 'app-smallViews-open',
                            sectionTitle: 'titles',
                            sectionTitleLeft: 'titles-left',
                            backButton: 'back-button'
                        },
                        dashBoard: {
                            main: 'dashBoard-main',
                            sectionContainer: 'dashBoard-section',
                            sectionContainerLarge: 'dashBoard-section-large',
                            sectionContainerCard: 'dashBoard-section-card',
                            sectionContainerCardLarge: 'dashBoard-section-card-large',
                            sectionContainerMenu: 'dashBoard-section-menu',
                            sectionContainerMenuLarge: 'dashBoard-section-menu-large',
                            sectionContainerMenuItem: 'dashBoard-section-menu-item',
                            sectionContainerMenuItemLarge: 'dashBoard-section-menu-item-large',
                            sectionContainerMenuItemSelected: 'dashBoard-section-menu-item-selected',
                            sectionOption: 'dashBoard-section-option',
                            sectionOptionRow: 'dashBoard-section-option-row',
                            sectionOptionContainer: 'dashBoard-section-option-container',
                            sectionTitle: 'titles',
                            sectionTitleLeft: 'titles-left',
                            backButton: 'back-button',
                            inFuntion: 'dashBoard-inFuntion-container'
                        }

                    }
                    strings.state = 'returning'
                    break;
                case 'empty':
                    strings.state = 'false'
                    break;
                default:
                    break;
            }
            break;
        case 'text':
            switch (language) {
                case 'spanish':
                    strings.text = {
                        pageTittle: 'BIOSEPTICOS',
                        homePage: {
                            intro: 'BIENVENIDOS A MI NUEVA APP'
                        },
                        app: {
                            intro: 'BIENVENIDOS AL CENTRO DE LOGÍSTICA'
                        },
                        navBar: {
                            menu: {
                                console: 'IR CONSOLA',
                                logistic: 'CENTRO LOGISTICA',
                                empresas: 'EMPRESAS',
                                vendedores: 'VENDEDORES',
                                page: 'PAGINA',
                                logOut: 'CERRAR SESION'
                            }
                        },
                        dashBoard: {
                            intro: 'CONSOLA ADMINISTRATIVA BIOSEPTICOS SA'
                        },
                    }
                    strings.state = 'returning'
                    break;
                case 'english':
                    strings.text = {
                        pageTittle: 'BIOSEPTICOS',
                        homePage: {
                            intro: 'WELCOME TO MY NEW APP'
                        },
                        app: {
                            intro: 'WELCOME TO THE LOGISTIC CENTER'
                        },
                        navBar: {
                            menu: {
                                console: 'GO CONSOLE',
                                logistic: 'LOGISTIC CENTER',
                                empresas: 'COMPANIES',
                                vendedores: 'SALES',
                                page: 'PAGE',
                                logOut: 'LOGOUT'
                            }
                        },
                        dashBoard: {
                            intro: ' ADMINISTRATIVE CONSOLE  BIOSEPTICOS SA'
                        },
                    }
                    strings.state = 'returning'
                    break;
                case 'frances':
                    strings.text = {
                        pageTittle: 'BIOSEPTICOS',
                        homePage: {
                            intro: 'Bienvenue a mon app'
                        },
                        app: {
                            intro: 'WELCOME TO THE LOGISTIC CENTER'
                        },
                        navBar: {
                            menu: {
                                console: 'GO CONSOLE',
                                logistic: 'LOGISTIC CENTER',
                                config: 'CONFIGURATION',
                                page: 'PAGE',
                                logOut: 'LOGOUT'
                            }
                        },
                        dashBoard: {
                            intro: ' ADMINISTRATIVE CONSOLE  BIOSEPTICOS SA'
                        },
                    }
                    strings.state = 'returning'
                    break;
                default:
                    break;
            }
            break;
        case 'empty':
            strings.state = 'false'
            break;

        default:
            break;
    }
    return strings

}
export default Declaraciones