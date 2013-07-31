# Lscenery

Lscenery creates an actionable model that allows key-value observance, and 
will create logical form markup from your JSON.

## What's it for?

First, Lscenery supercharges JSON structures with the ability to subscribe
to changes on the model, and to query on the model itself with notation
you might be familiar with if you've used MongoDB.

Second, Lscenery runs up through your JSON structure and does a couple of things

1) It figures out what kind of input markup should be displayed based on
   the structure of the JSON itself.

2) It gives those inputs' `id` and `name` values a meaningful structure
   that mirrors the model's structure itself.

In other words, the point of Lscenery is to create a low-weight,
low-interference, unassumptive tie between the UI and the model. This is
great for quickly scaffolding a front-end for, say, a MongoDB interface, 
or for generating markup that (in the future) would responsively
change the model passed to it. Like Angular.js or Ractive.js, but even
bony-er

## Prereqs

[jQuery](http://www.jquery.com)

[lodash](http://www.lodash.com)

## Install

Put `lscenery.js` in your scripts directory.

Put `/templates` directory wherever you house your templates.

## Use

    // Instantiate
    var model = { group: { a: 1 } },
        l = new Lscenery();

    l.modelToHTML()
      .done(function (el) {
        console.log(el);
      });

    /*  Dom Object:
        <fieldset id="group">  
            <legend>group</legend>    
            <label for="group-a">a</label>  
            <input id="group-a" name="group.a" value="1" />        
        </fieldset>
    */

## Configure

You'll probably have to adjust where the script looks for the templates. 
The easiest way to do this is after instantiation:

    // Instantiate
    var model = { group: { a: 1 } },
        l = new Lscenery();

    l.PATH_TEMPLATE_PARTIALS = 'path/to/templates/partials.tl';

    l.modelToHTML()
      .done(function ( el ) {
        console.log(el);
      });

You may also want to configure the path that is created for the inputs' `name`s and `id`s.
You can add a prefix to those paths like so:

    l.NAME_PREFIX = ['one','two'];

    // Paths will subsequently look like
    // one.two.path.to.object

When working with event-based frameworks, it can be helpful for debugging performance and
event loops to see what is firing when. To achieve this, there is an internal helper 
function that wraps all internal functions and outputs their name and their arguments when
they get fired. You can activate it like this:

    l.__debug();

and get console logging like this:

    // modelToHTML was called , args: []
    // _getHTMLPartial was called , args: []
    // _traverse was called , args: [Object, Array[0]]
 
Debug Mode also exposes the model to the global `window` namespace. If you extend Lscenery
on its prototype, the extended methods, too, will be announced when they are fired.

## Rules

There are reserved sets of properties. These reserved sets tell Lscenery
how to handle a property.

    // By default, inputs are created by any basic key-value tie:
    var input = { foo: 'bar' }; // 'bar' will prefill the input in the markup

    // To output a 'select' input
    var select = { 
        options: ['one','two','three'], 
        value: 'two'            // 'two' will be selected in the markup
    };

    // To output a 'select' input with custom option titles
    var select = { 
        options: [0, 1, 2],
        desc: ['Zero', 'One', 'Two'], // Descriptions are mapped to options
        value: 2                // 'two' will be selected in the markup
    };    

    // To output a 'range' input
    var range = { 
        min: 0, 
        max: 15, 
        step: 1, 
        value: 12               // The slider will be at the 12 position in the markup
    };

    // To output a 'radio' set
    var radio = {
        radios: ['foo', 'bar', 'biz'],
        value: 'foo'            // 'foo' will be selected in the markup
    };

    // To output a 'checkbox' set
    var checkboxes = {
        checkboxes: ['foo', 'bar', 'biz'],
        values: ['bar', 'biz']  // 'bar' and 'biz' will be selected in the markup
    };

## Nesting

Whenever you nest objects, a new `fieldset` is created.

    var model = {
        structure: {
            a: 50,
            b: {
                d: 'bar',
                c: {
                    min: 0,
                    max: 15,
                    step: 1,
                    value: 12
                }
            }
        }
    };

    /* Makes:

    <fieldset id="structure">
      <legend>structure</legend>    
      <label for="structure-a">a</label>  
      <input id="structure-a" name="structure.a" value="50" />        

      <fieldset id="b">  
        <legend>b</legend>    
        
        <label for="structure-b-d">d</label>  
        <input id="structure-b-d" name="structure.b.d" value="bar" />        
        
        <label for="structure-b-c">c</label>
        <input type="range" id="structure-b-c" name="structure.b.c" min="0" max="15" step="1" value="12">        
      </fieldset>        
    </fieldset> 

    */

Putting objects in an array does the same thing, but it also gives them an identifying number key.

    var model = {
        structure: {
            a: [{
                b: 'foo'
            },
            {
                b: 'bar'
            }]
        }
    };

    /* Makes:

    <fieldset id="structure">
      <legend>structure</legend>

      <fieldset id="a">  
        <legend>a</legend>    

        <fieldset id="0">  
          <legend>0</legend>    

          <label for="structure-a-0-b">b</label>  
          <input id="structure-a-0-b" name="structure.a.0.b" value="foo" />        
        </fieldset>        

        <fieldset id="1">  
          <legend>1</legend>    

          <label for="structure-a-1-b">b</label>  
          <input id="structure-a-1-b" name="structure.a.1.b" value="bar" />        
        </fieldset>        
      </fieldset>        
    </fieldset>
    */

## KVO

One of the central features of this library is the ability to subscribe to changes in values in the model. These changes can come in the form of either UI interaction events (changing an option on a select, inputting a new value in a field), or by utilizing getters and setters on the model.

### `get` and `set`

Setting and getting values relies on 'querying' the model utilizing dot-notation. For example:

    var model = { group: { a: 1 } },
        l = new Lscenery(model);

    // Get 'a'
    l.get('group.a');

    // 1

    // get 'group'
    l.get('group');

    // {a : 1}

    // Set 'a'
    l.set('group.a', 2);

    // l.get('group.a') === 2

    // set 'group'
    l.set('group', 'foo');

    // l.get('group.a') === undefined
    // l.get('group') === 'foo'

### Observation with `observe`

Using the same dot notation, you can observe and act on changes to the model.

    var model = { group: { a: { b: 1 } } },
        l = new Lscenery(model);

    l.observe('group.a.b', function (newValue, oldValue, passedData, propName) {
        console.log("I'm " + newValue);
    });

    l.set('group.a.b', 2);

    // I'm 2

You can also do neat things like observe changes from a higher level in the chain:

    l.observe('group.*', function (newValue) {
        console.log("I'm now " + newValue);
    });

    l.set('group.a.b', 3);

    // I'm now 3

Or like setting subobject properties amongst an array of duplicate objects

    var model = {
        a: [{
            b: 3
        },
        {
            b: 10
        }]
    },
    l = new Lscenery(model);

    l.set('a.*.b', 5);
    l.get('a');

    // { a: [ { b: 5 }, { b: 5 } ] }

You can do this for as many nested arrays as you like (ex: 'a.\*.b.\*.c...'). Just know 
that this can get very expensive fairly quickly (as each asterisk represents an array 
which is crawled all the way through). The onus is on you to create a data structure 
that isn't insane.

## Updating markup

From time to time, you may want the ability to disceetly update the input portions
of your markup. For instance, if you had multiple select menus, where a second had
certainly values depending on the selection of the first one (think vehicle make and
model selection).

You can do that with the `updateInput` function:

    var data = { 
        carModel: {
            options: ['Impreza', 'Forester', 'Outback', 'BR-Z'],
            value: ['Impreza']
        }
    },
    l = new Lscenery(data);

    l.modelToHTML()
        .done(function (el) {
            $('.container').append(el);
        });

    l.updateInput('carModel', {
        options: ['Civic', 'Accord', 'Odyssey', 'Crosstour'],
        value: ['Civic']
    });
