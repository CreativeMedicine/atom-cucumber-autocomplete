'use babel';
var fs = require('fs');
var path = require('path');

const PATH_CONFIG_KEY = 'cucumber-autocomplete.path';
const CUCUMBER_STEP_DEF_PATTERN = /(Given|And|When|Then)\(\/\^(.*?)\$/g;
const CUCUMBER_KEYWORDS_PATTERN = /(Given|And|When|Then)(.*)/g;
const PROPERTY_PREFIX_PATTERN = /(?:^|\[|\(|,|=|:|\s)\s*((?:And|Given|Then|When)\s(?:[a-zA-Z]+\.?){0,2})$/;

module.exports = {
  selector: '.source.feature, .feature',
  inclusionPriority: 1,
  excludeLowerPriority: true,
  suggestionPriority: 2,
  filterSuggestions: true,
  load: function() {},
  getSuggestions: function({bufferPosition, editor, scopeDescriptor, prefix}) {

    // Disable the plugin if project hasn't been saved
    if (!atom.project.rootDirectories[0]) {
      return false;
    }

    let file = editor.getText();
    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    return this.getCompletions(line, file);
  },
  getCompletions: function(line, file) {
    return new Promise((resolve, reject) => {
      if (!this.matchCucumberKeyword(line)) resolve([]);
      try {
        var steps = fs.readFile(this.featuresDirectory(), function(err, data){
          if(err){
            console.log(err);
            resolve([]);
          } else{
            steps = JSON.parse(data)["steps"];
            console.log(steps);
            resolve(steps);
          }
        })
      } catch (e) {
        //atom.notifications.addError(e);
        resolve([]);
      }
    })
  },
  matchCucumberKeyword: function(line) {
    return PROPERTY_PREFIX_PATTERN.exec(line) != null;
  },
  rootDirectory: function() {
    return atom.project.rootDirectories[0].path;
  },
  featuresDirectory: function(path=PATH_CONFIG_KEY) {
    return atom.config.get(path);
  },
  replacedCucumberRegex: function(step) {
    //TODO: figure out how to loop through if there are multiple matches
    //      eg: 1:numberArgument, 2:numberArgument
    step = step.replace(/^\s+|\s+$/g, "");
    step = step.replace(/\(\\d\+\)/g, "${1:numberArgument}");
    return step.replace(/\(\.\*\?\)/g, "${1:textArgument}")
  }
};
