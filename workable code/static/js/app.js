// create function for importing data
const dataLoc = 'samples.json';
function renderData(loc) {
    return d3.json(loc);
}


//created dropdown of all datasets

var selectElement = document.getElementById('selDataset');

// selectElement.addEventListener('load', function () {
//     populate(this);
// });

function populate(element) {
    renderData(dataLoc).then(function(data) { //load all data
        var newElement, i; //create blank element for dropdown
        for (i = 0; i < data.names.length; i++) {
            newElement = document.createElement('option'); //create a blank option
            newElement.textContent = data.names[i]; // populate individual option with a dataset id
            if(i===0){
                newElement.setAttribute('selected', true) //selects the first dropdown option
            };
            element.appendChild(newElement) //adds option to dropdown
        }
        optionChanged('940'); //initializes page
    })
    
};
populate(selectElement); //loads dropdown on script read



//show metadata for current sample
var metaDataElement = document.getElementById('current-metadata'); //finds metadata box
metaDataElement.addEventListener('load', function(selectedData)  {
    updateMetaData(selectedData);//updates metadata on new page load so it updates when new data is selected

});
updateMetaData(metaDataElement,'940'); //initializes metadata element

function updateMetaData(element, id){
    renderData(dataLoc).then(function(data){
   
        let i =data.metadata.findIndex(x => id == x.id);//finds the index of the named metadata
        var  newElement; //initializes a blank element
 
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }; //deletes old metadata
        for (const property in data.metadata[i]){//loops through all properties
            newElement = document.createElement('h4'); //creates blank text of apropriate size
            newElement.textContent = `${property}: ${data.metadata[i][property]}`;// inserts property data into child element
            element.appendChild(newElement); // inserts child element
        }

    })

}


//updates graphs for data on change
function optionChanged(id) {
    renderData(dataLoc).then(function (data) {//load data

        let i = data.samples.findIndex(x => id == x.id);//find index of data used
        let barTrace = {//generates a horizontal bar graph of data based on sample values
            y: data.samples[i].otu_ids.map(x=> 'OTU '+parseInt(x)),
            x: data.samples[i].id,
            type: 'bar',
            lables: data.samples[i].sample_values,
            orientation: 'h'
        };
        let bubbleTrace = {//generates a bubble chart of data based on sample values
            y: data.samples[i].sample_values,
            x: data.samples[i].otu_ids,
            mode: 'markers',
            marker: {size: data.samples[i].sample_values,
            color: data.samples[i].otu_ids.map(value=> `rgb(${(255*value/4000)},${255-((510*value/4000)**2)**0.5},${255-(255*value/4000)})`) }
        }


        let barData = [barTrace];
        let bubbleData = [bubbleTrace];
        Plotly.newPlot('bubble', bubbleData);//shows bubble chart when class is bubble in html
        Plotly.newPlot('bar', barData);//shows bargraph when class is bar in html
        updateMetaData(metaDataElement,id);//updates metadata when charts update
    });
};
