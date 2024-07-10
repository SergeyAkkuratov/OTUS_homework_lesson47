import React from "react";
import { child, remove } from "firebase/database";
import { Category } from "../../store/StoreTypes";
import { categoriesDbReference, categoriesSlice, store, useAppSelector } from "../../store/Store";

export type CategoriesTableRowProps = {
    data: Category;
};

export default function CategoriesTableRow(props: CategoriesTableRowProps) {
    const parentName = useAppSelector((state) => (props.data.parent ? categoriesSlice.selectors.categoryNameWithId(state, props.data.parent) : null));

    async function deleteCategory() {
        // eslint-disable-next-line no-alert, no-restricted-globals
        if (confirm(`Are you shure want to delete this Categpory: ${props.data.name}?`)) {
            await remove(child(categoriesDbReference(store.getState())!, props.data.id));
        }
    }

    return (
        <>
            <tr data-testid={`row-id-${props.data.id}`}>
                <th scope="row">{props.data.name}</th>
                <td data-testid={`parent-td-id-${props.data.id}`}>{parentName}</td>
                <td>
                    <button type="button" className="btn btn-outline-secondary" onClick={deleteCategory} data-testid={`deleteButton-id-${props.data.id}`}>
                        Delete
                    </button>
                </td>
            </tr>
        </>
    );
}
