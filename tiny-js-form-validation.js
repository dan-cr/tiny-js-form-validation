(function(window) {

    // Default Validation Settings
    var defaults = {
        errors: {
            required: 'Please enter your %s',
			alpha_numeric: '%s should only contact alphanumeric characters',
            max_length: '%s must not exceed %s characters',
            min_length: '%s must be no less than %s characters',
            valid_email: 'Please enter a valid %s'
        }
    };

    // Validator Constructor
    function Validator(formId, fields) {
		
		// Outer context
		var that = this;

        this.form = document.getElementById(formId);
        this.fields = fields;
        this.errors;
		
		// Validate form on submission
        this.form.addEventListener('submit', function(event) {
			
			that.validateForm();

            // Prevent form submitting if errors exist
            if (that.errors.length) {
                event.preventDefault();
            }

        });
    }
    
    // Validates selected form
	Validator.prototype.validateForm = function() {
		
		// Reset/Init errors
		this.errors = [];
		
		for (var i = 0; i < this.fields.length; i++) {
			
			// Current field
			let field = this.fields[i];

			// Element and rules
			var element,
				rules = {},
				argument;

			for (var prop in field) {

				// Skip element if property is missing
				if (!field[prop]) break;

				if (prop == 'fieldName') { 
                    element = this.form.elements[field.fieldName];
				} else if (prop == 'fieldRules') {
					var ruleSet = field[prop].split('|');
					for (var j = 0; j < ruleSet.length; j++) {
						var rule = ruleSet[j];
						var matches = rule.match(/\[(\d+)\]/);
						var ruleArg = rule.replace(/\[\d*\]/, '');
						if (matches) {
							argument = matches[1];
						}
						rules[ruleArg] = argument;
					}
				}
			}

			// Validate an individual field
			if (!this.validateField(element, rules)) {
				break;
			}
        }
        
	}

    // Generate error message
    Validator.prototype.substituteError = function(name, method, arg) {
        
        // Retrieve the default error
        var errorMsg = defaults.errors[method];

        // Replace substitute with field name
        errorMsg = errorMsg.replace('%s', name);

        // Replace second substitute with argument if provided
        if (arg) {
            errorMsg = errorMsg.replace('%s', arg);
        }

        return errorMsg
    }

    // Generate error element
    Validator.prototype.createError = function(field, error) {
        var oldError = document.querySelector('.field-error');
        if (oldError) {
            oldError.remove();
        }
        if (field.type === 'checkbox' || field.type === 'radio') {
            field.classList.add('field-error-border')
            field.onclick = function() {
                field.classList.remove('field-error-border');
            }
        } else {
            var newErrorElement = document.createElement('div');
            var newErrorElementText = document.createTextNode(error);
            newErrorElement.classList.add('field-error');
            newErrorElement.appendChild(newErrorElementText);
            field.parentNode.insertBefore( newErrorElement, field.nextSibling);
        }
    }

	// Validates a single field and returns a Boolean indicating whether the field is valid
    Validator.prototype.validateField = function(field, methods) {
        
        // Use dataset name if set, else use name attribute of field
        var formattedName = field.dataset.name || field.name;

        // Create error if validator methods return false
        if (Object.keys(methods).length > 0) {
            for (var prop in methods) {
                if (methods.hasOwnProperty(prop)) {
                    if (!this.fieldValidators[prop].call(null, field, methods[prop])) {
                        var error = this.substituteError(formattedName, prop, methods[prop]);
                        this.errors.push(error);
                        this.createError(field, error);
                        return false;
                    }
                }
            }
        }

		return true;
		
    }

    // Field validation methods
    Validator.prototype.fieldValidators = {

        // Test if field is checked or not null/empty
        required: function(field) {
            // Check if field is of type 'radio|checkbox', then test to see if it is checked.
            if (field.type === 'checkbox' || field.type === 'radio') {
                return (field.checked === true);
            }
            return field.value !== '' && field.value !== undefined;
        },
		
		// Returns true if field contacts only alpha numerical characters
		alpha_numeric: function(field) {
			var alphaNumericRegex = /^\w+$/;
			return alphaNumericRegex.test(field.value);
		},

        // Test if field value is greater than min length.
        min_length: function(field, minLen) {
            return field.value.length >= minLen;
        }, 

        // Test if field value is less than max length.
        max_length: function(field, maxLen) {
            return field.value.length <= maxLen;
        },

        // Test if email field is in the correct format
        valid_email: function(field) {
            // This should suffice for most email validation needs
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(field.value);
        }

    }

    // Add constructor to window object
    window.Wfs_Validator = Validator;

})(window);