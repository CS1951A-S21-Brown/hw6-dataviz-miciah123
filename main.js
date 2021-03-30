// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 250};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) + 100, graph_1_height = 400;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let graph_1_y_off = 35;
let graph_1_x_off = 35;

//set up svg
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     
    .attr("height", graph_1_height)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);   

// Set up reference to count SVG group
let countRef = svg.append("g");

d3.csv("./data/video_games.csv").then(function(data) {
    //clean and loaf
    data = cleanData(data, function(a,b) {return parseFloat(b.global_sales) - parseFloat(a.global_sales)} , 20);

      // Set up reference to tooltip
    let tooltip = d3.select("#graph1")     
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)

    //linear scale for the x axis 
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return parseFloat(d.global_sales)})])
        .range([0, graph_1_width - margin.left - margin.right]);
  
    //y scale band
    let y = d3.scaleBand()
        .domain(data.map(function (d) {return d.name}))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.3); 
 
    
    //y ticks
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    //color scale
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["name"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));



    //Mouseover function to display the tooltip on hover
    let mouseover = function(d) {
        let color_span = `<span style="color: ${color(d.name)};">`;
        let html = `
                ${color_span}${d.name}</span><br/>
                Sales: ${color_span}${d.global_sales} Million</span>`;       

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip.html(html)
            .style("left", `${(d3.event.pageX) + 100}px`)
            .style("top", `${(d3.event.pageY) - 30}px`)
            .style("box-shadow", `2px 2px 5px ${color(d.name)}`)    
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    };

    let mouseout = function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    let bars = svg.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['name']) }) 
        .attr("y", function(d) {return y(d['name'])})               
        .attr("width", function(d) {return x(parseFloat(d['global_sales']))})
        .attr("height",  y.bandwidth())
        .on("mouseover", mouseover) 
        .on("mouseout", mouseout);        
  
    let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {return x(parseFloat(d.global_sales)) + 10})       
        .attr("y", function(d) {return y(d.name) + 10})       
        .style("text-anchor", "start")
        .text(function (d) {return parseFloat(d.global_sales)});           


    //x-axis label
    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, ${graph_1_height - margin.top - margin.bottom + 20})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (Millions of Copies)");

    //y-axis label
    svg.append("text")
        .attr("transform", `translate(-190, ${(graph_1_height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Game Title");

});

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    return data.slice(0 , numExamples);
}

