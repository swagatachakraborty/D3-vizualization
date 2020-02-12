const drawCompanies = (companies, yAxisValue) => {
  const chartSize = { width: 800, height: 600 };
  const margin = { left: 100, right: 10, top: 10, bottom: 150 };

  const height = chartSize.height - margin.top - margin.bottom;
  const width = chartSize.width - margin.left - margin.right;

  const y = d3
    .scaleLinear()
    .domain([0, _.maxBy(companies, yAxisValue)[yAxisValue]])
    .range([height, 0]);

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(_.map(companies, 'Name'))
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
    .text('Companies');

  g.append('text')
    .text(yAxisValue + ' in Rs.')
    .attr('class', 'y axis-lable')
    .attr('x', -height / 2)
    .attr('y', -60)
    .attr('transform', 'rotate(-90)');

  const yAxis = d3
    .axisLeft(y)
    .tickFormat(d => d + '/-')
    .ticks(12);

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
    .data(companies)
    .enter()
    .append('rect')
    .attr('y', c => y(c[yAxisValue]))
    .attr('x', c => x(c.Name))
    .attr('height', c => y(0) - y(c[yAxisValue]))
    .attr('width', x.bandwidth);
};

const main = () => {
  d3.csv('data/companies.csv', company => {
    return {
      Name: company.Name,
      CMP: +company.CMP,
      PE: +company.PE,
      MarketCap: +company.MarketCap,
      DivYld: +company.DivYld,
      QNetProfit: +company.QNetProfit,
      QSales: +company.QSales,
      ROCE: +company.ROCE
    };
  }).then(c => drawCompanies(c, 'CMP'));
};

window.onload = main;
