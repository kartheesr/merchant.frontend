// Generated by CoffeeScript 1.6.3
(function() {
  jQuery(function() {
    this.film_rolls || (this.film_rolls = []);
    this.film_rolls['film_roll_1'] = new FilmRoll({
      container: '#film_roll_1',
      height: 800
    });
    this.film_rolls['film_roll_2'] = new FilmRoll({
      container: '#film_roll_2',
      height: 800,
      prev: '#film_roll_2_left',
      next: '#film_roll_2_right'
    });
    this.film_rolls['film_roll_3'] = new FilmRoll({
      container: '#film_roll_3',
      height: 800,
      pager: false
    });
    return true;
  });
}.call(this));
