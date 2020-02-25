var assert = require('assert');
describe('Check if URL exists', function() {
  describe('#indexOf()', function() {
    it('should fail if cannot find url', function() {
      var string = "<a href=http://www.google.com/logos/doodles/2016/2016-doodle-fruit-games-day-3-5741908677623808-thp.png>";
      assert.equal(-1, [1,2,3].indexOf("href="));
    });
  });
});