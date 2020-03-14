import React from "react";
import { Link } from "react-router-dom";
import Header from "./common/Header";

function NotFoundPage() {
  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Huh! What's that?</h2>
        <p>
          Looks like that does not exist <br />
          <br />
          <Link to="/home" className="btn btn-primary">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
