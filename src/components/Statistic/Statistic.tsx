import React from "react";
import { Chart } from "react-google-charts";
import { categoriesSlice, outlaysSlice, store } from "../../store/Store";
import { OutlayType } from "../../store/Store.types";

export default function Statistic() {

    const options = {
        title: "My last week outlays",
    };

    function getData() {
        const result: { [id: string]: number } = {};
        outlaysSlice.selectors.lastWeekOutlays(store.getState()).forEach((outLay) => {
            if (outLay.type === OutlayType.OUTLAY) {
                const sum = outLay.sum;
                const category = categoriesSlice.selectors.highestCategoryName(store.getState(), outLay.category);
                if (category in result) {
                    result[category] += sum;
                } else {
                    result[category] = sum;
                }
            }
        })

        return [["Categories", "Sum"], ...Object.keys(result).map((key) => [key, Number(result[key])])];
    }

    return (
        <>
            <Chart
                chartType="PieChart"
                data={getData()}
                options={options}
                width={"100%"}
                height={"400px"}
            />
        </>
    );
}