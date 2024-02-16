import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function ModuleList(props) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Enrollments</th>
        </tr>
      </thead>
      <tbody>
        {props.modules &&
          props.modules.length > 0 &&
          props.modules.map((module) => {
            return (
              <tr key={module.moduleCode}>
                <td>
                  <Link to={"/module/" + module.moduleCode}>
                    {module.moduleCode}
                  </Link>
                </td>
                <td>{module.moduleName}</td>
                <td>{module.startDate}</td>
                <td>{module.endDate}</td>
                <td>{module.studentUsernames.length}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

ModuleList.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      moduleCode: PropTypes.string.isRequired,
      moduleName: PropTypes.string.isRequired,
      studentUsernames: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default ModuleList;
