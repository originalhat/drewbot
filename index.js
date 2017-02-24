console.log('==============');
console.log('= I am Drew. =');
console.log('==============');

var prompt = require('prompt');
var request = require('request');

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
    console.log(body, null, 2);

    neuralLoop();
  });
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
          console.log('delete');
          break;
      }
    } catch (e) {
      console.log(e);
      neuralLoop();
    }
  });
}

prompt.start();
neuralLoop();
