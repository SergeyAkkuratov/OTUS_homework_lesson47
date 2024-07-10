import React from "react";
import CategoriesTable from "../components/CategoriesTable/CategoriesTable";
import AddCategories from "../components/AddCategories/AddCategories";

export default function Categories() {
    return (
        <>
            <AddCategories />
            <CategoriesTable />
        </>
    );
}
