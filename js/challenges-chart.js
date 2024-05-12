// Data
const data = [
    { indicator: "Communication", percentage: 18 },
    { indicator: "Limited understanding of company strategy and history", percentage: 17 },
    { indicator: "Project Management", percentage: 17 },
    { indicator: "Performance tracking", percentage: 13 },
    { indicator: "Limited ability to integrate channels, and technologies", percentage: 11 },
    { indicator: "Movement from strategic to tactical execution", percentage: 10 },
    { indicator: "Lack of innovative ideas", percentage: 8 },
    { indicator: "Lack of practical ideas", percentage: 6 }
];

// Set up SVG container
const margin = { top: 20, right: 30, bottom: 60, left: 150 }; 
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#challenges-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.percentage)])
    .range([0, width]);

const y = d3.scaleBand()
    .domain(data.map(d => d.indicator))
    .range([0, height])
    .padding(0.1);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`) 
    .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll("text")
    .call(wrap, margin.left); 

const bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0) 
    .attr("y", d => y(d.indicator))
    .attr("width", d => x(d.percentage))
    .attr("height", y.bandwidth())
    .attr("fill", "#72BDBF")
    .on("mouseover", function (event, d) {
        const tooltip = d3.select("#challenges-chart-tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.indicator}: <br/> <strong class="tooltip-value" > ${d.percentage}%</strong>`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");

        bars.style("opacity", 0.5);
        d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function () {
        d3.select("#challenges-chart-tooltip").transition().duration(500).style("opacity", 0);

        bars.style("opacity", 1);
    });

 // Append x-axis label
svg.append("text")
.attr("class", "x-axis-label")
.attr("x", width / 2)
.attr("y", height + 25)
.attr("dy", "1.5em")
.style("text-anchor", "middle")
.style("fill", "#666")
.style("font-size", "11px")
.style("letter-spacing", "0.5")
.text("Percentage of Respondents");

// Append a div for the tooltip
const tooltipDiv = d3.select("body").append("div")
    .attr("id", "challenges-chart-tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style(":after", "content: ''; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #f9f9f9 transparent transparent transparent"); // This creates a downward pointing arrow

// Style x-axis lines and texts
svg.selectAll('.x-axis line')
    .attr('stroke', '#ccc')
    .attr('stroke-dasharray', '2,2');

svg.selectAll('.x-axis text')
    .attr('fill', '#666')
    .attr('font-size', '12px')
    .attr('letter-spacing', '0.5');

// Style y-axis lines and texts
svg.selectAll('.y-axis line')
    .attr('stroke', '#ccc')
    .attr('stroke-dasharray', '2,2');

svg.selectAll('.y-axis text')
    .attr('fill', '#666')
    .attr('font-size', '11px');


// Remove x-axis line
svg.select('.x-axis path').remove();

// Remove y-axis line
svg.select('.y-axis path').remove();

// Function to wrap long text
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", -9).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", -6).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

