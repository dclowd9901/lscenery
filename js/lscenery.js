var Lscenery = function (userProps) {

  var properties = {
    PATH_TEMPLATE_PARTIALS: { 
      enumerable: false,
      configurable: false,
      writable: true,
      value: 'templates/partials.tl'
    },
    NAME_PREFIX: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },
    _htmlPartial: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: ''
    },
    _partialLoaded: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: $.Deferred()
    },
    _observers: {
      enumerable: false,      
      configurable: false,
      writable: true,      
      value: {}
    }
  };

  _.forEach(userProps, function (value, key) {
    properties[key] = {
      writable: true,
      configurable: true,
      enumerable: true,
      value: value
    };
  });  

  var prototype = {

    get: function (propName, raw) {
      if (propName.indexOf('.') === -1) {
        return raw ? this[propName] : this._getValue(this[propName]);
      } else {
        return this._retrieve(this, propName, raw);
      }
    },

    set: function (propName, value, data, silent) {

      var deep           = (propName.indexOf('.') > -1),
          former         = this.get(propName),
          propArr        = (deep) ? propName.split('.') : [],
          collectionPath = propName.split('.*.'),
          propNamesSet,
          currentProp,
          tmp,
          i;

      // If a checkbox input, compile all currently checked
      if (this._isCheckboxes(this.get(propName, true))) {
        value = this._getChecked(propName);
      }
      
      if (collectionPath.length > 1) {

        propNamesSet = this.collectionSet(collectionPath, this, value);

      } else {

        _.merge(this, this._define(propName, value));

        propNamesSet = [ propName ];
      
      }

      tmp = this.get(propName, true);

      if (this._isText(tmp) || this._isSelect(tmp) || this._isRange(tmp)) {

        $(this._formEl).find('[name="' + propName + '"]').first().val(value);

      }
      
      if (!silent) {

        this._fireObservers(propName, value, former, data);

        if (propArr.length) {
          propArr.pop();                    
          
          while (propArr.length) {
            currentProp = propArr.join('.') + '.*';
            
            this._fireObservers(currentProp, value, former, data);
            
            propArr.pop();                    
          }
        }
      }

      return propNamesSet;
    },

    collectionSet: function (path, model, value, pathTo) {

      var self = this,
          pathsSet = [];

      pathTo = (_.isUndefined(pathTo)) ? '' : pathTo + '.';

      if (path.length > 1) {
        
        if (_.isArray(model)) {

          pathsSet.push(_.map(model, function (item, key) {
            
            return self.collectionSet(_.rest(path), item[path[0]], value, pathTo + key + '.' + path[0]);
          
          }));

        } else {
          
          if (!this.get(path[0]))
            this._define(path[0], model);

          return this.collectionSet(_.rest(path), this.get(path[0]), value, pathTo + path[0]);
        }

      } else {
        
        _.forEach(model, function (submodel, key) {

          submodel[path[0]] = value;
          pathsSet.push(pathTo + key + '.' + path[0]);
        
        });
      }

      return _.flatten(pathsSet);

    },

    observe: function (propName, fn, scope) {

      fn = scope ? fn.bind( scope ) : fn;

      if( this._observers[propName] ){

        this._observers[propName].push( fn );
      
      } else {
      
        this._observers[propName] = [ fn ];
      
      }
    },

    trigger: function (propName, data) {

      var i;

      this.set(propName, this[propName], data);

    },

    updateInput: function (path, config) {
      
      var pathsSet = this.set(path, config),
          self = this;

      _.forEach(pathsSet, function (pathSet) {
        
        var $input      = $('[name="' + pathSet + '"]'),
            pathArr     = pathSet.split('.'),        
            $allRelated = $('[data-groupings="' + pathArr.join('-') + '"]'),
            tmp         = {},
            markup;

        tmp[_.last(pathArr)] = self.get(pathSet);
        markup = self._traverse(tmp, _.initial(pathArr));
        $input.after(markup);
        $allRelated.remove();

      });
    },

    modelToHTML: function () {
      var self = this,
          doneScaffolding = $.Deferred();

      if (!this._htmlPartial){

        this._getHTMLPartial();
      
      }

      $.when(this._partialLoaded).then(function () {

        var sets = '',
            key  = self.NAME_PREFIX,
            inner;

        html  = self._traverse(self, key);
        inner = _.reduce(_.flatten(html), function (all, set) {
                  return all + set;
                });
        
        if (key.length) {

          sets += _.template(self._htmlPartial, {
                    section: 'layout',
                    inner: inner,
                    key: _.last(key)
                  }).replace(/\n/gi, '');

        } else {

          sets += inner;

        }

        self._formEl = $(sets);
        self._eventInputs();
        
        doneScaffolding.resolve(self._formEl);
      });


      return doneScaffolding;
    },

    _getChecked: function (path) {
      var checked;

      $checked = this._formEl.find('[name="' + path + '"]:checked');

      return _.map( $checked, function (el) {
        return el.value;
      });
    },

    _define: function (path, value, memoObj) { // if foo.bar

      var pathArr    = path.split('.'),
          pathFirst  = pathArr.shift();

      memoObj = memoObj ? memoObj : this;         
        
      if (pathArr.length > 0) {

        this._define(pathArr.join('.'), value, memoObj[pathFirst]); 
      
      } else {
      
        this._applyValue(memoObj, pathFirst, value);
      
      }
    },

    _applyValue: function (obj, path, value) {
      var cachedObj = obj[path];

      if (this._isRange(cachedObj) || this._isSelect(cachedObj) || this._isRadio(cachedObj)) {

        cachedObj.value = value;

      } else if (this._isCheckboxes(cachedObj)) {

        cachedObj.values = value;
      
      } else {
      
        cachedObj = value;
      
      }
    },

    // Normalizes the value return on a certain property, 
    // be it input or standard
    _getValue: function (value) {

      if (this._isSelect(value) || this._isRadio(value) || this._isRange(value)) {

        return value.value;
      
      } else if (this._isCheckboxes(value)) {
      
        return value.values;
      
      } else {
      
        return value;
      
      }
    },    

    _eventInputs: function () {
      var self = this;
      
      $(this._formEl).on('keyup', function (e) {
      
        self.set( e.target.name, e.target.value, $(e.target).data('groupings') );
      
      });

      $(this._formEl).on('change', function (e) {

        if (!$(e.target).is('[type="text"]')) // Prevents double eventing on text inputs
          self.set( e.target.name, e.target.value, $(e.target).data('groupings') );

      });      
    },

    _setInitialVals: function(){
      var inputs = $('[name]'),
          self = this;

      _.forEach( inputs, function( input ){
      
        self[input.name] = input.value;
      
      });
    },

    _retrieve: function (obj, path, raw) {
      var self    = this,
          pathArr = path.split('.'),
          sets    = [];

      if( pathArr.length > 1 ){
      
        if (pathArr[0] === '*') {
      
          return _.map(obj, function (subset, key) {
      
            return self._retrieve(obj[key], _.rest(pathArr).join('.'), raw);
      
          });
        }
      
        return this._retrieve(obj[pathArr[0]], _.rest(pathArr).join('.'), raw);
      
      } else {
      
        return raw ? obj[path] : this._getValue(obj[path]);
      
      }
    },

    _fireObservers: function (propName, value, former, data) {

      if (this._observers[propName]) {

        for (i = 0; i < this._observers[propName].length; i++) {

          this._observers[propName][i](
            this._getValue(value), 
            this._getValue(former),
            data, 
            propName
          );
        }
      }
    },

    _getHTMLPartial: function () {
      var self = this;

      $.get(this.PATH_TEMPLATE_PARTIALS).then(function (data) {
        self._htmlPartial = data;
        self._partialLoaded.resolve(); 
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

          return  _.template(self._htmlPartial, {
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
      
      return  _.template(this._htmlPartial, {
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

      return  _.template(this._htmlPartial, {
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

      return  _.template(this._htmlPartial, {
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

      return  _.template(this._htmlPartial, {
                section:  'textInput',
                id:       path.join('-'),
                name:     path.join('.'),
                value:    value,
                key:      _.last(path)
              });

    },
    
    _makeRangeInput: function (path, value) {

      return  _.template(this._htmlPartial, {
                section:  'rangeInput',
                name:     path.join('.'),
                id:       path.join('-'),
                key:      _.last(path),
                value:    value
              });

    },

    _isText: function (obj) {
      return _.isNumber(obj) || _.isString(obj) || _.isBoolean(obj);
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
    },

    __debug: function () {
      var self = this;

      window.lsceneryModels = window.lsceneryModels ? window.lsceneryModels : [this];

      _.forEach(self.__proto__, function (method, name) {

        if (_.isFunction(method)) {
        
          self.__proto__[name] = function () {
          
            console.log(name, 'was called', ', args:', arguments);                    
            return method.apply(self, arguments);
          
          };
        }  
      });      
    }
  };

  return Object.create( prototype, properties );
};