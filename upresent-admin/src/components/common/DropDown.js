import React from "react";
import PropTypes from "prop-types";

function DropDown(props) {
    let wrapperClass = "form-group";
    let options = JSON.parse(localStorage.getItem("roles"));
    if (props.error && props.error.length > 0) {
        wrapperClass += " has-error";
    }

    return (
        <div className={wrapperClass}>
            <label htmlFor={props.id}>{props.label}</label>
            <div className="field">
                <select
                    id={props.id}
                    name={props.name}
                    onChange={props.onChange}
                    className="form-control">
                    {options && options.user_role.map(_option => {
                        return (
                            _option === props.value ? (
                                <option key={_option} value={_option} selected>{_option}</option>
                            ) : (
                                    <option key={_option} value={_option}>{_option}</option>
                                )
                        );
                    })
                    }
                </select>
            </div>
            {props.error && props.error.length > 0 && (
                <div className="alert alert-danger">{props.error}</div>
            )}
        </div>
    );
}

DropDown.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    error: PropTypes.string
};

DropDown.defaultProp = {
    value: "",
    error: ""
};

export default DropDown;
