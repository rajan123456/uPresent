import React, { useState, useEffect } from "react";
import { getAllFences } from "../../api/fenceApi";
import SchoolList from "./SchoolList";
import { Link } from "react-router-dom";
import Header from "../common/Header";

function SchoolPage() {
  const [fences, setFences] = useState([]);

  useEffect(() => {
    getAllFences().then((_fences) => setFences(_fences.data));
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{ padding: "10px" }}>
        <h2 style={{ display: "inline-block" }}>School</h2>
        <Link
          className="btn btn-primary"
          style={{ marginBottom: "25px", float: "right" }}
          to="/school/add"
        >
          Add School
        </Link>
        <SchoolList fences={fences} />
      </div>
    </div>
  );
}

export default SchoolPage;
