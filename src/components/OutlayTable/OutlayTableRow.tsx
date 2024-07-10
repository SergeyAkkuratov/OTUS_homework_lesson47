import React from "react";
import { child, remove } from "firebase/database";
import { Outlay, OutlayType } from "../../store/StoreTypes";
import { categoriesSlice, outlayDbReference, store, useAppSelector } from "../../store/Store";

export type OutlayTableRowProps = {
    data: Outlay;
};

export default function OutlayTableRow(props: OutlayTableRowProps) {
    const categoryName = useAppSelector((state) => categoriesSlice.selectors.categoryNameWithId(state, props.data.category));
    async function deleteOutlay() {
        // eslint-disable-next-line no-alert, no-restricted-globals
        if (confirm("Are you shure want to delete this outlay?")) {
            await remove(child(outlayDbReference(store.getState())!, props.data.id));
        }
    }

    return (
        <>
            <tr className={props.data.type === OutlayType.INCOME ? "table-success" : "table-danger"} data-testid={`row-id-${props.data.id}`}>
                <th scope="row">{props.data.type}</th>
                <td>{new Date(props.data.date).toDateString()}</td>
                <td>{props.data.sum}</td>
                <td>{categoryName}</td>
                <td>{props.data.comment}</td>
                <td>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={deleteOutlay}
                        data-testid={`deleteButton-id-${props.data.id}`}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        </>
    );
}
