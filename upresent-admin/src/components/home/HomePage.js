import React from "react";
import Header from "../common/Header";

const HomePage = props => {
  return (
    <div className="container-fluid" style={{paddingRight:'0px', paddingLeft:'0px'}}>
      <Header />
      <div className="jumbotron">
        <div className="main" style={{padding: '10px'}}>
          <h1>Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
