import * as d3 from "d3";

const addTitleAndLabels = (svg, title, xlabel, ylabel) => {
  svg.selectAll(".title, .xlabel, .ylabel").remove();

  svg.append("text")
    .attr("class", "title")
    .attr("x", 300)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(title);

  svg.append("text")
    .attr("class", "xlabel")
    .attr("x", 300)
    .attr("y", 440)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(xlabel);

  svg.append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("x", -225)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(ylabel);
};

export const renderBarChart = (svg, data) => {
  const margin = {top: 60, right: 30, bottom: 60, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map((_, i) => i))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .nice()
    .range([height, 0]);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => x(i))
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d))
    .attr("fill", "steelblue");

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  addTitleAndLabels(svg, "Bar Chart", "Index", "Value");
};

export const renderLineChart = (svg, data) => {
  const margin = {top: 60, right: 30, bottom: 60, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .nice()
    .range([height, 0]);

  const line = d3.line()
    .x((_, i) => x(i))
    .y(d => y(d));

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  addTitleAndLabels(svg, "Line Chart", "Index", "Value");
};

export const renderCategoricalBarChart = (svg, data) => {
  const margin = {top: 60, right: 30, bottom: 100, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const counts = d3.rollup(data, v => v.length, d => d);
  const categories = Array.from(counts.keys());
  const values = Array.from(counts.values());

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(categories)
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(values) || 0])
    .nice()
    .range([height, 0]);

  g.selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("x", d => x(d))
    .attr("y", d => y(counts.get(d)))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(counts.get(d)))
    .attr("fill", "steelblue");

  g.append("g").call(d3.axisLeft(y));
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  addTitleAndLabels(svg, "Categorical Bar Chart", "Category", "Count");
};

export const renderPieChart = (svg, data) => {
  svg.selectAll("*").remove();

  const counts = d3.rollup(data, v => v.length, d => d);
  const categories = Array.from(counts.keys());
  const values = Array.from(counts.values());

  const width = 600;
  const height = 450;
  const radius = Math.min(width, height) / 3;

  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie()(values);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

  g.selectAll("path")
    .data(pie)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (_, i) => color(categories[i]))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  const legend = svg.append("g").attr("transform", `translate(${width - 150}, 50)`);
  categories.forEach((cat, i) => {
    const y = i * 25;
    legend.append("rect").attr("x", 0).attr("y", y).attr("width", 20).attr("height", 20).attr("fill", color(cat));
    legend.append("text").attr("x", 25).attr("y", y + 15).text(cat).style("font-size", "14px");
  });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .text("Pie Chart");
};
