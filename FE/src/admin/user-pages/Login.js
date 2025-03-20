// import React, { Component, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Form } from 'react-bootstrap';
// import { useAuth } from '../../context/AuthContext';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import { getToken } from './service/Login';
// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const history = useHistory();

//   const handleLogin = (e) => {

//     e.preventDefault();

//     getToken(username, password).then((response) => {
//       console.log(response);

//       if (response.status === 200) {
//         login(response.data.data.token);
//         history.push('/admin/employees');
//       }
//       else {
//         alert("Đăng nhập thất bại");
//       }
//     }).catch((error) => {
//       console.log(error);
//       alert("Đăng nhập thất bại");
//     }); 
//   };


//   return (
//     <div>
//       <div className="d-flex align-items-center auth px-0">
//         <div className="row w-100 mx-0">
//           <div className="col-lg-8 mx-auto">
//             <div className="auth-form-light text-left py-5 px-4 px-sm-5">
//               <div className="brand-logo">
//                 <img src={require("../../assets/images/logo.svg")} alt="logo" />
//               </div>
//               <h4>Hello!</h4>
//               <h6 className="font-weight-light">Sign in to continue.</h6>
//               <Form className="pt-3">
//                 <Form.Group className="d-flex search-field">
//                   <Form.Control type="email" placeholder="Username" size="lg" className="h-auto"
//                     onChange={(e) => setUsername(e.target.value)} />
//                 </Form.Group>
//                 <Form.Group className="d-flex search-field">
//                   <Form.Control type="password" placeholder="Password" size="lg" className="h-auto"
//                     onChange={(e) => setPassword(e.target.value)} />
//                 </Form.Group>
//                 <div className="mt-3">
//                   {/* <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard" >SIGN IN</Link> */}
//                   <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
//                     onClick={handleLogin}>
//                     SIGN IN</Button>
//                 </div>
//                 <div className="my-2 d-flex justify-content-between align-items-center">
//                   <div className="form-check">
//                     <label className="form-check-label text-muted">
//                       <input type="checkbox" className="form-check-input" />
//                       <i className="input-helper"></i>
//                       Keep me signed in
//                     </label>
//                   </div>
//                   <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">Forgot password?</a>
//                 </div>
//                 <div className="mb-2">
//                   <button type="button" className="btn btn-block btn-facebook auth-form-btn">
//                     <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
//                   </button>
//                 </div>
//                 <div className="text-center mt-4 font-weight-light">
//                   Don't have an account? <Link to="/admin/user-pages/register-1" className="text-primary">Create</Link>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

// }

// export default Login
