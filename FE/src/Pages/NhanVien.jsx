import React from 'react'
import Menu from '../ClientComponents/Menu/Menu'
import BangNhanVien from '../ClientComponents/BangNhanVien/BangNhanVien'
import TimNhanVien from '../ClientComponents/TimNhanVien/TimNhanVien'
import ThemNhanVien from '../ClientComponents/ThemNhanVien/ThemNhanVien'


const NhanVien = () => {

  return (
    <div style={{ display: "flex", alignItems: "" }}>

      <Menu />


      <div>
        <div style={{display:"flex"}}>
          <div>
            <TimNhanVien />
          </div>
          <div>
            <ThemNhanVien />
          </div>
          
        </div>
       <div>
       <BangNhanVien />
       </div>

      </div>
    </div>

  )
}

export default NhanVien