import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { categoriesSlice, outlaysSlice, store, useAppSelector } from "../../store/Store";
import { OutlayType } from "../../store/Store.types";
import { useSearchParams } from "react-router-dom";
import OutlayTable from "../OutlayTable/OutlayTable";

export default function Statistic() {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilters = useAppSelector(outlaysSlice.selectors.getAllFilters)
    const [currentFilter, setCurrentFilter] = useState({
        ...defaultFilters[0],
        params: {}
    });
    const [datesParams, setDatesParams] = useState({
        startDate: "",
        endDate: ""
    });

    function getData() {
        const result: { [id: string]: number } = {};
        outlaysSlice.selectors.filterOutlays(store.getState(), currentFilter.filterName, currentFilter.params).forEach((outLay) => {
            if (outLay.type === OutlayType.OUTLAY) {
                const sum = outLay.sum;
                const category = categoriesSlice.selectors.highestCategoryName(store.getState(), outLay.category);
                if (category in result) {
                    result[category] = Number(result[category]) + Number(sum);
                } else {
                    result[category] = Number(sum);
                }
            }
        })

        return [["Categories", "Sum"], ...Object.keys(result).map((key) => [key, Number(result[key])])];
    }

    const handleChangeChart = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked} = event.target;
        setSearchParams(params => {
            params.set("isChart", `${checked}`);
            return params;
        });
    };

    const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, innerHTML } = event.target;
        if(value === "betweenTwoDates") {
            setCurrentFilter({
                filterName: value,
                title: innerHTML,
                params: {
                    startDate: "",
                    endDate: ""
                }
            });
        } else {
            setCurrentFilter({
                filterName: value,
                title: innerHTML,
                params: {}
            });
        }
        setSearchParams(params => {
            params.set("filter", JSON.stringify(currentFilter));
            return params;
        });
    };

    const handleChangeDates = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setDatesParams((prevState) =>({
            ...prevState,
            [id]: value
        }))
        setCurrentFilter((prevState) => ({
            ...prevState,
            params: {
                ...datesParams
            }
        }));
        setSearchParams(params => {
            params.set("filter", JSON.stringify(currentFilter));
            return params;
        });
    }

    return (
        <>
            <fieldset>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="isChart" checked={searchParams.get("isChart") === "true"} onChange={handleChangeChart} />
                    <label className="form-check-label" htmlFor="isChart">Show data as PieChart</label>
                </div>
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    {defaultFilters.map((filter, index) => {
                        return <>
                            <input key={index} type="radio" className="btn-check" name="filterRadio" id={`filterRadio${index}`} autoComplete="off" value={filter.filterName} checked={filter.filterName === currentFilter.filterName} onChange={handleRadioButtonChange} />
                            <label className="btn btn-outline-primary" htmlFor={`filterRadio${index}`}>{filter.title}</label>
                        </>
                    })}
                </div>
                { currentFilter.filterName === "betweenTwoDates" ? (<>
                    <div>
                        <label htmlFor="startDate" className="form-label mt-1">Start Date</label>
                        <input type="datetime-local" className="form-control" id="startDate" value={datesParams.startDate} onChange={handleChangeDates} />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="form-label mt-1">End Date</label>
                        <input type="datetime-local" className="form-control" id="endDate" value={datesParams.endDate} onChange={handleChangeDates} />
                    </div>
                </>) : (<></>)}
            </fieldset>
            {searchParams.get("isChart") === "true" ? (
                <OutlayTable filter={currentFilter.filterName} params={currentFilter.params} />
            ) : (
                <Chart
                    chartType="PieChart"
                    data={getData()}
                    options={{title: `My ${currentFilter.title} outlays`}}
                    width={"100%"}
                    height={"400px"}
                />
            )}
        </>
    );
}
