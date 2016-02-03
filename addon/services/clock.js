import Ember from 'ember';

export default Ember.Service.extend({
  intervalTime: 1000,
  second: 0,
  minute: 0,
  five: 0,
  quarter: 0,
  hour: 0,

  init() {
    this._super(...arguments);
    var interval = window.setInterval(() => {
        this.tick.call(this);
      }, this.get('intervalTime'));
    this.set('interval', interval);
  },

  reset() {
    this.willDestroy();
    this.init();
    this.setProperties({second: 0, minute: 0, five: 0, quarter: 0, hour: 0});
  },

  intervalChange: Ember.observer('intervalTime', function() {
    if (Ember.testing) {
      return this.reset();
    }
    throw Error('The clock interval cannot be changed except during testing');
  }),

  tick() {
    Ember.run(this, function() {
      var second = this.incrementProperty('second');

      if (second && (second % 60) === 0) {
        var minute = this.incrementProperty('minute');

        if (minute !== 0) {
          if ((minute % 5) === 0) {
            this.incrementProperty('five');
          }

          if ((minute % 15) === 0) {
            this.incrementProperty('quarter');
          }

          if ((minute % 60) === 0) {
            this.incrementProperty('hour');
          }
        }
      }
    });
  },

  willDestroy() {
    window.clearInterval(this.get('interval'));
  }
});
