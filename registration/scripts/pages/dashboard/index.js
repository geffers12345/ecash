$(document).ready(function () {
    var parentObj = {
        init: function () {
            var self = this;

            self.declaration();
            self.setEvents();
        },
        declaration: function () {
            var self = this;

            self._id = 0;

            self.$btn_deposit = $('#deposit');
            self.code = Math.floor(100000 + Math.random() * 900000);

            self.qr(self.code);
        },
        setEvents: function () {
            var self = this;

            self.$btn_deposit.on("click", function (event) {
                event.preventDefault();

                if (self.validate()) {

                    self.$btn_deposit.text('Loading..').prop('disabled', true);

                    var items = {};

                    items.id = self._id;
                    items.amount = $('#deposit-amount').val();
                    items.transactiontype = 1000;
                    items.code = self.code;
                    items.datecreated = current_date_time();

                    self.insert(items, $('#qrcode').find('img').attr('src'));
                }
            });
        },
        qr: function (value) {
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: value,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        },
        insert: function (items, image) {
            var self = this;

            $.ajax({
                type: "POST",
                url: '/AddMoney/create',
                data: '{items: ' + JSON.stringify(items) + '}',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    self.prewiew(data.data);

                    swal('Successfully Saved!', 'Make sure to take a screenshot of the qr code, then present it to the cashier.', 'success');

                    self.save_image(image);
                    self.clear();
                    self.$btn_deposit.text('Submit').prop('disabled', false);
                    $('#btn-preview-deposit').click();
                },
                error: function () {
                    console.log("Error while inserting data");
                }
            });
        },
        prewiew: function (data) {

            $('#preview-details').html(`<div class="row">
                    <div class="col-md-6">
                        <label class="text-gray-700">Amount:</label>
                    </div>
                    <div class="col-md-6">
                        <label class="text-primary">P` + data.Amount + `</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="text-gray-700">Transaction Code:</label>
                    </div>
                    <div class="col-md-6">
                        <label class="text-primary">` + data.Code + `</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="text-gray-700">Date:</label>
                    </div>
                    <div class="col-md-6">
                        <label class="text-primary">` + moment(data.DateCreated).format("MMM DD YYYY") + `</label>
                    </div>
                </div>`);
        },
        save_image: function (image) {

            var formdata = new FormData();
            formdata.append("base64image", image);

            $.ajax({
                url: '/AddMoney/saveQr',
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false
            });
        },
        clear: function () {
            $('.modal input[type=text], .modal input[type=password]').val('');
            $('.close').click();
            $('#save').text('Save').prop('disabled', false);
        },
        validate: function () {
            var self = this;

            var a = $("#deposit-amount").validate(['required']).displayErrorOn($("#error-deposit-amount"));

            return a;
        }
    };

    var InitializeParentObj = function () {
        var parentTaskObj = Object.create(parentObj);
        parentTaskObj.init();
    };

    InitializeParentObj();
});