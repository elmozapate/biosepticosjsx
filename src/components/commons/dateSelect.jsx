import { ObjDatosPersonales } from "@/bioApp/models/modelosUsuario";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
const DateSelect = (props) => {
  const { Dtype = false, MinDate = '', Atype = false, Btype = false, Ctype = false, MaxDate = new Date(), showTimeSelect = false, OnChange = console.log, personalObj = ObjDatosPersonales, startDate = new Date(), setStartDate = console.log } = props
  let typeA = (date) => setStartDate({
    ...personalObj,
    fechaDeNacimiento: date
  })
  let typeB = (date) => setStartDate({
    ...personalObj,
    servicio: {
      ...personalObj.servicio,
      shedule: {
        ...personalObj.servicio.shedule,
        fechaDeInicio: date
      }
    }
  })
  let typeC = (date) => setStartDate({
    ...personalObj,
    servicio: {
      ...personalObj.servicio,
      shedule: {
        ...personalObj.servicio.shedule,
        fechaDeFinal: date
      }
    }
  })
  let typeD = (date) => setStartDate(date)

  return (
    <ReactDatePicker
      selected={startDate}
      onChange={Dtype ? typeD : Ctype ? typeC : Btype ? typeB : typeA}
      showTimeSelect={showTimeSelect}
      dateFormatCalendar={"MMM yyyy"}
      popperClassName="some-custom-class"
      popperPlacement="top-end"
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      maxDate={MaxDate}
      minDate={MinDate}

      popperModifiers={[
        {
          name: "offset",
          options: {
            offset: [5, 10],
          },
        },
        {
          name: "preventOverflow",
          options: {
            rootBoundary: "viewport",
            tether: false,
            altAxis: true,
          },
        },
      ]}
    />);
}
export default DateSelect