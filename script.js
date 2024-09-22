// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 30},
    width = 360 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/JBreitenbr/psychic-meme/refs/heads/main/bars.csv", function(data) {
  const filt = data.filter(d => d.country === "Germany");
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(3)
  var sg2=data.columns.slice(2,3)
  console.log(sg2)
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(filt, function(d){return(d.year)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 8])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (filt)
  let sD2_=d3.stack().keys(sg2)(filt)
  console.log(sD2_[0])
  let sD2=[];
  for(let i=0;i<10;i++){
    sD2.push(sD2_[0][i][1])
  }
  console.log(sD2)
 var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }
for(let i=0;i<10;i++) {
  svg.append("text").attr("x",x(2015+i)).attr("y",y(sD2[i])-3).text(sD2[i].toFixed(3)).style("font-size","10px");
}
  
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
       .attr("width",x.bandwidth()).attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  
})

