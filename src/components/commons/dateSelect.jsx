import { ObjDatosPersonales } from "@/bioApp/models/modelosUsuario";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
const DateSelect = (props) => {
  const { personalObj = ObjDatosPersonales, startDate = new Date(), setStartDate = console.log } = props
  return (
    <ReactDatePicker
      selected={startDate}
      onChange={(date) => setStartDate({
        ...personalObj,
        fechaDeNacimiento: date
      })}
      dateFormatCalendar={"MMM yyyy"}
      popperClassName="some-custom-class"
      popperPlacement="top-end"
      showYearDropdown
      dropdownMode="select"
      maxDate={(new Date())}

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