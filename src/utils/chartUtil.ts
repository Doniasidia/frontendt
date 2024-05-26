export const generateYAxis = (revenue: { date: string, amount: number }[]) => {
    const yAxisLabels = [];
    const highestRecord = Math.max(...revenue.map((date) => date.amount));
    const topLabel = Math.ceil(highestRecord / 1000) * 1000;

    for (let i = topLabel; i >= 0; i -= 1000) {
        yAxisLabels.push(`${i} TND`);
    }

    return { yAxisLabels, topLabel };
};