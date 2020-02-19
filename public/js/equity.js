const CHART_SIZE = { width: 1100, height: 700 };
const MARGIN = { left: 150, right: 10, top: 10, bottom: 150 };
const HEIGHT = CHART_SIZE.height - MARGIN.top - MARGIN.bottom;
const WIDTH = CHART_SIZE.width - MARGIN.left - MARGIN.right;

const firstDate = data => _.first(data).Date;
const lastDate = data => _.last(data).Date;
const minPrice = data => _.minBy(data, 'Close').Close;
const maxPrice = data => _.maxBy(data, 'Close').Close;

const initializeVizualization = function() {
  const svg = d3
    .select('svg')
    .attr('width', CHART_SIZE.width)
    .attr('height', CHART_SIZE.height);

  const g = svg
    .append('g')
    .attr('class', 'prices')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`); //read

  g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 140)
    .text('Time');

  g.append('text')
    .attr('class', 'y axis-label')
    .attr('transform', `rotate(-90)`)
    .attr('x', -HEIGHT / 2)
    .attr('y', -60)
    .text('Close');

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${HEIGHT})`);

  g.append('g').attr('class', 'y axis');
};

const updateChart = function(data) {
  const svg = d3.select('#chart-area svg');

  const y = d3
    .scaleLinear() //read
    .range([HEIGHT, 0])
    .domain([minPrice(data), maxPrice(data)]);

  const x = d3
    .scaleTime() //read
    .range([0, WIDTH])
    .domain([firstDate(data), lastDate(data)]);

  const yAxis = d3.axisLeft(y).ticks(5); //read

  svg.select('.y.axis').call(yAxis);

  const xAxis = d3.axisBottom(x);

  svg.select('.x.axis').call(xAxis);

  const closingPriceLine = d3
    .line() //read
    .x(q => x(q.Date))
    .y(q => y(q.Close));

  svg
    .select('.prices')
    .append('path') //read
    .attr('class', 'close')
    .attr('d', closingPriceLine(data));

  const SMALine = d3
    .line() //read
    .x(q => x(q.Date))
    .y(q => y(q.SMA));

  svg
    .select('.prices')
    .append('path') //read
    .attr('class', 'sma')
    .attr('d', SMALine(_.drop(data, 99)));
};

const parseData = function({ Date, Volume, AdjClose, ...rest }) {
  Date = new window.Date(Date);
  _.forEach(rest, (val, key) => {
    rest[key] = +val;
  });
  return { Date, ...rest };
};

const addSMADetails = data => {
  data.map((val, i) => {
    if (i >= 99)
      val.SMA =
        data.slice(i - 99, i + 1).reduce((init, val) => init + val.Close, 0) /
        100;
  });
};

const main = () => {
  d3.csv('data/nifty.csv', parseData).then(d => {
    initializeVizualization();
    addSMADetails(d);
    updateChart(d);
  });
};

window.onload = main;
