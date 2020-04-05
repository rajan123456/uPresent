import React, { useState, useEffect } from "react";
import { getAllFences } from "../../api/fenceApi";
import FenceList from "./FenceList";
import { Link } from "react-router-dom";
import Header from "../common/Header";

function FencesPage() {
  const [fences, setFences] = useState([]);

  useEffect(() => {
    getAllFences().then((_fences) => setFences(_fences.data));
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Geo-Fence</h2>
        <Link
          className="btn btn-primary"
          style={{ margin: "5px" }}
          to="/fence/add"
        >
          Add Geo-Fence
        </Link>
        <FenceList fences={fences} />
      </div>
    </div>
  );
}

export default FencesPage;
