// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// console.log(height);

// Create svg wrapper, append an svg group that will hold the chart
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Bonus Section
// initial axis params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d =>[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

// render xAxis functions
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d =>[chosenYAxis]) * 1.2
        ])
        .range([0, height]);

    return yLinearScale;
}

// render xAxis functions
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with transition

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))
        .attr('cy', d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel;
    var ylabel;

    if (chosenXAxis === 'poverty') {
        xlabel = 'poverty'
    }
    else if (chosenXAxis === 'age') {
        xlabel = 'age'
    }
    else {
        xlabel = 'income'
    }

    if (chosenYAxis === 'healthcare') {
        ylabel = 'healthcare'
    }
    else if (chosenYAxis === 'smokes') {
        ylabel = 'smokes'
    }
    else {
        ylabel = 'obesity'
    }

    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offest([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    })
        .on('mouseout', function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv('data.csv').then(function(data, err) {
    if (err) throw err;

    // parse data
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
    });

    // linear scale
    var xLinearScale = xScale(data, chosenXAxis);

    // create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([height, o]);
    
    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append('g')
        .call(leftAxis);
    
    // append initial circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('fill', 'pink')
        .attr('opacity', '.5');
    
    // create group for x-axis labels
    var XlabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);
    
    var povertyLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)');
    
    var ageLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)
        .text('Age (Median)');
        
    var incomeLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'income')
        .classed('active', true)
        .text('Household Income (Median)');

    // Create group for y-axis labels
    var YLabelsGroup = chartGroup.appen('g')
        .attr('transform', `translate(${height / 2}, ${widht + 20}`);
    
    var lhealthcareLabel = YlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Lacks Healthcare (%)');
    
    var smokesLabel = YlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'smokes')
        .classed('active', true)
        .text('Smokes (%)');
        
    var obesityLabel = YlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'obesity')
        .classed('active', true)
        .text('Obesity (%)');
    
    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Number of Billboard 500 Hits");
    
    // update ToolTip function 
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
    
})