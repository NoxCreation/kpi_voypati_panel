"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import {
    Cell,
    LabelList,
    Legend,
    Pie,
    PieChart,
    Tooltip,
} from "recharts"

export const CardPieChartOrderClient = ({
    dataPie
}: {
    dataPie: Array<{ name: string, value: number }>
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

    const chart = useChart({
        data: dataPie.map(e => ({
            ...e,
            color: getVividRandomHexColor()
        })),
    })

    return (
        <Chart.Root boxSize="400px" mx="auto" chart={chart}>
            <PieChart >
                <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip hideLabel />}
                />
                <Legend content={<Chart.Legend />} />
                <Pie
                    isAnimationActive={true}
                    data={chart.data}
                    dataKey={chart.key("value")}
                    nameKey="name"
                >
                    <LabelList position="inside" fill="white" stroke="none" />
                    {chart.data.map((item) => (
                        <Cell key={item.name} fill={chart.color(item.color)} />
                    ))}
                </Pie>
            </PieChart>
        </Chart.Root>
    )
}
