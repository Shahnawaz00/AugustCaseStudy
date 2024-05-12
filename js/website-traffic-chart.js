const data = [
    {
        type: "Luminary",
        referral: 8100,
        organic: 4200
    },
    {
        type: "Ignite",
        referral: 10700,
        organic: 20500
    },
    {
        type: "August",
        referral: 1300,
        organic: 6000
    }
];

const margin = { top: 50, right: 30, bottom: 40, left: 70 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#website-traffic-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
    .domain(data.map(d => d.type))
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.referral, d.organic))])
    .nice()
    .range([height, 0]);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(-35,${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSizeOuter(0));

const groups = svg.selectAll(".bar-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x(d.type)},0)`);

const bars = groups.selectAll(".bar")
    .data(d => Object.entries(d).slice(1))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x.bandwidth() / 4 * i)
    .attr("y", d => y(d[1]))
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("width", x.bandwidth() / 4 )
    .attr("height", d => Math.abs(y(d[1]) - y(0)))
    .attr("fill", (d, i) => i === 0 ? "#A53C6C" : i === 1 ? "#47689B" : "#47689B")
    .on("mouseover", function (event, d) {
        const tooltip = d3.select("#website-traffic-tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d[0]} traffic<br><strong class="tooltip-value">${d[1]} users</strong>`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");

        bars.style("opacity", 0.5);
        d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function () {
        d3.select("#website-traffic-tooltip").transition().duration(500).style("opacity", 0);

        // Restore the opacity of all bars
        bars.style("opacity", 1);
    });

const tooltipDiv = d3.select("body").append("div")
    .attr("id", "website-traffic-tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style(":after", "content: ''; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #f9f9f9 transparent transparent transparent");

const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 400}, ${20})`);

const legendItems = ['Referral', 'Organic'];
const legendColors = ['#A53C6C', '#47689B'];
const legendItemWidth = 100;

legend.selectAll('.legend-item')
    .data(legendItems)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(${i * legendItemWidth}, 0)`);

legend.selectAll('.legend-item')
    .append('rect')
    .attr('x', 210)
    .attr('y', -42)
    .attr('width', 10)
    .attr('height', 10)
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', (d, i) => legendColors[i]);

legend.selectAll('.legend-item')
    .append('text')
    .attr('x', 226)
    .attr('y', -33)
    .text(d => d)
    .attr('fill', '#666')
    .attr('letter-spacing', '0.5')
    .attr('font-size', '10px');

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr('letter-spacing', '0.5')
    .style("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "#666")
    .style("font-family", "Roboto, sans-serif")
    .text("Users / month");

svg.selectAll('.x-axis line')
    .attr('stroke', '#ccc')
    .attr('stroke-dasharray', '2,2');

svg.selectAll('.x-axis text')
    .attr('fill', '#666')
    .attr('font-size', '12px')
    .attr('letter-spacing', '0.5');

svg.selectAll('.y-axis line')
    .attr('stroke', '#ccc')
    .attr('stroke-dasharray', '2,2');

svg.selectAll('.y-axis text')
    .attr('fill', '#666')
    .attr('font-size', '12px');

svg.selectAll('.y-axis line')
    .clone()
    .attr('class', 'horizontal-line')
    .attr('x1', 0)
    .attr('x2', width);

svg.select('.x-axis path').remove();
svg.select('.y-axis path').remove();
