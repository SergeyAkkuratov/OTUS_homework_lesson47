import React from "react";
import { Chart } from "react-google-charts";
import { useSearchParams } from "react-router-dom";
import { categoriesSlice, filterOutlays, store, useAppSelector } from "../store/Store";
import { OutlayType } from "../store/StoreTypes";
import OutlayTable from "../components/OutlayTable/OutlayTable";
import formatDate from "../helpers";

export default function Statistic() {
    const defaultFilters = ["LastWeek", "LastMonth", "BetweenTwoDates"];
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [searchParams, setSearchParams] = useSearchParams([
        ["filter", "LastWeek"],
        ["startDate", formatDate(lastWeek)],
        ["endDate", formatDate(today)],
        ["isChart", "false"],
    ]);
    const outlays = useAppSelector((state) => filterOutlays(state, searchParams.get("startDate")!, searchParams.get("endDate")!));

    function getData() {
        const result: { [id: string]: number } = {};
        outlays.forEach((outLay) => {
            if (outLay.type === OutlayType.OUTLAY) {
                const { sum } = outLay;
                const category = categoriesSlice.selectors.highestCategoryName(store.getState(), outLay.category);
                if (category in result) {
                    result[category] = Number(result[category]) + Number(sum);
                } else {
                    result[category] = Number(sum);
                }
            }
        });

        return [["Categories", "Sum"], ...Object.keys(result).map((key) => [key, Number(result[key])])];
    }

    const handleChangeChart = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setSearchParams((params) => {
            params.set("isChart", `${checked}`);
            return params;
        });
    };

    const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        switch (value) {
            case "LastWeek": {
                setSearchParams((params) => {
                    params.set("filter", value);
                    params.set("startDate", formatDate(lastWeek));
                    params.set("endDate", formatDate(today));
                    return params;
                });
                break;
            }
            case "LastMonth": {
                setSearchParams((params) => {
                    params.set("filter", value);
                    params.set("startDate", formatDate(lastMonth));
                    params.set("endDate", formatDate(today));
                    return params;
                });
                break;
            }
            default: {
                setSearchParams((params) => {
                    params.set("filter", value);
                    return params;
                });
                break;
            }
        }
    };

    const handleChangeDates = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setSearchParams((params) => {
            params.set(id, value);
            return params;
        });
    };

    return (
        <>
            <fieldset>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="isChart"
                        checked={searchParams.get("isChart") === "true"}
                        onChange={handleChangeChart}
                    />
                    <label className="form-check-label" htmlFor="isChart">
                        Show data as PieChart
                    </label>
                </div>
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    {defaultFilters.map((filter, index) => (
                        <div key={index}>
                            <input
                                key={`input-${index}`}
                                type="radio"
                                className="btn-check"
                                name="filterRadio"
                                id={`filterRadio${index}`}
                                autoComplete="off"
                                value={filter}
                                checked={searchParams.has("filter", filter)}
                                onChange={handleRadioButtonChange}
                            />
                            <label key={`label-${index}`} className="btn btn-outline-primary" htmlFor={`filterRadio${index}`}>
                                {filter}
                            </label>
                        </div>
                    ))}
                </div>
                {searchParams.has("filter", "BetweenTwoDates") ? (
                    <>
                        <div>
                            <label htmlFor="startDate" className="form-label mt-1">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="startDate"
                                value={searchParams.get("startDate")!}
                                onChange={handleChangeDates}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="form-label mt-1">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="endDate"
                                value={searchParams.get("endDate")!}
                                onChange={handleChangeDates}
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </fieldset>
            {searchParams.get("isChart") === "true" ? (
                <Chart chartType="PieChart" data={getData()} width={"100%"} height={"400px"} />
            ) : (
                <OutlayTable startDate={searchParams.get("startDate")!} endDate={searchParams.get("endDate")!} />
            )}
        </>
    );
}
