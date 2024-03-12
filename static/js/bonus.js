
/**
 * Use Plotly to post a Gauge meter for scrubs per week for a particular test subject ID to HTML.
 * 
 * 
 * @param {Object} dataObj Metadata object for a particular Test Subject ID
 */
function gaugePlot(dataObj) {

    // set variables
    const washFreq = dataObj.wfreq;
    const range = [0, 9];

    // set Plotly input
    const trace = {
        type: 'indicator',
        mode: 'gauge+number',
        title: {
            text: "scrubs per week",
            font: {
                size: 16
            }
        },
        value: washFreq,
        gauge: {
          axis: { range: range,
                nticks: 10},
          bar: { color: 'green' },
          bgcolor: 'white',
          borderwidth: 2,
          bordercolor: 'gray',
          shape: "angular",
          steps: [
            { range: range, color: 'lightgray' }
          ],
          threshold: {
            line: { color: 'black', width: 4 },
            thickness: 0.75,
            value: washFreq
          }
        }
      }

    const data = [trace];

    const layout = {
        title: "Belly Button Washing Frequency",
        font: {
            size: 18
        }
    }

    Plotly.newPlot('gauge', data, layout);
}
