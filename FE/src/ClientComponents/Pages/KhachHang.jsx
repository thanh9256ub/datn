import React from 'react'
import Menu from '../ClientComponents/Menu/Menu'
import BangKhachHang from '../ClientComponents/BangKhachHang/BangKhachHang'
import TimKhachHang from '../ClientComponents/TimKhachHang/TimKhachHang'
import ThemKhachHang from '../ClientComponents/ThemKhachHang/ThemKhachHang'


const KhachHang = () => {
   
    return (
        <div style={{ display: "flex"}}>
       
        <Menu />
  
      
        <div style={{width:"80%" }}>
          <div style={{display:"flex"}}>
          <div>
          <TimKhachHang />
          </div>
          <div>
          <ThemKhachHang />
          </div>
          </div>
          <div>
          <BangKhachHang />
          </div>
        </div>
      </div>
    )
}

export default KhachHang