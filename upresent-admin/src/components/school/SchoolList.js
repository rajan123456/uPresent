import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function SchoolList(props) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
        <th>School Code</th>
          <th>School</th>
          <th>Longitude</th>
          <th>Latitude</th>
          <th>Radius (m)</th>
          <th>Holidays</th>
          <th>TimeZone</th>
          <th>CreatedBy</th>
        </tr>
      </thead>
      <tbody>
        {props.fences &&
          props.fences.length > 0 &&
          props.fences.map((fence) => {
            return (
              <tr key={fence.schoolCode}>
                <td>
                  <Link to={"/school/" + fence.schoolCode}>
                    {fence.schoolCode}
                  </Link>
                </td>
                <td>{fence.schoolName}</td>
                <td>{fence.geoFenceData.longitude}</td>
                <td>{fence.geoFenceData.latitude}</td>
                <td>{fence.geoFenceData.radiusInMeter}</td>
                <td>{fence.holidays}</td>
                <td>{fence.timeZone}</td>
                <td>{fence.createdBy}</td>

              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

SchoolList.propTypes = {
  fences: PropTypes.arrayOf(
    PropTypes.shape({
      schoolCode: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SchoolList;
