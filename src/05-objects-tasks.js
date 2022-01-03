/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  select: [],
  stack: [],
  last: 0,

  push(value) {
    if (!this.select.length) {
      this.select.push([]);
    }
    console.log(value, 'push');
    this.select[this.select.length - 1].push(value);
    return this;
  },

  stackSet(value) {
    if ((value === 100 || value === 90 || value === 50) && this.last === value) {
      console.log('Error1');
      this.stack.pop();
      this.last = 0;
      this.select.pop();
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (!this.stack.length) {
      this.stack.push([]);
    }
    const stack = this.stack[this.stack.length - 1];
    if (stack[stack.length - 1] < value
      || (this.stack.length > 1 && this.stack[this.stack.length - 2] < value)) {
      console.log(this.select, 'Error2');
      this.stack.pop();
      this.last = 0;
      this.select.pop();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.stack[this.stack.length - 1].push(value);
    this.last = value;
  },

  element(value) {
    this.select.push([]);
    this.stack.push([]);
    this.stackSet(100);
    return this.push(value);
  },

  id(value) {
    this.stackSet(90);
    return this.push('#').push(value);
  },

  class(value) {
    this.stackSet(80);
    return this.push('.').push(value);
  },

  attr(value) {
    this.stackSet(70);
    return this.push('[').push(value).push(']');
  },

  pseudoClass(value) {
    this.stackSet(60);
    return this.push(':').push(value);
  },

  pseudoElement(value) {
    this.stackSet(50);
    return this.push('::').push(value);
  },

  combine(selector1, combinator, selector2) {
    const s1 = selector1.stringify();
    const s2 = selector2.stringify();
    return this.element(s2)
      .push(' ')
      .push(combinator)
      .push(' ')
      .push(s1);
  },

  stringify() {
    this.stack.pop();
    this.last = 0;
    const result = this.select.pop().join('');
    console.log(result, 'stringify');
    return result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
