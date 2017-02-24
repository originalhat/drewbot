console.log('==============');
console.log('= I am Drew. =');
console.log('==============');

var prompt = require('prompt');
var request = require('request');
var colors = require("colors/safe");

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

function deleteStory(storyId) {
  request({
    url: 'https://www.pivotaltracker.com/services/v5/projects/1937481/stories/' + storyId,
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

function neuralLoop() {
  prompt.get(['$'], function (err, result) {
    if (result.$ === 'exit') {
      process.exit();
    }

    try {
      var synapticResponse = JSON.parse(result.$);

      switch (synapticResponse.action) {
        case 'create':
          createStory(synapticResponse.name, synapticResponse.description);
          break;
        case 'delete':
          deleteStory(synapticResponse.storyId);
          break;
      }
    } catch (e) {
      console.log(e);
      neuralLoop();
    }
  });
}

prompt.message = colors.rainbow("DREWBOT ");
prompt.delimiter = colors.green("");
prompt.start();

neuralLoop();
