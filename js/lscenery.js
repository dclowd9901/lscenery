var Lscenery = function () {
    return {
        modelToHTML: function () {
            var self = this,
                sets = [];
            
            _.forEach(model, function (group, key) {
                var html = [];

                html.push('<fieldset id="' + key + '">');
                html.push('<legend>' + key + '</legend>');
                html = html.concat(self._traverse(group, [key]));
                html.push('</fieldset>');

                console.log(html);
                sets.push(html);
            });
            
            return _.reduce( _.flatten( sets ), function (all, set) {
                return all + set;
            });
        },

        _traverse: function (prop, path) {
            var self = this,
                html = [];

            return _.map(prop, function (val, key, prop) {
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
                    html.push('<fieldset id="' + key + '">');
                    html.push('<legend>' + key + '</legend>');
                    html = html.concat(self._traverse(val, path.concat([key])));
                    html.push('</fieldset>');                          
                    return html;
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
            var html = [],
                selected = _.indexOf(value.radios, value.value);
            
            html.push('<fieldset id="' + path.join('-') + '">');
            html.push('<legend>' + _.last(path) + '</legend>');
            html.push('<ul>');
            html = html.concat( _.map(value.radios, function (radio, index) {
                var radioHtml = '';
                
                radioHtml += '<li>';
                radioHtml += '<label for="' + path.join('-') + '-' + index + '">' + radio + '</label>';
                radioHtml += '<input id="' + path.join('-') + '-' + index + '" ' + ((index === selected) ? 'CHECKED' : '' ) + ' type="radio" name="' + path.join('.') + '" value="' + radio + '"/>';
                radioHtml += '</li>';
                
                return radioHtml;
            }));
            
            html.push('</ul>');
            html.push('</fieldset>');
            
            return html;
        },
        
        _makeCheckboxInput: function (path, value) {
            var html = [];
            
            html.push('<fieldset id="' + path.join('-') + '">');
            html.push('<legend>' + _.last(path) + '</legend>');
            html.push('<ul>');
            html = html.concat( _.map(value.checkboxes, function (checkbox, index) {
                var checkboxHtml = '';
                
                checkboxHtml += '<li>';
                checkboxHtml += '<label for="' + path.join('-') + '-' + index + '">' + checkbox + '</label>';
                checkboxHtml += '<input id="' + path.join('-') + '-' + index + '" ' + (_.contains(value.values, checkbox) ? 'CHECKED' : '' ) + ' type="checkbox" name="' + path.join('.') + '" value="' + checkbox + '"/>';
                checkboxHtml += '</li>';
                
                return checkboxHtml;
            }));
            
            html.push('</ul>');
            html.push('</fieldset>');
            
            return html;
        },        
        
        _makeSelectInput: function (path, value) {
            var html = [],
                selected = _.indexOf(value.options, value.value);
            
            html.push('<label name="' + path.join('-') + '">' + _.last(path) + '</label>');
            html.push('<select name="' + path.join('.') + '" id="' + path.join('-') + '">');
            
            html = html.concat(_.map(value.options, function (option, index) {
                return '<option ' + ((index === selected) ? 'SELECTED' : '') + ' value="' + option + '">' + option + '</option>';
            }));
            
            html.push('</select>');
            
            return html;
        },

        _makeTextInput: function (path, value) {
            var html = [];

            html.push('<label for="' + path.join('-') + '">' + _.last(path) + '</label>');
            html.push('<input id="' + path.join('-') + '" name="' + path.join('.') + '" value="' + value + '" />');

            return html;
        },
        
        _makeRangeInput: function (path, value) {
            var html = [];
            
            html.push('<label for="' + path.join('-') + '">' + _.last(path) + '</label>');
            html.push('<input id="' + path.join('-') + '" name="' + path.join('.') + '" value="' + value.value + '" min="' + value.min + '" max="' + value.max + '" step="' + value.step + '" />');

            return html;            
        },

        _isSelect: function (obj) {
            if (obj.options && obj.value) return true;
        },

        _isRange: function (obj) {
            if (_.isNumber(obj.min) && _.isNumber(obj.max) && _.isNumber(obj.step) && _.isNumber(obj.value)) return true;
        },

        _isRadio: function (obj) {
            if (obj.radios && obj.value) return true;
        },

        _isCheckboxes: function (obj) {
            if (obj.checkboxes && obj.values) return true;
        }
    };
};