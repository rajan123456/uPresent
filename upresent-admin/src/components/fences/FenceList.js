import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function FenceList(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>University</th>
          <th>Longitude</th>
          <th>Latitude</th>
          <th>Radius (m)</th>
        </tr>
      </thead>
      <tbody>
        {props.fences &&
          props.fences.length > 0 &&
          props.fences.map((fence) => {
            return (
              <tr key={fence.universityName}>
                <td>
                  <Link to={"/fence/" + fence.universityName}>
                    {fence.universityName}
                  </Link>
                </td>
                <td>{fence.longitude}</td>
                <td>{fence.latitude}</td>
                <td>{fence.radius}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

FenceList.propTypes = {
  fences: PropTypes.arrayOf(
    PropTypes.shape({
      universityName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FenceList;
