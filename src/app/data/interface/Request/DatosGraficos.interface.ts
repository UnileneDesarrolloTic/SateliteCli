import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexStroke, ApexTooltip } from "./GraficosModel.interfaces";

export interface visitseparationChartOptions {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	stroke: ApexStroke;
	dataLabels: ApexDataLabels;
	legends: ApexLegend;
	labels: any;
	name: any;
	tooltip: ApexTooltip ;
	colors: string[];
	plotOptions: ApexPlotOptions
}