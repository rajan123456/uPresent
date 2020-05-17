import React, { useState, useEffect } from "react";
import { getAllFences } from "../../api/fenceApi";
import SchoolList from "./SchoolList";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import moment from "moment";


function SchoolPage() {
  const [fences, setFences] = useState([]);

  useEffect(() => {
    console.log("api call.. school..all");
    getAllFences().then((_fences) => setFences(_fences.data));
    // for (var fence in fences){
    //   var holidays = "";
    //   for (var i = 0; i < fence.holidays.length; i++) {
    //     holidays.concat(moment(fence.holidays[i]).format("MM/DD/YYYY"),",");
    //   }
    //   fence.holidays = holidays;
    // }
    }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px'}}>
      <h2 style={{display: 'inline-block'}}>School</h2>
        <Link
          className="btn btn-primary"
          style={{ marginBottom: "25px", float:'right' }}
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
