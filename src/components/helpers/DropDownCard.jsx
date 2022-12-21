import React, { useState } from "react";
import { Card } from "react-bootstrap";
import './style.css'

export default function DropDownCard(props) {
    const [isDrop, setDrop] = useState(props.show ?? false);
    const show = () => setDrop(!isDrop);
    return (
        <Card>
            <Card.Header onClick={show} className="collapse-card-header">
                <h4 style={{ float: "left" }}>{props.name}</h4>
                <div style={{ float: "right" }} className={'arrow-' + (isDrop ? 'up' : 'down')}>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                        <path d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z" />
                    </svg>
                </div>
            </Card.Header>
            <Card.Body className={"collapse-card-body-" + (isDrop ? "droped" : "collapsed")}>
                <div>
                    {props.children}
                </div>
            </Card.Body>
        </Card>

    );
}