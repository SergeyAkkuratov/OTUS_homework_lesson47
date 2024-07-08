import React from "react";
import { filterOutlays, useAppSelector } from "../../store/Store";
import OutlayTableRow from "./OutlayTableRow";

export type OutlayTableProps = {
    startDate: string,
    endDate: string
}

export default function OutlayTable(props: OutlayTableProps) {
    const outlays = useAppSelector((state) => filterOutlays(state, props.startDate, props.endDate));
    return (
        <>
            <table className="table table-hover" data-bs-spy="scroll">
                <thead>
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Date</th>
                        <th scope="col">Sum</th>
                        <th scope="col">Category</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {outlays.map((outlay, index) => <OutlayTableRow key={index} data={outlay} />)}
                </tbody>
            </table>
        </>
    )
}