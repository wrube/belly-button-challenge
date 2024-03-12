const url = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`

// set global variable data promise for access in functions
const dataPromise = d3.json(url);

// initialise the html
init();


/*--------------------------------------------------------------------
Functions used in this script below
--------------------------------------------------------------------
*/ 

/**
 * When the dropdown field in the html is engaged, this function will retrieve the dataset and
 * populate the plots with the updated dropdown sample id.
 * 
 * @param {string} activeID     onchange sample ID from dropdown
 */
function optionChanged(activeID) {

     // use the global dataPromise to access data
    dataPromise.then(jsonData => {  
        generatePlots(activeID, jsonData);
    })
}


/**
 * Populates the select tag in the html document.
 * 
 * @param {JSON} sampleData   JS object returned from url
 */
function populateDropdown (sampleData) {
    const testIDs = sampleData.names;

    // select dropdown object
    const dropDown = d3.select("#selDataset");
    console.log("dropdown text", )


    // populate the dropdown
    dropDown.selectAll('option')
        .data(testIDs)
        .enter()
        .append('option')
        .text(d => d)
}


/**
 * Organises and populates the html with various plot types of the dataset by calling 
 * the relevant plotting functions.
 * 
 * @param {string} activeID The sample id selected from the dropdown
 * @param {JSON} sampleData The JSON dataset 
 */
function generatePlots(activeID, sampleData) {
    // set the active meta and sample data
    let activeMeta = sampleData.metadata.find(obj => obj.id == activeID);
    let activeData = sampleData.samples.find(obj => obj.id == activeID);

    // print to console the active datasets
    console.log("active case metadata", activeMeta);
    console.log("active sample", activeData);

    // sort to the top 10 OTU's
    let sortedData = transformAndSort(activeData)
    let top10 = sortedData.slice(0, 10);
    top10.sort((a, b) => a.value - b.value); 

    // plot bar chart
    plotBarChart(top10);

    // draw bubble plot
    bubblePlot(sortedData);

    // set width of metadata container
    changeHTMLObjectWidth(275, ".col-md-2")

    // insert metadata
    metaDataTable(activeMeta);

    // plot wash frequency gauge
    gaugePlot(activeMeta)
}


/**
 * Set the width of a particular HTML object
 * 
 * @param {number} pixelWidth 
 * @param {string} objectID HTML object ID
 */
function changeHTMLObjectWidth(pixelWidth, objectID) {
    let object = d3.select(objectID);
    object.style("width", `${pixelWidth}px`)
}


/**
 * Uses Plotly to create a horizontal bar chart of a sample dataset.
 * 
 * @param {Array} dataObj Sample data for a particular test subject ID
 */
function plotBarChart(dataObj) {

    // set Plotly input
    const trace = {
        x: dataObj.map(sample => sample.value),
        y: dataObj.map(sample => sample.idString),
        text: dataObj.map(sample => sample.label),
        type: 'bar',
        orientation: 'h'
    }
    const data = [trace];

    const layout = {
        xaxis: {
            title: "Sample Value"},
        height: 500,
        width: 400
    }

    // plot
    Plotly.newPlot("bar", data, layout)
}


/**
 * Transforms the selected data object which corresponds to the sample data.
 *
 * @param {object} dataObj  Sample data for a particular test subject ID
 * @returns {Array} Descending ordered input dataset in an array 
 */
function transformAndSort(dataObj) {

    let dataArray = [];

    for (let index = 0; index < dataObj.otu_ids.length; index++) {
        // const element = dataObj.otu_ids[index];

        dataArray.push({
            id: dataObj.otu_ids[index],
            value: dataObj.sample_values[index],
            idString: `OTU ${dataObj.otu_ids[index]}`,
            label: dataObj.otu_labels[index] 
        })   
    }

    // sort in ascending order
    dataArray.sort((a, b) => {b.value - a.value});
    
    return dataArray
}


/**
 * Uses Plotly to generate a bubble plot of the sample data.
 * 
 * @param {Array} dataObj Sample data for a particular test subject ID 
 */
function bubblePlot(dataObj) {

    // map dataObj values to single array
    const ids = dataObj.map(sample => sample.id);
    const values = dataObj.map(sample => sample.value);
    const labels = dataObj.map(sample => sample.label);

    // set Plotly input
    const trace = {
        x: ids,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
          color: ids,
          colorscale: 'Portland',    
          opacity: 0.7,
          size: values
        }
      };
      
    const data = [trace];
      
    const layout = {
        xaxis: {
            title: "OTU ID"},
        yaxis: {
            title: "Sample Values"
        },
        showlegend: false,
        height: 500,
        width: 1000
      };
    
    // plot
    Plotly.newPlot("bubble", data, layout)
}


/**
 * Posts the metadata for a particular Test Subject to HTML.
 * 
 * @param {Object} dataObj Metadata object for a particular Test Subject ID
 */
function metaDataTable(dataObj) {

    const card = d3.select("#sample-metadata");

    // Clear the cards's existing content
    card.html('');

    // Loop through the object properties and create list items
    Object.entries(dataObj).forEach(([key, value]) => {
        card.append('div')
            .html(`<b>${key}:</b> ${value}`); // Use HTML to boldface the keys
    });
}



/**
 * When the website first loads, this function is run and populates the plots 
 * on the HTML with the starting value of the dropdown.
 */
function init() {
    // use the global dataPromise to access data
    dataPromise.then(jsonData => {

        // select the dropdown object in the html
        const dropDown = d3.select("#selDataset");

        populateDropdown(jsonData);
        
        let activeID = dropDown.property("value")

        optionChanged(activeID);

        generatePlots(activeID, jsonData);
    }
    );

}



