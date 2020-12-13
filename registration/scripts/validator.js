(function ($) {
    $.fn.validate = function (rules) {
        var validate$ = this;
        var controlName = validate$.data('name');

        var result = {
            fieldName: controlName,
            errors: [],
            hasPassed: [],
            displayErrorOn: function (element) {
                control = $(element);

                if (this.hasErrors) {
                    control.text('');
                    control.css('display', 'block');

                    this.errors.forEach(function (error, key) {
                        control.append(error + '<br/>');
                    });
                } else {
                    control.text('');
                    control.css('display', 'none');
                }

                return !this.hasErrors();
            },
            hasErrors: function () {
                return this.errors.length > 0;
            }
        }

        rules.forEach(function (rule, key) {
            var validationPassed

            if (rule.search(':') > 0) {
                ruleQuery = rule.split(':');

                validationPassed = Validator[ruleQuery[0]](validate$.val(), ruleQuery[1])

                if (!validationPassed)
                    result.errors.push(Validator.message[ruleQuery[0]].replace('$field$', controlName).replace('$param$', ruleQuery[1]));
            } else {
                validationPassed = Validator[rule](validate$.val());

                if (! validationPassed)
                    result.errors.push(Validator.message[rule].replace('$field$', controlName));
            }

            result.hasPassed[validate$.attr('name')] = validationPassed;
        });

        return result;
    }
})(jQuery);

var Validator = {
    message: {
        email: 'Invalid email',
        required: 'The $field$ is required.',
        min: '$field$ must be at least $param$ characters',
        max: '$field$ must not exceed $param$ characters',
        radio: 'Please Select At Least 1 $field$'
    },

    email: function (value) {
        var regularExpression = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

        return regularExpression.test(value);
    },

    required: function (value) {
        if (value == '' || value == null || value == 'undefined')
            return false;

        return true;
    },

    radio: function (value) {
        if (value == '' || value == null || value == 'undefined')
            return false;

        return true;
    },

    min: function (value, param) {
        if (value.length >= param)
            return true;

        return false;
    },

    max: function (value, param) {
        if (value.length <= param)
            return true;

        return false;
    }
}