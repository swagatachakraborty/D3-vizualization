const drawBuildings = buildings => {
  const chartSize = { width: 600, height: 400 };
  const margin = { left: 100, right: 10, top: 10, bottom: 150 };

  const height = chartSize.height - margin.top - margin.bottom;
  const width = chartSize.width - margin.left - margin.right;

  const y = d3
    .scaleLinear()
    .domain([0, _.maxBy(buildings, 'height').height])
    .range([height, 0]);

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(_.map(buildings, 'name'))
    .padding(0.3);

  const svg = d3
    .select('#chart-area')
    .append('svg')
    .attr('height', chartSize.height)
    .attr('width', chartSize.width);

  g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.append('text')
    .attr('class', 'x axis-lable')
    .attr('x', width / 2)
    .attr('y', height + 140)
    .text('Tall Buildings');

  g.append('text')
    .text('Height in m.')
    .attr('class', 'y axis-lable')
    .attr('x', -height / 2)
    .attr('y', -60)
    .attr('transform', 'rotate(-90)');

  const yAxis = d3
    .axisLeft(y)
    .tickFormat(d => d + 'm')
    .ticks(3);

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  const xAxis = d3.axisBottom(x);
  g.append('g')
    .attr('class', 'x-axis')
    .call(xAxis)
    .attr('transform', `translate(0, ${height})`);

  d3.selectAll('.x-axis text')
    .attr('x', -5)
    .attr('y', 10)
    .attr('transform', 'rotate(-45)')
    .attr('text-anchor', 'end');

  const rectangles = g.selectAll('rect');
  const newRects = rectangles
    .data(buildings)
    .enter()
    .append('rect')
    .attr('y', b => y(b.height))
    .attr('x', b => x(b.name))
    .attr('height', b => y(0) - y(b.height))
    .attr('width', x.bandwidth);
  // .attr('transform', 'rotate(90)');
};

const main = () => {
  d3.json('data/buildings.json').then(drawBuildings);
};

window.onload = main;
