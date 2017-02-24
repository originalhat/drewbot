console.log('==============');
console.log('= I am Drew. =');
console.log('==============');

var prompt = require('prompt');
var request = require('request');
var colors = require("colors/safe");

var STATIC_QUALIFIERS = ['exit', 'quit', 'help'];

function createStory(name, description) {
  request({
    url: 'https://www.pivotaltracker.com/services/v5/projects/1937481/stories',
    headers: {
      'X-TrackerToken': process.env.TRACKER_TOKEN,
      'Content-Type' : 'application/json'
    },
    body: {
      "name": name,
      "description": description
    },
    json: true,
    method: 'post'
  }, function (error, response, body) {
    console.log(body);
    neuralLoop();
  });
}

function deleteStory(storyID) {
  request({
    url: 'https://www.pivotaltracker.com/services/v5/projects/1937481/stories/' + storyID,
    headers: {
      'X-TrackerToken': process.env.TRACKER_TOKEN,
    },
    method: 'delete'
  }, function(error, response, body) {
    if (response.statusCode) {
      console.log('Story deleted successfully.');
    } else {
      console.log(error);
    }
    neuralLoop();
  })
}

function analyzeStaticQualifier(qualifier) {
  switch (qualifier) {
    case 'exit':
    case 'quit':
      process.exit();
      break;
    case 'help':
      console.log('\n DrewBot Field Guide');

      console.log('\n ➡ Create a story:\n');
      console.log('  create - {"action": "create", "name": "New story", "description": "I am DrewBot"}');

      console.log('\n ➡ Delete a story:\n');
      console.log('  delete - {"action": "delete", "storyID": "1234"}');

      console.log('\n')
      break;
  }
  neuralLoop();
}

function analyzeDynamicQualifier(qualifier) {
  try {
    var synapticResponse = JSON.parse(qualifier);

    switch (synapticResponse.action) {
      case 'create':
        createStory(synapticResponse.name, synapticResponse.description);
        break;
      case 'delete':
        deleteStory(synapticResponse.storyID);
        break;
    }
  } catch (e) {
    console.log(e);
    neuralLoop();
  }
}

function neuralLoop() {
  prompt.get(['$'], function (err, result) {
    if (STATIC_QUALIFIERS.indexOf(result.$) > -1) {
      analyzeStaticQualifier(result.$);
    } else {
      analyzeDynamicQualifier(result.$);
    }
  });
}

prompt.message = colors.rainbow("DREWBOT ");
prompt.delimiter = colors.green("");
prompt.start();

neuralLoop();
