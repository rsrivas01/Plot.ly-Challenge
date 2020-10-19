// First time index.html is loaded with the dashboard of 940
var select_tag = d3.select("#selDataset");

d3.json("samples.json").then((data) => {
  var subject_ids = data.names;

  subject_ids.forEach((id) => {
    select_tag
      .append("option")
      .property("value", id)
      .text(id);
  });

  bar_chart(subject_ids[0]);
  bubble_chart(subject_ids[0]);
  metadata_panel(subject_ids[0]);
});

// The function is triggered by an option change in the Dropdown box of "Test Subject ID No" in index.html
// <select id="selDataset" onchange="optionChanged(this.value)">
function optionChanged(selected_id) {
  bar_chart(selected_id);
  metadata_panel(selected_id)
  bubble_chart(selected_id);
}

function metadata_panel(selected_id) {
  // Display each key-value pair from the metadata JSON object somewhere on the page.

  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var results = metadata.filter(sampleObj => sampleObj.id == selected_id);
    var result = results[0];

    var fig = d3.select("#sample-metadata");

    fig.html("");

    Object.entries(result).forEach(([key, value]) => {
      fig.append("h6").text(`${key}: ${value}`);
    });
  });
}

function bar_chart(selected_id) {
  //   Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
  // * Use`sample_values` as the values for the bar chart.
  // * Use`otu_ids` as the labels for the bar chart.
  // * Use`otu_labels` as the hovertext for the chart.

  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    console.log(samples)

    var results = samples.filter(sampleObj => sampleObj.id == selected_id);
    var result = results[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var y_label = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var bar_info = [
      {
        y: y_label,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {color: "darkcyan"}
      }
    ];

    var bar_fig = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_info, bar_fig);
  });
}

function bubble_chart(selected_id) {
  // Create a bubble chart that displays each sample.
  // * Use`otu_ids` for the x values.
  // * Use`sample_values` for the y values.
  // * Use`sample_values` for the marker size.
  // * Use`otu_ids` for the marker colors.
  // * Use`otu_labels` for the text values.

  d3.json("samples.json").then((data) => {
    var samples = data.samples;

    var results = samples.filter(sampleObj => sampleObj.id == selected_id);
    var result = results[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var bubble_info = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Jet"
        }
      }
    ];

    var bubble_fig = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", bubble_info, bubble_fig);
  });
}