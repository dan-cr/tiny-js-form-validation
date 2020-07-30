# A miniature js form validation library

So far it only validates against:
 - Field Requirement
 - Alpha Numeric
 - Min Length
 - Max Length
 - Valid Email

This can be extended simply by creating a new error message and mapping it to new field validator property defined within: `Validator.prototype.fieldValidators`

You can either validate one field at a time, or validate them all at once. Changing this behaviour can be done by removing this bit of code: 
(Might improve this by adding it as an option within some user config)
```			
// Validate an individual field
if (!this.validateField(element, rules)) {
	break;
}
```

To use the validiation library, simply create an instance of the validator using the id of the form and the name attribute of the form element.

```
var validator = new Wfs_Validator('form_id', [
		{
			fieldName: 'firstName',
			fieldRules: 'required|alpha_numeric|min_length[3]|max_length[24]'
		},
		{
			fieldName: 'lastName',
			fieldRules: 'required|alpha_numeric|min_length[3]|max_length[24]'
		},
		{
			fieldName: 'emailAddress',
			fieldRules: 'valid_email'
		},
		{   fieldName: 'terms',
			fieldRules: 'required'
		}
]);
```
