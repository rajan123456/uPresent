import React from "react";
import Header from "../common/Header";

const HomePage = props => {
  return (
    <div className="container-fluid">
      <Header />
      <div className="jumbotron">
        <div className="body">
          <h1>Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
