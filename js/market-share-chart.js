// Data
const data = [
    { company: "WPP AUNZ", revenue: 251.9, percentage: 8 },
    { company: "Omnicom Media", revenue: 205.7, percentage: 6.6 },
    { company: "Interpublic Group", revenue: 154.9, percentage: 4.9 },
    { company: "Other companies", revenue: 2500, percentage: 80.5 }
];

const colorScheme = ["#6E62F5", "#A53C6C", "#BF9C72", "#CFD8DC"];

// Set up SVG container
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

const width = 600;
const height = 300;
const radius = Math.min(width, height) / 2;
const innerRadius = 0.5 * radius;

const svg = d3.select("#market-share-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Create pie generator
const pie = d3.pie()
    .value(d => d.revenue)
    .sort(null);

// Generate pie slices
const path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(innerRadius);

// Append slices to SVG
const arc = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


arc.append("path")
    .attr("d", path)
    .attr("fill", (d, i) => colorScheme[i]);

// Tooltip
const tooltip = d3.select("#market-share-chart")
    .append("div")
    .attr("id", "market-share-tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Tooltip event handlers
function handleMouseOver(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(tooltipHTML(d.data))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");

    // change arc styles on hover
    arc.style("opacity", 0.5);
    d3.select(this).style("opacity", 1);
}

function handleMouseOut() {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);

        arc.style("opacity", 1);

}

// Function to generate tooltip HTML
function tooltipHTML(data) {
    return `${data.company} revenue: $${data.revenue}m <br/> <strong class="tooltip-value">${data.percentage}%</strong>`;
}

// Style the tooltip
tooltip.style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
    .style("font-size", "12px")
    .style("pointer-events", "none");

// Legend
const legend = svg.selectAll(".legend")
    .data(data)
    .enter().append("g")
    .attr("id", "market-share-legend")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return `translate(${i % 2 * 300 - 300},${Math.floor(i / 2) * 20 + height / 2 + 20})`; });

legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("fill", (d, i) => colorScheme[i]);

legend.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .attr("dy", "11px")
    .style("font-size", "12px")
    .style("font-family", "Roboto, sans-serif")
    .style("fill", "#666")
    .attr('letter-spacing', '0.5')
    .text(function(d) { return `${d.company} $${d.revenue}m (${d.percentage}%)`; });
