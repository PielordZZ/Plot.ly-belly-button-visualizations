
const dataLoc = 'samples.json';
function renderData(loc) {
    return d3.json(loc);
}
const data = d3.json(dataLoc);
var selectElement = document.getElementById('selDataset');
var selectedData = '940';



selectElement.addEventListener('load', function () {
    populate(this);
});

function populate(element) {
    renderData(dataLoc).then(function(data) {
        var newElement, i;
        for (i = 0; i < data.names.length; i++) {
            newElement = document.createElement('option');
            newElement.textContent = data.names[i];
            if(i===0){
                newElement.setAttribute('selected', true)
            };
            element.appendChild(newElement)
        }
        optionChanged('940');
    })
    
};
populate(selectElement);




var metaDataElement = document.getElementById('current-metadata');
metaDataElement.addEventListener('load', function(selectedData)  {
    updateMetaData(selectedData);

});
updateMetaData(metaDataElement,'940');

function updateMetaData(element, id){
    renderData(dataLoc).then(function(data){
   
        let i =data.metadata.findIndex(x => id == x.id);
        var  newElement;
 
        while(element.firstChild){
            element.removeChild(element.firstChild);
        };
        for (const property in data.metadata[i]){
            newElement = document.createElement('p');
            newElement.textContent = `${property}: ${data.metadata[i][property]}`;
            element.appendChild(newElement)
        }

    })

}


function markerColor(value){
    return `rgb(${(255*value/4000)},${255-((510*value/4000)**2)**0.5},${255-(255*value/4000)})`
}

function optionChanged(id) {
    renderData(dataLoc).then(function (data) {

        let i = data.samples.findIndex(x => id == x.id);
        let barTrace = {
            y: data.samples[i].otu_ids.map(x=> 'OTU '+parseInt(x)),
            x: data.samples[i].id,
            type: 'bar',
            lables: data.samples[i].sample_values,
            orientation: 'h'
        };
        let bubbleTrace = {
            y: data.samples[i].sample_values,
            x: data.samples[i].otu_ids,
            mode: 'markers',
            marker: {size: data.samples[i].sample_values,
            color: data.samples[i].otu_ids.map(value=> `rgb(${(255*value/4000)},${255-((510*value/4000)**2)**0.5},${255-(255*value/4000)})`) }
        }


        let barData = [barTrace];
        let bubbleData = [bubbleTrace];
        let layout = {};
        Plotly.newPlot('bubble', bubbleData)
        Plotly.newPlot('bar', barData);
        updateMetaData(metaDataElement,id);
    });
};
