var width = 1050
    height = 450
    margin = 40

var radius = Math.min(width, height) / 2 - margin 

let svg2 = d3.select("#graph2")      
    .append("svg")
    .attr("width", width)     
    .attr("height", height)   
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");    // HINT: transform

function setData(region) {
        
    d3.csv("./data/video_games.csv").then(function(data) {
        svg2.selectAll('path').remove();
        svg2.selectAll('g').remove();        

        let rollup = d3.nest()
            .key(function(d) {return d.Genre})
            .rollup(function(v) { return d3.sum(v, function(d) {return d[region]; }); })
            .entries(data);
    
        let genre = rollup.map(function(d) { return d.key });
        let sales = rollup.map(function(d) { return d.value });

        for (i=0; i < rollup.length; i++){
            rollup[i].value = parseInt(rollup[i].value) + '     (Million Copies)';
        }

        let pie = d3.pie()
                    .value(function(d) {return parseInt(d.value); })

        let pie_ready = pie(rollup)


        let color = d3.scaleOrdinal()
            .domain(rollup)
            .range(d3.schemeSet2);

        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        
        svg2.selectAll('n')
            .data(pie_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator
            )
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)


        let legend = svg2.append("g")
            .attr("class", "legend")
            .selectAll("g")
            .data(pie_ready)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(-500," + i * 18 + ")"; });
      
        
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 13)
            .style("fill", function(d, i) {
        return color(d.data.key);});
      
        legend.append("text")
            .attr("x", 30)
            .attr("y", 4)
            .attr("dy", ".25em")
            .text(function(d) { return d.data.key; });

        legend.append("text")
            .attr("x", 150)
            .attr("y", 4)
            .attr("dy", ".25em")
            .text(function(d) { return d.data.value; });
            
    });
}

setData('NA_Sales')