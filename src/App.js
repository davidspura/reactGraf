import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/cs";
import moment from "moment";
import CanvasJSReact from "./canvasjs.react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class App extends Component {
  state = {
    data: [],
    startDate: new Date()
  };

  componentDidMount() {
    fetch("https://api.testing.barkio.com/api/stats/installs")
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
    const kalendarGet = `?lastDate=${kalendar}`;
    fetch("https://api.testing.barkio.com/api/stats/installs" + kalendarGet);
  };

  render() {
    const newData = [...this.state.data];
    const android = newData.map(data => {
      return {
        label: moment(data.createdAt).calendar(null, {
          sameDay: "[Dnes]",
          nextDay: "[Zítra]",
          nextWeek: "Do Mo YYYY dddd",
          lastDay: "[Včera]",
          lastWeek: "Do Mo YYYY dddd",
          sameElse: "Do Mo YYYY dddd"
        }),
        y: data.androidTotal
      };
    });
    const ios = newData.map(data => {
      return {
        label: "",
        y: data.iosTotal
      };
    });
    const celkem = newData.map(data => {
      return {
        label: "",
        y: data.iosTotal + data.androidTotal
      };
    });
    console.log(this.state.data);
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Počet stažení za posledních 7 dní",
        fontFamily: "verdana"
      },
      axisY: {
        title: "Počet zařízení",
        labelFormatter: function(e) {
          return e.value / 2;
        }
      },
      toolTip: {
        shared: true,
        reversed: true
      },
      legend: {
        verticalAlign: "center",
        horizontalAlign: "right",
        reversed: true,
        cursor: "pointer",
        itemclick: this.toggleDataSeries
      },
      data: [
        {
          type: "stackedColumn",
          name: "iOS",
          showInLegend: true,
          dataPoints: ios
        },
        {
          type: "stackedColumn",
          name: "Android",
          showInLegend: true,
          dataPoints: android
        },
        {
          type: "stackedColumn",
          name: "Celkem",
          showInLegend: true,
          dataPoints: celkem
        }
      ]
    };
    return !this.state.data.length ? (
      <div className="container align-center">
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
        <h1 className="text-center">Žádná data k zobrazení</h1>
      </div>
    ) : (
      <div className="container">
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
        <CanvasJSChart options={options} onRef={ref => (this.chart = ref)} />
        <div></div>
      </div>
    );
  }
}

export default App;
