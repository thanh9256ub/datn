import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import circle from '../../assets/images/dashboard/circle.svg';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchDashboardStatus5,
  fetchDashboardStatus2,
  fetchDashboardProduct,
  fetchDashboardRevenue
} from '../dashboard/api';

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
      dashboardStatus5: null,
      dashboardStatus2: null,
      dashboardProduct: null,
      dashboardRevenue: null
    }
    this.statusChangedHandler = this.statusChangedHandler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  fetchDashboardData = async () => {
    try {
      const [status5, status2, product, revenue] = await Promise.all([
        fetchDashboardStatus5(),
        fetchDashboardStatus2(),
        fetchDashboardProduct(),
        fetchDashboardRevenue()
      ]);

      this.setState({
        dashboardStatus5: status5.data,
        dashboardStatus2: status2.data,
        dashboardProduct: product.data,
        dashboardRevenue: revenue.data
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  statusChangedHandler(event, id) {
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
    const { dashboardStatus5, dashboardStatus2, dashboardProduct, dashboardRevenue } = this.state;

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span> Dashboard </h3>
        </div>

        <div className="greeting-container" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h1 style={{ color: '#00000 ', fontWeight: 'bold' }}>

            🌟 Chào mừng <span style={{ color: '#6C5CE7' }}>{localStorage.getItem("fullName")}</span> đã quay trở lại! 🌟
          </h1>
          <p style={{ fontSize: '18px', color: '#555' }}>
            Chúc bạn một ngày làm việc hiệu quả và tràn đầy năng lượng!
          </p>
        </div>
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#00000' }}>
            Thông tin cửa hàng hôm nay
          </h2>
          <hr style={{ width: '50%', margin: '10px auto', border: '#00000' }} />
        </div>
        <div className="row">
          <div className="col-md-3 stretch-card grid-margin">
            <div className="card bg-gradient-danger card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Đơn hoàn thành <i className="mdi mdi-chart-line mdi-24px float-right"></i></h4>
                <h2 className="mb-5">{dashboardStatus5 || '0'}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 stretch-card grid-margin">
            <div className="card bg-gradient-info card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Đơn xác nhận <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i></h4>
                <h2 className="mb-5">{dashboardStatus2 || '0'}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 stretch-card grid-margin">
            <div className="card bg-gradient-success card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Sản phẩm đã bán <i className="mdi mdi-diamond mdi-24px float-right"></i></h4>
                <h2 className="mb-5">{dashboardProduct || '0'}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 stretch-card grid-margin">
            <div className="card bg-gradient-warning card-img-holder text-white">
              <div className="card-body">
                <img src={circle} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Doanh thu <i className="mdi mdi-cash mdi-24px float-right"></i></h4>
                <h2 className="mb-5">{dashboardRevenue || '0'}</h2>
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
                <h4 className="card-title">Ghi chú </h4>
                <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                  Xin chào {localStorage.getItem("fullName")}, hôm nay là một ngày tuyệt vời để đạt được những mục tiêu mới!
                  Hãy xem qua thống kê doanh số để nắm bắt tình hình.
                  Với sự nỗ lực và cống hiến của bạn, thành công sẽ luôn đồng hành!
                </p>
                <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px' }}>
                  "Thành công không phải là điểm đến, mà là hành trình. Hãy tiếp tục tiến bước và làm nên điều kỳ diệu!"
                </p>
                <canvas id="visit-sale-chart" height="100"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;