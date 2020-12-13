$(document).ready(function () {
    var parentObj = {
        init: function () {
            var self = this;

            self.declaration();
            self.setEvents();

            self.get();
        },
        declaration: function () {
            var self = this;

            self._id = 0;

            self.$name = $('#name');
            self.$description = $('#description');

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
                    items.role = self.$name.val();
                    items.description = self.$description.val();
                    items.datecreated = current_date_time();

                    self.insert(items);
                }
            });

            self.$btn_add.on("click", function (event) {
                event.preventDefault();

                self._id = 0;
                self.clear();
            });
        },
        insert: function (items) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/Roles/create',
                data: '{items: ' + JSON.stringify(items) + '}',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    var items = $(".dashboard:checked").map(function () {

                        var _self = $(this);

                        return new Promise(function (resolve, reject) {

                            var items = {};

                            items.roleid = data.autoId;
                            items.permissionid = _self.val();


                            self.insert_role_permissions(items);

                            resolve();
                        });

                    }).get();


                    Promise.all(items).then(function () {
                        if (self._id === 0) {
                            swal('Successfully Saved!', 'New role has been added.', 'success');
                        } else {
                            swal('Successfully Updated!', 'Role has been updated.', 'success');
                        }

                        self.clear();
                        self.get();
                    });
                    
                },
                error: function () {
                    console.log("Error while inserting data");
                }
            });
        },
        insert_role_permissions: function (items) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/Roles/create_role_permissions',
                data: '{items: ' + JSON.stringify(items) + '}',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    
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
                .append('<tr class="loading"><td colspan="8"><center><img src="/content/img/overlay-loader.gif" height="100"/></center></td></tr>');

            $.ajax({
                type: 'POST',
                url: '/Roles/get',
                dataType: 'json',
                data: { id: '' },
                success: function (data) {
                    var items = data.map(item => {
                        return new Promise(function (resolve, reject) {

                            var description = item.Description === null ? '' : item.Description;
                            var date_created = item.DateCreated === null ? '' : item.DateCreated;
                            var date_updated = item.DateUpdated === null ? '' : item.DateUpdated;

                            var isActive = item.DateDeleted === null ? "Activated" : "Not Activated";

                            var active = "<a data-id='" + item.Id + "' href='#' data-name='" + item.Role + "' class='btn btn-danger btn-circle deactivate remove'>"
                                + "<i class='fas fa-trash'></i>"
                                + "</a>";

                            var inactive = "<a data-id='" + item.Id + "' href='#' data-name='" + item.Role + "' class='btn btn-success btn-circle activate activate'>"
                                + "<i class='fas fa-check-circle'></i>"
                                + "</a>";

                            var statusAction = isActive == "Not Activated" ? inactive : active;

                            var html = "<tr>";

                            html += "<td>" + item.Id + "</td>" +
                                    "<td>" + item.Role + "</td>" +
                                    "<td>" + description + "</td>" +
                                    "<td>" + date_created + "</td>" +
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

                            $(".dashboard").prop('checked', false);

                            self.find($(this).data('id'));

                            self._id = $(this).data('id');

                            self.find_role_permission($(this).data('id'));
                        });

                        $('.remove').click(function () {

                            self._id = $(this).data('id');

                            var items = {};

                            items.id = self._id;
                            items.role = $(this).data('name');
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
        find: function (id) {
            var self = this;

            $.ajax({
                type: 'POST',
                url: '/Roles/find',
                dataType: 'json',
                data: { id: id },
                success: function (data) {
                    var item = data[0];

                    $('#name').val(item.Role);
                    $('#description').val(item.Description);
                },
                error: function (ex) {
                    var r = jQuery.parseJSON(response.responseText);
                    console.log("Message: " + r.Message);
                    console.log("StackTrace: " + r.StackTrace);
                    console.log("ExceptionType: " + r.ExceptionType);
                }
            });
        },
        find_role_permission: function (id) {
            var self = this;

            $.ajax({
                type: 'POST',
                url: '/Roles/find_role_permissions',
                dataType: 'json',
                data: { id: id },
                success: function (data) {
                    var items = data.map(item => {
                        return new Promise(function (resolve, reject) {

                            $(".dashboard").eq(parseInt(item.PermissionId) - 1).prop('checked', true);

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
        change_status: function (items) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/Roles/change_status',
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
            $('.modal .form-control').val('');
            $(".dashboard").prop('checked', false);
            $('.close').click();
            $('#save').text('Save').prop('disabled', false);
        },
        validate: function () {
            var self = this;

            var name = $("#name").validate(['required']).displayErrorOn($("#error-name"));

            return name;
        }
    };

    var InitializeParentObj = function () {
        var parentTaskObj = Object.create(parentObj);
        parentTaskObj.init();
    };

    InitializeParentObj();
});