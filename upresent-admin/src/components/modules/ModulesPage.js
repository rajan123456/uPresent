import React, { useState, useEffect } from "react";
import { getModules } from "../../api/moduleApi";
import ModuleList from "./ModuleList";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import moment from "moment";

function ModulesPage() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    getModules().then((_modules) => {
      console.log("module data ", _modules.data);
      setModules(_modules.data);
    });
  }, []);

    //startDate: moment(new Date()).format("MM/DD/YYYY"),


  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px'}}>
        <h2 style={{display: 'inline-block'}}>Modules</h2>
        <Link
          className="btn btn-primary"
          style={{ marginBottom: "25px", float:'right' }}
          to="/module/add"
        >
          Add Module
        </Link>
        <ModuleList modules={modules} />
      </div>
    </div>
  );
}

export default ModulesPage;
