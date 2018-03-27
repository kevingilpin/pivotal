var fortune = require('../lib/fortune.js'),
    weather = require('../lib/weather.js'),
    assert = require('chai').assert;

suite('Unit Tests', function(){
    
    test('getFortune() should return a fortune', function(){
        assert(typeof fortune.getFortune() === 'string');
    });

    test('getWeatherData() should return an object with locations', 
            function(){
                assert(typeof weather() === 'object');
                assert(typeof weather().locations === 'object');            
    });

});
