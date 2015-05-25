prepareHTML = function(specHtmlFileName, done) {

    // In a Node.JS environment we simply create a jsdom document
    if(typeof require === 'function') {
    
        var fs = require('fs'),
            jsdom = require('jsdom').jsdom,
            path = require('path');
    
        fs.readFile(path.resolve(__dirname + '/../spec', specHtmlFileName), { encoding: 'UTF-8' }, function(err, data) {
            document = jsdom(data);
            window = document.defaultView;
            done();
        });
    
    }
    
    // Otherwise if we are in a classical browser
    else {
    
        // Clear the 'test-container' node
        var testContainer = document.getElementById('test-container');
        testContainer.innerHTML = '';
    
        // Loads the HTML file content
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'spec/' + specHtmlFileName, false);
        
        xhr.onreadystatechange = function(event) {
            
            if(xhr.readyState === 4) {
                
                if(xhr.status === 200) {
                    
                    testContainer.innerHTML = xhr.responseText;
    
                }
                
                done();
                
            }
            
        };
        
        xhr.send();
    
    }

};

// In we are in a Node.JS environment we export our method
if(typeof require === 'function') {

    module.exports = prepareHTML;

}