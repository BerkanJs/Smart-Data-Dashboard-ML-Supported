import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import {
  renderBarChart,
  renderPieChart,
  renderLineChart,
  renderCategoricalBarChart,
  // renderBubbleChart, // Bunlar sende varsa dahil et
  // renderMultiLineChart,
} from '../ChartRenderer';

const VisualizationModal = ({ isOpen, onClose, csvData }) => {
  const [columns, setColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});
  const [selectedCols, setSelectedCols] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [error, setError] = useState('');
  const [renderChart, setRenderChart] = useState(null);

  const cleanColumnName = (colName) =>
    colName.replace(/[^a-zA-Z0-9_]/g, '').trim().toLowerCase();

  const detectColumnTypes = (data, cols) => {
    const types = {};
    const sample = data.slice(0, 20);
    cols.forEach((col) => {
      const values = sample.map((row) => row[col]);

      const numericCount = values.filter(
        (v) => !isNaN(parseFloat(v)) && v !== ''
      ).length;
      const hasDecimal = values.some((v) => v.includes('.'));

      if (numericCount > sample.length / 2) {
        types[col] = hasDecimal ? 'float' : 'int';
      } else {
        types[col] = 'categorical';
      }
    });
    return types;
  };

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const cols = Object.keys(csvData[0]);
      setColumns(cols);
      setColumnTypes(detectColumnTypes(csvData, cols));
      setSelectedCols([]); // Reset seçimi csvData değişince
      setError('');
      setRenderChart(null);
    }
  }, [csvData]);

  const handleColSelect = (col) => {
    const maxCols = ['multiline', 'bubble'].includes(chartType) ? 3 : 1;
    const updated = selectedCols.includes(col)
      ? selectedCols.filter((c) => c !== col)
      : [...selectedCols, col].slice(0, maxCols);
    setSelectedCols(updated);
  };

  const getDataSubset = (data, maxRows = 500) => data.slice(0, maxRows);

  const aggregateData = (data, numBins = 15) => {
    const binSize = Math.ceil(data.length / numBins);
    const aggregatedData = [];
    for (let i = 0; i < data.length; i += binSize) {
      const bin = data.slice(i, i + binSize);
      const avg =
        bin.reduce((sum, v) => sum + parseFloat(v) || 0, 0) / bin.length;
      aggregatedData.push(avg);
    }
    return aggregatedData;
  };

  const convertDataToInt = (data) =>
    data.map((v) => {
      const num = parseFloat(v);
      return isNaN(num) ? v : Math.round(num);
    });

  const handleRenderChart = () => {
    setError('');
    const minCols = ['multiline', 'bubble'].includes(chartType) ? 2 : 1;
    if (selectedCols.length < minCols) {
      setError(`Bu grafik için en az ${minCols} sütun seçmelisiniz.`);
      return;
    }
    const subsetData = getDataSubset(csvData, 500);

    // Burada seçilen sütun isimlerini olduğu gibi kullanıyoruz.
    // cleanColumnName senin orijinal veri sütun adlarıyla eşleşmeyebilir.
    // Bu yüzden cleanColumnName fonksiyonunu kaldırdım ya da istersen uygulayabilirsin.

    const selectedData = selectedCols.map((col) =>
      subsetData.map((row) => row[col])
    );

    const summarizedData = selectedData.map((data) => aggregateData(data, 15));
    const intData = summarizedData.map((data) => convertDataToInt(data));

    if (
      intData.some((arr) =>
        arr.some((value) => isNaN(parseFloat(value)) || value === '')
      )
    ) {
      setError('Seçilen sütunlar sayısal değil. Lütfen doğru türde veri seçin.');
      return;
    }

    setRenderChart({ cols: selectedCols, data: intData });
  };

  const renderChartContent = () => {
    if (!renderChart) return;
    const { cols, data } = renderChart;
    const chartId = `chart-${cols.join('-').replace(/[^a-zA-Z0-9]/g, '-')}`;

    d3.select(`#${chartId}`).selectAll('*').remove();
    const svg = d3
      .select(`#${chartId}`)
      .append('svg')
      .attr('width', 800)
      .attr('height', 600);

    switch (chartType) {
      case 'bar':
        renderBarChart(svg, data[0], cols[0]);
        break;
      case 'pie':
        renderPieChart(svg, data[0], cols[0]);
        break;
      case 'line':
        renderLineChart(svg, data[0], cols[0]);
        break;
      case 'categorical':
        // categorical chart için data[0] değil, orijinal kategori verisi lazım,
        // bu yüzden direkt csvData'dan alıyoruz.
        renderCategoricalBarChart(svg, csvData.map((row) => row[cols[0]]));
        break;
      // case 'bubble':
      //   renderBubbleChart(svg, data, cols);
      //   break;
      // case 'multiline':
      //   renderMultiLineChart(svg, data, cols);
      //   break;
      default:
        break;
    }
  };

  useEffect(() => {
    renderChartContent();
  }, [renderChart]);

  if (!isOpen || !csvData || csvData.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-7xl relative flex overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="w-1/3 p-4">
          <h2 className="text-2xl font-semibold mb-4">Veri Görselleştirme</h2>

          <div className="grid grid-cols-1 gap-2 mb-4 max-h-60 overflow-y-auto">
            {columns.map((col) => (
              <label key={col} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col)}
                  onChange={() => handleColSelect(col)}
                  className="form-checkbox"
                />
                <span>
                  {col} ({columnTypes[col] || 'bilinmiyor'})
                </span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <select
              className="select select-bordered w-full bg-white"
              value={chartType}
              onChange={(e) => {
                setChartType(e.target.value);
                setSelectedCols([]); // grafik tipi değişince seçilen sütunları temizle
                setError('');
                setRenderChart(null);
              }}
            >
              <option value="bar">Çubuk Grafik</option>
              <option value="pie">Pasta Grafik</option>
              <option value="line">Çizgi Grafik</option>
              <option value="categorical">Kategorik Grafik</option>
              {/* <option value="bubble">Bubble Grafik</option> */}
              {/* <option value="multiline">Çoklu Çizgi Grafik</option> */}
            </select>
          </div>

          <button
            onClick={handleRenderChart}
            className="btn w-full text-white bg-gray-800 hover:bg-gray-700"
          >
            Grafiği Göster
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="w-2/3 p-4 overflow-auto" style={{ minHeight: 600 }}>
          {renderChart && (
            <div
              id={`chart-${renderChart.cols.join('-').replace(/[^a-zA-Z0-9]/g, '-')}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationModal;
