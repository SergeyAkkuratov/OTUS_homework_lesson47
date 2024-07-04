import React from "react";
import { Outlay, OutlayType } from "../../store/Store.types";

export type OutlayTableRowProps = {
    data: Outlay;
}

export default function OutlayTableRow(props: OutlayTableRowProps) {
    return (
        <>
            <tr className={props.data.type === OutlayType.INCOME ? "table-success" : "table-danger"}>
                <th scope="row">{props.data.type}</th>
                <td>{new Date(props.data.date).toDateString()}</td>
                <td>{props.data.sum}</td>
                <td>{props.data.category}</td>
                <td>{props.data.comment}</td>
            </tr>
        </>
    );
}