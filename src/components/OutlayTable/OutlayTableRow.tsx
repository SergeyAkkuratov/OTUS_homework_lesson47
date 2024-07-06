import React from "react";
import { Outlay, OutlayType } from "../../store/Store.types";
import { child, set } from "firebase/database";
import { store } from "../../store/Store";

export type OutlayTableRowProps = {
    data: Outlay;
}

export default function OutlayTableRow(props: OutlayTableRowProps) {

    async function deleteOutlay() {
        if(confirm("Are you shure want to delete this outlay?")){
            await set(child(store.getState().Outlays.dbReference!, props.data.id), null);
        }
    }

    return (
        <>
            <tr className={props.data.type === OutlayType.INCOME ? "table-success" : "table-danger"}>
                <th scope="row">{props.data.type}</th>
                <td>{new Date(props.data.date).toDateString()}</td>
                <td>{props.data.sum}</td>
                <td>{props.data.category}</td>
                <td>{props.data.comment}</td>
                <td><button type="button" className="btn btn-outline-secondary" onClick={deleteOutlay}>Delete</button></td>
            </tr>
        </>
    );
}