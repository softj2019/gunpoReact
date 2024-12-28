import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const DashboardCard = ({ title, data }) => {
  const COLORS = ['#4A5568', '#e74c3c'];
  const formattedData = title === '승객 재실 상태' ?
    [
      { name: '재실', value: data[0] },
      { name: '없음', value: data[1] }
    ] :
    [
      { name: 'ON', value: data[0] },
      { name: 'OFF', value: data[1] }
    ];

  const errorCount = data[1];
  const errorLabel = title === '승객 재실 상태' ? '없음' : 'OFF';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-center">{title}</h2>
      <div className="flex items-center justify-between">
        <div className="h-48 w-3/4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/4 text-center">
          <div className="bg-red-100 p-2 rounded-lg">
            <p className="text-red-600 font-bold text-xl">{errorCount}</p>
            <p className="text-red-600 text-sm">{errorLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OccupancyChart = ({ data, period, year }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const avgCount = Math.floor(totalCount / data.length);

  return (
    <div>
      <div className="flex justify-center gap-6 mb-4">
        <div className="bg-blue-50 px-6 py-3 rounded-lg">
          <p className="text-gray-600 text-sm">총 재실인원</p>
          <p className="text-blue-600 text-3xl font-bold text-center">{totalCount.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 px-6 py-3 rounded-lg">
          <p className="text-gray-600 text-sm">평균 재실인원</p>
          <p className="text-green-600 text-3xl font-bold text-center">{avgCount.toLocaleString()}</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              name={`${year}년 ${period} 재실인원`}
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
              label={{
                position: 'top',
                fill: '#3B82F6',
                fontSize: 14,
                fontWeight: 'bold',
                offset: 10
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const OccupancyStats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  const years = Array.from({ length: 24 }, (_, i) => (2024 - i).toString());

  const generateYearData = (year) => {
    const monthlyData = Array.from({ length: 31 }, (_, i) => ({
      date: `${i + 1}일`,
      count: Math.floor(Math.random() * 300 + 100)
    }));

    const yearlyData = Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}월`,
      count: Math.floor(Math.random() * 8000 + 3000)
    }));

    return {
      monthly: monthlyData,
      yearly: yearlyData
    };
  };

  const yearData = generateYearData(selectedYear);

  const periodData = {
    monthly: { data: yearData.monthly, label: '월간' },
    yearly: { data: yearData.yearly, label: '년간' }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">재실인원 통계</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-gray-600">연도:</label>
            <select
              className="border rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-600">기간:</label>
            <select
              className="border rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="monthly">월간</option>
              <option value="yearly">년간</option>
            </select>
          </div>
        </div>
      </div>
      <OccupancyChart
        data={periodData[selectedPeriod].data}
        period={periodData[selectedPeriod].label}
        year={selectedYear}
      />
    </div>
  );
};

const SmartBusStopDashboard = () => {
  const dashboardData = [
    { title: '스마트스크린 상태', data: [1200, 34] },
    { title: '재실 감지 카메라 상태', data: [1000, 200] },
    { title: '통합보드 동작 상태', data: [1100, 50] },
    { title: '버스 승하차 알림 시스템', data: [950, 50] },
    { title: 'LTE 라우터 동작 상태', data: [950, 50] },
    { title: 'LED 등 동작 상태', data: [900, 100] },
    { title: '승객 재실 상태', data: [20, 5] },
    { title: '공기질표출장치 상태', data: [980, 20] }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">스마트 정류장 대시보드</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-gray-300">대시보드</a></li>
              <li><a href="#" className="hover:text-gray-300">시스템 상태</a></li>
              <li><a href="#" className="hover:text-gray-300">실시간 모니터링</a></li>
              <li><a href="#" className="hover:text-gray-300">제어</a></li>
              <li><a href="#" className="hover:text-gray-300">설정</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <h2 className="text-2xl font-bold mb-6">현재 시스템 상태</h2>
        <div className="grid grid-cols-4 gap-4">
          {dashboardData.map((item, index) => (
            <DashboardCard key={index} title={item.title} data={item.data} />
          ))}
        </div>
        <OccupancyStats />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        &copy; 2024 Gunpo City 스마트 정류장 시스템
      </footer>
    </div>
  );
};

export default SmartBusStopDashboard;