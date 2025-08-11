"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export const CardLineChartOrderClient = ({
    dataLineCart
}: {
    dataLineCart: Array<{
        [name: string]: number
    }>
}) => {

    function getVividRandomHexColor() {
        const getExtremeChannel = () => {
            const extremes = [0, 255];
            const midRange = Math.floor(Math.random() * 128); // 0–127
            return extremes[Math.floor(Math.random() * 2)] === 0 ? midRange : 255 - midRange;
        };

        const r = getExtremeChannel();
        const g = getExtremeChannel();
        const b = getExtremeChannel();

        return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
    }

    const getSeries = () => {
        if (dataLineCart.length) {
            const keys = Object.keys(dataLineCart[0])
            return keys.slice(0, keys.length - 1).map(e => ({
                name: e, color: getVividRandomHexColor()
            })) as any
        }
        return []
    }

    const chart = useChart({
        data: dataLineCart,
        series: getSeries()
    })

    return (
        <Chart.Root maxH="sm" chart={chart}>
            <LineChart
                data={chart.data}
                margin={{ left: 20, bottom: 20, right: 20, top: 20 }}
            >
                <CartesianGrid stroke={chart.color("border")} vertical={false} />
                <XAxis
                    axisLine={false}
                    dataKey={chart.key("month")}
                    tickFormatter={(value) => value}
                    stroke={chart.color("border")}
                >
                    <Label value="fecha de creación de las órdenes" position="bottom" />
                </XAxis>
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    yAxisId="left"
                    dataKey={chart.key(dataLineCart.length > 0 ? Object.keys(dataLineCart[0])[0] : "")}
                    stroke={chart.color("border")}
                ></YAxis>

                <Tooltip
                    animationDuration={100}
                    cursor={{ stroke: chart.color("border") }}
                    content={<Chart.Tooltip />}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ marginTop: -20, marginRight: 20 }}
                    content={<Chart.Legend />}
                />
                {chart.series.map((item) => (
                    <Line
                        type="natural"
                        yAxisId={item.yAxisId}
                        key={item.name}
                        isAnimationActive={true}
                        dataKey={chart.key(item.name)}
                        fill={chart.color(item.color)}
                        stroke={chart.color(item.color)}
                        strokeWidth={2}
                    />
                ))}
            </LineChart>
        </Chart.Root>
    )
}
