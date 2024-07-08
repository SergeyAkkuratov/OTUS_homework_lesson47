import React, { useState } from "react";
import { push, set } from "firebase/database";
import { categoriesDbReference, listOfCategories, useAppSelector } from "../store/Store";
import CategoriesTable from "../components/CategoriesTable/CategoriesTable";

export default function Categories() {
    const categoriesDbRef = useAppSelector(categoriesDbReference);
    const categories = useAppSelector(listOfCategories);
    const [formData, setFormData] = useState({
        name: "",
        parent: null,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const newCategory = push(categoriesDbRef!);
        await set(newCategory, { id: newCategory.key, ...formData });
        setFormData({
            name: "",
            parent: null,
        });
    }

    return (
        <>
            <form className="mb-3" onSubmit={(event) => submit(event)}>
                <fieldset>
                    <div>
                        <label htmlFor="name" className="form-label mt-1">
                            Type
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter Category name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="parent" className="form-label mt-1">
                            Parent
                        </label>
                        <select className="form-select" id="parent" value={formData.parent ?? "No parent"} onChange={handleChange}>
                            <option key={"no_parent"}>No parent</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">
                        Add Category
                    </button>
                </fieldset>
            </form>
            <CategoriesTable />
        </>
    );
}
