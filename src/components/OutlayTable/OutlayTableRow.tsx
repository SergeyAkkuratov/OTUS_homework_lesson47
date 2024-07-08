import React from "react";
import { Outlay, OutlayType } from "../../store/Store.types";
import { child, set } from "firebase/database";
import { categoriesSlice, outlayDbReference, store, useAppSelector } from "../../store/Store";

export type OutlayTableRowProps = {
    data: Outlay;
}

export default function OutlayTableRow(props: OutlayTableRowProps) {
    const categoryName = useAppSelector((state) => categoriesSlice.selectors.categoryNameWithId(state, props.data.category));
    async function deleteOutlay() {
        if(confirm("Are you shure want to delete this outlay?")){
            await set(child(outlayDbReference(store.getState())!, props.data.id), null);
        }
    }

    return (
        <>
            <tr className={props.data.type === OutlayType.INCOME ? "table-success" : "table-danger"}>
                <th scope="row">{props.data.type}</th>
                <td>{new Date(props.data.date).toDateString()}</td>
                <td>{props.data.sum}</td>
                <td>{categoryName}</td>
                <td>{props.data.comment}</td>
                <td><button type="button" className="btn btn-outline-secondary" onClick={deleteOutlay}>Delete</button></td>
            </tr>
        </>
    );
}