import React, { Component, useState } from 'react';
import DatePicker from "react-datepicker";
import circle from '../../assets/images/dashboard/circle.svg';
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// import "react-datepicker/dist/react-datepicker.css";




export class Dashboard extends Component {
  handleChange = date => {
    this.setState({
      startDate: date
    });
  };
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      visitSaleData: {},
      visitSaleOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
              min: 0,
              stepSize: 20,
              max: 80
            },
            gridLines: {
              drawBorder: false,
              color: 'rgba(235,237,242,1)',
              zeroLineColor: 'rgba(235,237,242,1)'
            }
          }],
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
              color: 'rgba(0,0,0,1)',
              zeroLineColor: 'rgba(235,237,242,1)'
            },
            ticks: {
              padding: 20,
              fontColor: "#9c9fa6",
              autoSkip: true,
            },
            categoryPercentage: 0.5,
            barPercentage: 0.5
          }]
        },
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0
          }
        }
      },
      trafficData: {},
      trafficOptions: {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        legend: false,
      },
      todos: [
        {
          id: 1,
          task: 'Pick up kids from school',
          isCompleted: false
        },
        {
          id: 2,
          task: 'Prepare for presentation',
          isCompleted: true
        },
        {
          id: 3,
          task: 'Print Statements',
          isCompleted: false
        },
        {
          id: 4,
          task: 'Create invoice',
          isCompleted: false
        },
        {
          id: 5,
          task: 'Call John',
          isCompleted: true
        },
        {
          id: 6,
          task: 'Meeting with Alisa',
          isCompleted: false
        }
      ],
      inputValue: '',
    }
    this.statusChangedHandler = this.statusChangedHandler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }
  statusChangedHandler(event, id) {

    //const todoIndex = this.state.todos.findIndex( t => t.id === id );
    const todo = { ...this.state.todos[id] };
    todo.isCompleted = event.target.checked;

    const todos = [...this.state.todos];
    todos[id] = todo;

    this.setState({
      todos: todos
    })
  }

  addTodo(event) {
    event.preventDefault();

    const todos = [...this.state.todos];
    todos.unshift({
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      task: this.state.inputValue,
      isCompleted: false

    })

    this.setState({
      todos: todos,
      inputValue: ''
    })
  }

  removeTodo(index) {
    const todos = [...this.state.todos];
    todos.splice(index, 1);

    this.setState({
      todos: todos
    })
  }

  inputChangeHandler(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span> Dashboard </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </li>
            </ul>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-danger card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Weekly Sales <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">$ 15,0000</h2>
                <h6 className="card-text">Increased by 60%</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-info card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Weekly Orders <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">45,6334</h2>
                <h6 className="card-text">Decreased by 10%</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-success card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Visitors Online <i className="mdi mdi-diamond mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">95,5741</h2>
                <h6 className="card-text">Increased by 5%</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-5 grid-margin stretch-card">
            <div className="card">
              <div className="card-body p-0 d-flex">
                <div className="dashboard-custom-date-picker">
                  <DatePicker inline selected={this.state.startDate} onChange={this.handleChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Recent Updates</h4>
                <div className="d-flex">
                  <div className="d-flex align-items-center mr-4 text-muted font-weight-light">
                    <i className="mdi mdi-account-outline icon-sm mr-2"></i>
                    <span>jack Menqu</span>
                  </div>
                  <div className="d-flex align-items-center text-muted font-weight-light">
                    <i className="mdi mdi-clock icon-sm mr-2"></i>
                    <span>October 3rd, 2018</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6 pr-1">
                    <img src={require("../../assets/images/dashboard/img_1.jpg")} className="mb-2 mw-100 w-100 rounded" alt="face" />
                    <img src={require("../../assets/images/dashboard/img_4.jpg")} className="mw-100 w-100 rounded" alt="face" />
                  </div>
                  <div className="col-6 pl-1">
                    <img src={require("../../assets/images/dashboard/img_2.jpg")} className="mb-2 mw-100 w-100 rounded" alt="face" />
                    <img src={require("../../assets/images/dashboard/img_3.jpg")} className="mw-100 w-100 rounded" alt="face " />
                  </div>
                </div>
                <div className="d-flex mt-5 align-items-start">
                  <img src={require("../../assets/images/faces/face3.jpg")} className="img-sm rounded-circle mr-3" alt="face" />
                  <div className="mb-0 flex-grow">
                    <h5 className="mr-2 mb-2">School Website - Authentication Module.</h5>
                    <p className="mb-0 font-weight-light">It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                  </div>
                  <div className="ml-auto">
                    <i className="mdi mdi-heart-outline text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// const ListItem = (props) => {

//   const [successMessage, setSuccessMessage] = useState("");

//   const [error, setError] = useState(null);

//   const [loading, setLoading] = useState(true);


//   // Thông báo
//   const message = localStorage.getItem("successMessage");
//   if (message) {
//     toast.success(message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true
//     });
//     localStorage.removeItem("successMessage");
//   }

//   return (
//     <div>
//       <li className={(props.isCompleted ? 'completed' : null)}>
//         {successMessage && (
//           <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
//             {successMessage}
//           </Alert>
//         )}
//         {error ? (
//           <div className="text-danger">{error}</div>
//         ) : (
//           <div className="form-check">
//             <label htmlFor="" className="form-check-label">
//               <input className="checkbox" type="checkbox"
//                 checked={props.isCompleted}
//                 onChange={props.changed}
//               /> {props.children} <i className="input-helper"></i>
//             </label>
//           </div>
//         )}
//         <i className="remove mdi mdi-close-circle-outline" onClick={props.remove}></i>

//       </li>
//       <ToastContainer />
//     </div>
//   )
// };
export default Dashboard;