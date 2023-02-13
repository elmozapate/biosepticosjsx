import { ArraySelectorBiosepticos } from "../models/modelosSelector";
import { EstadosServiciosObj, EstadosServiciosObjShort } from "../models/selectores";

const ServiceSelector = (props) => {
    const { userSort = false, misServiciosSort = EstadosServiciosObj, sortBy = console.log, misServicios = { array: [] } } = props
    return (
        <>
            {!userSort ?
                <div className="flex-row">
                    <p className={misServiciosSort.sort === 'all' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('all') }}>Todos{misServiciosSort['all'] && <span>{misServiciosSort['all'].many}</span>} </p>
                    <p className={misServiciosSort.sort === 'pending' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('pending') }}>Pendientes <span>{misServiciosSort['pending'] && misServiciosSort['pending'].many}</span> </p>
                    <p className={misServiciosSort.sort === 'active' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('active') }}>Activos <span>{misServiciosSort['active'] && misServiciosSort['active'].many}</span> </p>
                    <p className={misServiciosSort.sort === 'inactive' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('inactive') }}>Inactivos <span>{misServiciosSort['inactive'] && misServiciosSort['inactive'].many}</span> </p>
                    <p className={misServiciosSort.sort === 'done' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('done') }}>Realizados <span>{misServiciosSort['done'] && misServiciosSort['done'].many}</span> </p>
                    <p className={misServiciosSort.sort === 'verification' ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy('verification') }}>Verificacion <span>{misServiciosSort['verification'].many}</span> </p>

                </div>
                :
                <div className="flex-row">
                    {
                        ArraySelectorBiosepticos.map((key, i) => {
                            return (
                                <>{
                                    key !== 'vehiculos' &&
                                    <p className={misServiciosSort.sort === key ? 'color-green' : ''} onClick={(e) => { e.preventDefault(); sortBy(key) }}>{key}<span>{misServiciosSort[key].many}</span>  </p>}
                                </>
                            )
                        })
                    }

                </div>
            }
        </>
    )
}
export default ServiceSelector