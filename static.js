// Add your JavaScript code here
const MAX_WIDTH3 = Math.max(1080, window.innerWidth);
const MAX_HEIGHT3 = 720;
const margin3 = {top: 40, right: 100, bottom: 40, left: 250};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width3 = (MAX_WIDTH / 2) + 100, graph_1_height3 = 400;
let graph_2_width3 = (MAX_WIDTH / 2) - 10, graph_2_height3 = 275;
let graph_3_width3 = MAX_WIDTH / 2 + 50, graph_3_height3 = 350;


//set up svg
let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width3)     
    .attr("height", graph_3_height3)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef3 = svg3.append("g");

d3.csv("../data/video_games.csv").then(function(data) {
    
    let genreNest = d3.nest()
        .key(function(d) {return d.Genre})
        .entries(data);

    let genres = genreNest.map(function(d) { return d.key });


    const topPubs = []
    for(i = 0; i < genres.length; i++){
        let genreData = filterGenre(data, genres[i]);

        let pubGenreRollup = d3.nest()
            .key(function(d) {return d.Publisher})
            .rollup(function(v) { return d3.sum(v, function(d) {return d.global_sales; }); })
            .entries(genreData);

        let sortedRollup = pubGenreRollup.sort(function(a , b) {return parseInt(b.value) - parseInt(a.value)});

        topPubs[i] = sortedRollup[0];
    }

    let publishers = topPubs.map(function(d) { return d.key })

    //update toppubs to be by genre
    for (i=0; i < topPubs.length; i++){
        topPubs[i].key = genres[i] + " -- (" + publishers[i] + ")";
    }

    let x = d3.scaleLinear()
        .domain([0, d3.max(topPubs, function(d) {return parseInt(d.value)})])
        .range([0, graph_3_width3 - margin.left - margin.right]);
    
    
    let y = d3.scaleBand()
        .domain(topPubs.map(function(d) {return d.key}))
        .range([0, graph_3_height3 - margin.top - margin.bottom])
        .padding(0.1);

    svg3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
        .domain(topPubs.map(function(d)  {return d.key} ) )
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 12));
    
    let bars = svg3.selectAll("rect").data(topPubs)

    
  

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) {return color(d.key)} ) 
        .attr("x", x(0))
        .attr("y", function(d) {return y(d.key) })             
        .attr("width", function (d) { return x ( parseInt(d.value) )  } )
        .attr("height",  y.bandwidth());

    let counts = countRef3.selectAll("text").data(topPubs);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {return x( parseInt (d.value) + 13)} )      
        .attr("y", function(d) {return y(d.key) + 13})        
        .style("text-anchor", "start")
        .text(function (d) {return parseInt(d.value)}); 


    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width3 - margin.left - margin.right)/2}, ${graph_3_height3 - margin.top - margin.bottom + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (Millions of Copies)");

    // TODO: Add y-axis label
    svg3.append("text")
        .attr("transform", `translate(-180, ${(graph_3_height3 - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Genre");

});

function filterGenre(data, genre) {
    return data.filter(function(a) { return a.Genre === (genre); });
}

