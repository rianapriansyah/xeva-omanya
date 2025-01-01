﻿import React from 'react';
// import { Transaction } from '../../types/interfaceModel';
import { Typography } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';

const Dashboard: React.FC = () => {


	return (
		<React.Fragment>
			<Typography variant="h5" gutterBottom>
				Dashboard
			</Typography>
			<BarChart
				xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
				series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
				width={500}
				height={300}
			/>
			<LineChart
				xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
				series={[
					{
						data: [2, 5.5, 2, 8.5, 1.5, 5],
					},
				]}
				width={500}
				height={300}
			/>
			<PieChart
				series={[
					{
						data: [
							{ id: 0, value: 10, label: 'series A' },
							{ id: 1, value: 15, label: 'series B' },
							{ id: 2, value: 20, label: 'series C' },
						],
					},
				]}
				width={400}
				height={200}
			/>
		</React.Fragment>
	);
};

export default Dashboard;
