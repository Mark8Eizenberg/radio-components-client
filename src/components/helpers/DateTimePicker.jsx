import React, { useState, useEffect } from "react";

export default function DatePicker({ callbackToGetDate }) {
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    useEffect(() => {
        if (typeof callbackToGetDate === "function") {
            callbackToGetDate(dateTime);
        }
    });

    return (
        <input
            type="datetime-local"
            onChange={(e) => {
                setDateTime(e.target.value);
            }}
        ></input>
    );
}
