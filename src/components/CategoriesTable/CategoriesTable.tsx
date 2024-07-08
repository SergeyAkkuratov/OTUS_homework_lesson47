import React from "react";
import { listOfCategories, useAppSelector } from "../../store/Store";
import CategoriesTableRow from "./CategoriesTableRow";

export default function CategoriesTable() {
    const categories = useAppSelector(listOfCategories);
    return (
        <>
            <table className="table table-hover" data-bs-spy="scroll">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Parent</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <CategoriesTableRow key={index} data={category} />
                    ))}
                </tbody>
            </table>
        </>
    );
}
