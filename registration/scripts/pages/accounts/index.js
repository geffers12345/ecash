$(document).ready(function () {
    var parentObj = {
        init: function () {
            var self = this;

            self.declaration();
            self.setEvents();

            self.get();
            self.roles();
        },
        declaration: function () {
            var self = this;

            self._id = 0;

            self.$btn_save = $('#save');
            self.$btn_add = $('#add');
        },
        setEvents: function () {
            var self = this;

            self.$btn_save.on("click", function (event) {
                event.preventDefault();

                if (self.validate()) {

                    $('#save').text('Loading..').prop('disabled', true);

                    var items = {};

                    items.id = self._id;
                    items.firstname = $('#firstname').val();
                    items.lastname = $('#lastname').val();
                    items.middlename = $('#middlename').val();
                    items.email = $('#email').val();
                    items.password = $('#password').val();
                    items.gender = $('#gender').val();
                    items.contact = $('#contact').val();
                    items.roleid = $('#role').val();
                    items.datecreated = current_date_time();

                    self.insert(items);
                }
            });

            self.$btn_add.on("click", function (event) {
                event.preventDefault();

                self._id = 0;
                $('#password').prop('disabled', false);
                self.clear();
            });
        },
        insert: function (items) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/Accounts/create',
                data: '{items: ' + JSON.stringify(items) + '}',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.Message === "0") {
                        swal('Successfully Saved!', 'New account has been added.', 'success');
                    } else {
                        swal('Successfully Updated!', 'Account has been updated.', 'success');
                    }

                    self.clear();
                    self.get();
                },
                error: function () {
                    console.log("Error while inserting data");
                }
            });
        },
        get: function () {
            var self = this;

            $('#tbody')
                .empty()
                .append('<tr class="loading"><td colspan="10"><center><img src="/content/img/overlay-loader.gif" height="100"/></center></td></tr>');

            $.ajax({
                type: 'POST',
                url: '/Accounts/get',
                dataType: 'json',
                data: { id: '' },
                success: function (data) {
                    var items = data.map(item => {
                        return new Promise(function (resolve, reject) {
                            
                            var middlename = item.Middlename === null ? '' : item.Middlename;
                            var date_updated = item.DateUpdated === null ? '' : item.DateUpdated;

                            var isActive = item.DateDeleted === null ? "Activated" : "Not Activated";

                            var active = "<a data-id='" + item.Id + "' href='#' data-name='" + item.Firstname + "' class='btn btn-danger btn-circle deactivate remove'>"
                                + "<i class='fas fa-trash'></i>"
                                + "</a>";

                            var inactive = "<a data-id='" + item.Id + "' href='#' data-name='" + item.Firstname + "' class='btn btn-success btn-circle activate activate'>"
                                + "<i class='fas fa-check-circle'></i>"
                                + "</a>";

                            var statusAction = isActive == "Not Activated" ? inactive : active;

                            var html = "<tr>";

                            html += "<td>" + item.Id + "</td>" +
                                    "<td>" + item.Firstname + " " + middlename + " " + item.Lastname + "</td>" +
                                    "<td>" + item.Gender + "</td>" +
                                    "<td>" + item.Email + "</td>" +
                                    "<td>" + item.Contact + "</td>" +
                                    "<td>" + item.Role[0].Role + "</td>" +
                                    "<td>" + date_updated + "</td>" +
                                    "<td>" + isActive + "</td>" +
                                    "<td>";

                            if (permission.edit === "True") {
                                html += "<a data-id='" + item.Id + "' href='#'"
                                        + "data-toggle='modal' data-target='#modal' class='btn btn-success btn-circle find'>"
                                        + "<i class='fa fa-edit'></i>"
                                    + "</a>";
                            }

                            if (permission.remove === "True") {
                                html += statusAction;
                            }

                            html += "</td></tr>";

                            $('#tbody').append(html);

                            resolve();
                        });
                    });

                    Promise.all(items).then(function () {
                        $('.loading').remove();
                        $('#tbl').DataTable();

                        $('.find').click(function () {

                            self.find($(this).data('id'));

                            self._id = $(this).data('id');
                        });

                        $('.remove').click(function () {

                            self._id = $(this).data('id');

                            var items = {};

                            items.id = self._id;
                            items.firstname = $(this).data('name');
                            items.datedeleted = current_date_time();

                            swal({
                                title: 'Are you sure you want to deactivate ' + $(this).data('name') + '?',
                                text: "You won't be able to revert this action!",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: 'green',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Deactivate!'
                            }).then(function (isConfirm) {
                                if (isConfirm.value === true) {
                                    self.change_status(items, 'Deactivated');
                                }
                            });
                        });

                        $('.activate').click(function () {

                            self._id = $(this).data('id');

                            var items = {};

                            items.id = self._id;
                            items.role = $(this).data('name');
                            items.datedeleted = '';

                            swal({
                                title: 'Are you sure you want to activate ' + $(this).data('name') + '?',
                                text: "You won't be able to revert this action!",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: 'green',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Activate!'
                            }).then(function (isConfirm) {
                                if (isConfirm.value === true) {
                                    self.change_status(items, 'Activated');
                                }
                            });
                        });
                    });
                },
                error: function (ex) {
                    var r = jQuery.parseJSON(response.responseText);
                    console.log("Message: " + r.Message);
                    console.log("StackTrace: " + r.StackTrace);
                    console.log("ExceptionType: " + r.ExceptionType);
                }
            });
        },
        roles: function () {
            var self = this;

            $.ajax({
                type: 'POST',
                url: '/Roles/get',
                dataType: 'json',
                data: { id: '' },
                success: function (data) {
                    var items = data.map(item => {
                        return new Promise(function (resolve, reject) {

                            if (item.DateDeleted === null) {
                                var html = "<option value='" + item.Id + "'>" + item.Role + "</td>";

                                $('#role').append(html);
                            }

                            resolve();
                        });
                    });

                    Promise.all(items).then(function () {
                        
                    });
                },
                error: function (ex) {
                    var r = jQuery.parseJSON(response.responseText);
                    console.log("Message: " + r.Message);
                    console.log("StackTrace: " + r.StackTrace);
                    console.log("ExceptionType: " + r.ExceptionType);
                }
            });
        },
        find: function (id) {
            var self = this;

            $.ajax({
                type: 'POST',
                url: '/Accounts/find',
                dataType: 'json',
                data: { id: id },
                success: function (data) {
                    var item = data[0];

                    $('#firstname').val(item.Firstname);
                    $('#lastname').val(item.Lastname);
                    $('#middlename').val(item.Middlename);
                    $('#email').val(item.Email);
                    $('#contact').val(item.Contact);
                    $('#gender').val(item.Gender).change();
                    $('#role').val(item.RoleId).change();
                    $('#password').val(item.Password).prop('disabled', true);
                },
                error: function (ex) {
                    var r = jQuery.parseJSON(response.responseText);
                    console.log("Message: " + r.Message);
                    console.log("StackTrace: " + r.StackTrace);
                    console.log("ExceptionType: " + r.ExceptionType);
                }
            });
        },
        change_status: function (items) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/Accounts/change_status',
                data: '{items: ' + JSON.stringify(items) + '}',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.Message === "0") {
                        swal('Successfully ' + status + '!', 'Role has been ' + status + '.', 'success');
                    } else {
                        swal('Successfully ' + status + '!', 'Role has been ' + status + '.', 'success');
                    }

                    self.get();
                },
                error: function () {
                    console.log("Error while inserting data");
                }
            });
        },
        clear: function () {
            $('.modal input[type=text], .modal input[type=password]').val('');
            $('.close').click();
            $('#save').text('Save').prop('disabled', false);
        },
        validate: function () {
            var self = this;

            var a = $("#firstname").validate(['required']).displayErrorOn($("#error-firstname"));
            var b = $("#lastname").validate(['required']).displayErrorOn($("#error-lastname"));
            var c = $("#email").validate(['email']).displayErrorOn($("#error-email"));
            var d = $("#password").validate(['required']).displayErrorOn($("#error-password"));
            var e = $("#contact").validate(['required']).displayErrorOn($("#error-contact"));

            return a && b && c && d && e;
        }
    };

    var InitializeParentObj = function () {
        var parentTaskObj = Object.create(parentObj);
        parentTaskObj.init();
    };

    InitializeParentObj();
});