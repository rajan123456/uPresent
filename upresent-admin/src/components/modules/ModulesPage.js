import React, { useState, useEffect } from "react";
import { getModules } from "../../api/moduleApi";
import ModuleList from "./ModuleList";
import { Link } from "react-router-dom";
import Header from "../common/Header";

function ModulesPage() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    getModules().then((_modules) => setModules(_modules.data));
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Modules</h2>
        <Link
          className="btn btn-primary"
          style={{ margin: "5px" }}
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
