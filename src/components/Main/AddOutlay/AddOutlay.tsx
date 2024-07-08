import React, { useState } from "react";
import { OutlayType } from "../../../store/Store.types";
import { categoriesSlice, outlaysSlice, useAppSelector } from "../../../store/Store";
import { push, set } from "firebase/database";

export default function AddOutlay() {
    const dbRef = useAppSelector(outlaysSlice.selectors.dbReference);
    const categories = useAppSelector(categoriesSlice.selectors.listOfCategories);
    const cleanFormData = {
        type: OutlayType.INCOME,
        date: "",
        sum: 0,
        category: categories[0].id,
        comment: ""
    };

    const [formData, setFormData] = useState(cleanFormData);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const newOutlay = push(dbRef!);
        await set(newOutlay, { id: newOutlay.key, ...formData });
        setFormData(cleanFormData);
    }

    return (
        <>
            <form className="mb-3" onSubmit={(event) => submit(event)}>
                <fieldset>
                    <div>
                        <label htmlFor="type" className="form-label mt-1">Type</label>
                        <select className="form-select" id="type" value={formData.type} onChange={handleChange}>
                            <option>{OutlayType.INCOME}</option>
                            <option>{OutlayType.OUTLAY}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="form-label mt-1">Date</label>
                        <input type="datetime-local" className="form-control" id="date" value={formData.date} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="sum" className="form-label mt-1">Sum</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" aria-label="Amount" id="sum" value={formData.sum} onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="form-label mt-1">Category</label>
                        <select className="form-select" id="category" onChange={handleChange}>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="comment" className="form-label mt-1">Comment</label>
                        <textarea className="form-control" id="comment" rows={3} value={formData.comment} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Add</button>
                </fieldset>
            </form>
        </>
    );
}