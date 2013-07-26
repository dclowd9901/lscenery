# Lscenery

Lscenery will create logical form markup from your JSON.

## What's it for?

Lscenery runs up through your JSON structure and does a couple of things

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

Put lscenery.js in your scripts directory.

Put `/templates` directory wherever you house your templates.

## Use

    // Instantiate
    var l = new Lscenery(),
        model = { group: { a: 1 } };

    l.modelToHTML(model)
      .done(function ( html ) {
        console.log(html);
      });

    /*  
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
    var l = new Lscenery(),
        model = { group: { a: 1 } };

    l.PATH_TEMPLATE_PARTIALS = 'path/to/templates/partials.tl';

    l.modelToHTML(model)
      .done(function ( html ) {
        console.log(html);
      });

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

## Continuing work

I'll soon be adding the mechanism to track and update changes from the UI -- You'll also be able to 
subscribe to these changes and handle onchange and keyup events.