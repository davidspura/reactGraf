import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/cs";
import moment from "moment";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export class App extends Component {
  state = {
    data: [],
    startDate: new Date(),
    API: "https://api.testing.barkio.com/api/stats/installs"
  };

  static jsfiddleUrl = "https://jsfiddle.net/alidingling/9hjfkp73/";

  componentDidMount() {
    fetch(this.state.API)
      .then(res => res.json())
      .then(res => {
        this.setState({ data: res });
      });
  }

  toggleDataSeries = e => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
    const kalendar = moment(date).format("YYYY-MM-DD");
    let newAPI = "";
    newAPI = `${this.state.API}?lastDate=${kalendar}`;
    fetch(newAPI)
      .then(res => res.json())
      .then(res => {
        this.setState({ data: res });
      });
  };

  render() {
    const newData = [...this.state.data];
    const zdroj = newData.map(data => {
      return {
        name: moment(data.createdAt).calendar(null, {
          sameDay: "[Dnes]",
          nextDay: "[Zítra]",
          nextWeek: "Do Mo YYYY dddd",
          lastDay: "[Včera]",
          lastWeek: "Do Mo YYYY dddd",
          sameElse: "Do Mo YYYY dddd"
        }),
        iOS: data.iosTotal,
        Android: data.androidTotal,
        Celkem: data.androidTotal + data.iosTotal
      };
    });
    const data = zdroj;

    return !this.state.data.length ? (
      <div className="container align-center">
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
        <h1 className="text-center">Žádná data k zobrazení</h1>
      </div>
    ) : (
      <div>
        <div className="container">
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
          />
        </div>
        <div className="container d-flex justify-content-center">
          <BarChart
            width={1200}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="iOS" stackId="a" fill="#8884d8" />
            <Bar dataKey="Android" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Celkem" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    );
  }
}

export default App;
