import React from 'react';
import Details from './components/details';
import axios from "axios";
import Button from "terra-button";
import Loader from 'react-loader-spinner'
import './App.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shuttleData: null,
      isDetailsLoading: true,
      selectedYear: '',
      isSuccessfulLaunch: '',
      isSuccessfulLand: '',
      isFilterDataLoading: '',
      unfilteredData: null,

    }
  }

  componentDidMount() {
    // Initial Call
    axios.get("https://api.spacexdata.com/v3/launches?limit=100", {})
      .then((response) => {
        this.setState({ shuttleData: response.data, unfilteredData: response.data, isDetailsLoading: false })
      });
  }

  handleDataFetch = () => {
    //Launch Success Filter
    if (this.state.selectedYear === '' && this.state.isSuccessfulLaunch && (this.state.isSuccessfulLand === false || this.state.isSuccessfulLand === '')) {
      this.setState({
        isFilterDataLoading: true
      });
      axios.get("https://api.spacexdata.com/v3/launches?limit=100&launch_success=true", {})
        .then((response) => {
          this.setState({ shuttleData: response.data, isFilterDataLoading: false })
        });
    }

    //Launch & Land Filter
    if (this.state.selectedYear === '' && this.state.isSuccessfulLaunch && this.state.isSuccessfulLand) {
      this.setState({
        isFilterDataLoading: true
      });
      axios.get("https://api.spacexdata.com/v3/launches?limit=100&launch_success=true&land_success=true", {})
        .then((response) => {
          this.setState({ shuttleData: response.data, isFilterDataLoading: false })
        });
    }

    //All Filter
    if (this.state.selectedYear !== '' && this.state.isSuccessfulLaunch && this.state.isSuccessfulLand) {
      this.setState({
        isFilterDataLoading: true
      });
      axios.get(`https://api.spacexdata.com/v3/launches?limit=100&launch_success=true&land_success=true&launch_year=${this.state.selectedYear}`, {})
        .then((response) => {
          this.setState({ shuttleData: response.data, isFilterDataLoading: false })
        });
    }
  }

  handleFilter = (filterNum, yearInfo, launchSuccess, landSuccess) => {
    //Checking which filter is selected at a particular time depending on the filter number
    if (filterNum === 1) {
      // Data Filter Altered
      this.setState({
        selectedYear: this.state.selectedYear === yearInfo ? '' : yearInfo
      }, () => {
        this.handleDataFetch();
      });
    }
    else if (filterNum === 2) {
      // Successful Launch Filter Altered
      this.setState({
        isSuccessfulLaunch: launchSuccess
      }, () => {
        this.handleDataFetch();
      });
    }
    else {
      // Successful Land Filter Altered
      this.setState({
        isSuccessfulLand: landSuccess
      }, () => {
        this.handleDataFetch();
      });
    }
  }



  render() {

    let yearData = this.state.unfilteredData && this.state.unfilteredData.map((data, index) => {
      return data.launch_year;
    });
    let individualYear = yearData && yearData.filter((a, b) => yearData.indexOf(a) === b);
    let renObjData = individualYear && individualYear.map((yearInfo, idx) => {
      // Handling Dynamic render of Year Options
      return (
        <Button
          key={idx}
          text={yearInfo}
          variant="emphasis"
          className={this.state.selectedYear === yearInfo ? "year active" : "year"}
          onClick={(event) => { this.handleFilter(1, yearInfo, this.state.isSuccessfulLaunch, this.state.isSuccessfulLand) }}
        />
      );
    });

    return (
      <div className="App">
        <header>
          <h1>SpaceX Launch Programs</h1>
        </header>
        <main>
          {/* Displaying Loader when fetching data during initial render */}
          {this.state.isDetailsLoading ? <Loader type="Oval" className="centered" color="#00BFFF" height={60} width={60} /> :
            <article>
              <div className="menu">
                <div className="container">
                  <h3 className="filter">Filter</h3>

                  <div className="filterOne">
                    <h4 className="dateHead">Launch Year</h4>
                    <div className="years">
                      {renObjData}
                    </div>
                  </div>

                  <div className="filterTwo">
                    <h4 className="SuccessHead">SuccessFul Launch</h4>
                    <div className="years">
                      <Button
                        text="True"
                        variant="emphasis"
                        className={this.state.isSuccessfulLaunch === '' ? "year" : this.state.isSuccessfulLaunch ? "year active" : "year"}
                        onClick={(event) => { this.handleFilter(2, this.state.selectedYear, true, this.state.isSuccessfulLand) }}
                      />

                      <Button
                        text="False"
                        variant="emphasis"
                        className={this.state.isSuccessfulLaunch === '' ? "year" : this.state.isSuccessfulLaunch ? "year" : "year active"}
                        onClick={(event) => { this.handleFilter(2, this.state.selectedYear, false, this.state.isSuccessfulLand) }}
                      />
                    </div>
                  </div>

                  <div className="filterThree">
                    <h4 className="SuccessHead">SuccessFul Landing</h4>
                    <div className="years">
                      <Button
                        text="True"
                        variant="emphasis"
                        className={this.state.isSuccessfulLand === '' ? "year" : this.state.isSuccessfulLand ? "year active" : "year"}
                        onClick={(event) => { this.handleFilter(3, this.state.selectedYear, this.state.isSuccessfulLaunch, true) }}
                      />

                      <Button
                        text="False"
                        variant="emphasis"
                        className={this.state.isSuccessfulLand === '' ? "year" : this.state.isSuccessfulLand ? "year" : "year active"}
                        onClick={(event) => { this.handleFilter(3, this.state.selectedYear, this.state.isSuccessfulLaunch, false) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Displaying Loader during Filter Data Fetch */}
              {this.state.isFilterDataLoading ? <Loader type="Oval" className="centered" color="#00BFFF" height={60} width={60} /> :
                <Details shuttleData={this.state.shuttleData} />}
            </article>}
        </main>
        <footer>
          <h4 className="content">Developed by <span>Shiva Karthik</span></h4>
        </footer>
      </div>
    )
  }
}

export default App;
