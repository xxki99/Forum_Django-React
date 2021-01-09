import React, { Component } from "react"

function TextInput(props) {
    const { id, type, labelText, placeholder, handleChange, errorText } = props

    return (
        <div>
            <label htmlFor={id} className="form-label">{labelText}</label>
            <div className="input-group">
                <input type={type} className="form-control" id={id} placeholder={placeholder} aria-label={placeholder} onChange={handleChange} />
            </div>
            <small className="text-danger">{errorText}</small>
        </div>
    )
}

export {TextInput}
