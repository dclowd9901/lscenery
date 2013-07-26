var Lscenery = function () {

  var properties = {
    PATH_TEMPLATE_PARTIALS: { 
      writable: true,
      value: 'templates/partials.tl'
    },
    NAME_PREFIX: {
      writable: true,
      value: [],
    },
    htmlPartial: {
      writable: true,
      value: ''
    },
    partialLoaded: {
      enumerable: true,
      value: $.Deferred()
    }
  };

  var prototype = {

    modelToHTML: function (model) {
      var self = this,
          doneScaffolding = $.Deferred();

      if (!this.htmlPartial){
        this._getHTMLPartial();
      }

      $.when(this.partialLoaded).then(function () {   
        var sets = '',
            key  = self.NAME_PREFIX,
            html = [],
            inner;

        html  = html.concat(self._traverse(model, key));
        inner = _.reduce(_.flatten(html), function (all, set) {
                  return all + set;
                });
        
        if (key.length) {
          sets += _.template(self.htmlPartial, {
                    section: 'layout',
                    inner: inner,
                    key: _.last(key)
                  }).replace(/\n/gi, '');
        } else {
          sets += inner;
        }

        // _.forEach(model, function (group, key) {
        //   var html = [],
        //       inner;

        //   key = self.NAME_PREFIX.concat([key]);

        //   html = html.concat(self._traverse(group, key));
        //   inner = _.reduce(_.flatten( html ), function (all, set) {
        //               return all + set;
        //           });

        //   sets += _.template( self.htmlPartial, {section: 'layout', inner: inner, key: _.last(key)}).replace(/\n/gi, '');
        // });
        
        doneScaffolding.resolve(sets);
      });

      return doneScaffolding;
    },

    _getHTMLPartial: function () {
      var self = this;

      $.get(this.PATH_TEMPLATE_PARTIALS).then(function ( data ) { 
        self.htmlPartial = data;
        self.partialLoaded.resolve(); 
      });
    },

    _traverse: function (prop, path) {
      var self = this;

      return _.map(prop, function (val, key) {
        var fromTraversal = null;

        if (self._isNofollow(val)) {
          return '';
        }

        if (self._isTextInput(val)) {
          return self._makeTextInput(path.concat([key]), val);
        }
        
        if (self._isSelect(val)) {
          return self._makeSelectInput(path.concat([key]), val);
        }
        
        if (self._isRange(val)) {
          return self._makeRangeInput(path.concat([key]), val);
        }
        
        if (self._isRadio(val)) {
          return self._makeRadioInput(path.concat([key]), val);
        }
        
        if (self._isCheckboxes(val)) {
          return self._makeCheckboxInput(path.concat([key]), val);
        }
        
        if (self._isAnotherLevel(val)){
          fromTraversal = _.reduce( self._traverse(val, path.concat([key])), function (all, set){
                            return all + set;
                          });

          return  _.template(self.htmlPartial, {
                    section: 'layout',
                    key: key,
                    inner: fromTraversal
                  });
        }
      });
    },
    
    _isAnotherLevel: function (obj) {
      if (_.isPlainObject(obj))
        return true;
      
      if (_.isArray(obj) && _.isPlainObject(obj[0])) 
        return true;
    },

    _isTextInput: function (obj) {
      if (_.isNumber(obj) || _.isString(obj)) return true;
    },
    
    _makeRadioInput: function (path, value) {

      var selected = _.indexOf(value.radios, value.value);
      
      return  _.template(this.htmlPartial, {
                section:  'radioInput',
                name:     path.join('.'),
                id:       path.join('-'),
                selected: selected,
                radios:   value.radios,
                key:      _.last(path)
              });

    },
    
    _makeCheckboxInput: function (path, value) {
      var selectedMap = _.map(value.checkboxes, function (checkbox, key) {
                          return _.contains(value.values, checkbox);
                        });

      return  _.template(this.htmlPartial, {
                section:      'checkboxInput',
                name:         path.join('.'),
                id:           path.join('-'),
                selectedMap:  selectedMap,
                checkboxes:   value.checkboxes,
                key:          _.last(path)
              });                
        
    },        
    
    _makeSelectInput: function (path, value) {

      var selected = _.indexOf(value.options, value.value);

      return  _.template(this.htmlPartial, {
                section:        'selectInput',                
                id:             path.join('-'),
                name:           path.join('.'),
                key:            _.last(path),
                options:        value.options,
                desc:           value.desc || value.options,
                selectedIndex:  _.indexOf(value.options, value.value)
              });

    },

    _makeTextInput: function (path, value) {

      return  _.template(this.htmlPartial, {
                section:  'textInput',
                id:       path.join('-'),
                name:     path.join('.'),
                value:    value,
                key:      _.last(path)
              });

    },
    
    _makeRangeInput: function (path, value) {

      return  _.template(this.htmlPartial, {
                section:  'rangeInput',
                name:     path.join('.'),
                id:       path.join('-'),
                key:      _.last(path),
                value:    value
              });

    },

    _isNofollow: function (obj) {
      if (obj && obj.nofollow) return true;
    },

    _isSelect: function (obj) {
      if (obj && !_.isUndefined(obj.options) && !_.isUndefined(obj.value)) return true;
    },

    _isRange: function (obj) {
      if (obj && _.isNumber(obj.min) && _.isNumber(obj.max) && _.isNumber(obj.step) && _.isNumber(obj.value)) return true;
    },

    _isRadio: function (obj) {
      if (obj && !_.isUndefined(obj.radios) && !_.isUndefined(obj.value)) return true;
    },

    _isCheckboxes: function (obj) {
      if (obj && !_.isUndefined(obj.checkboxes) && !_.isUndefined(obj.values)) return true;
    }
  };

  return Object.create( prototype, properties );
};