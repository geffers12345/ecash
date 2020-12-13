var Control = {
    hide: function (elements) {
        if (elements instanceof Array) {
            for (element in elements) {
                $("#" + elements[element]).css('display', 'none');
            }

            return true;
        }

        $("#" + elements).css('display', 'none');
        return true;
    },

    show: function (elements) {
        if (elements instanceof Array) {
            for (element in elements) {
                $("#" + elements[element]).css('display', 'block');
            }

            return true;
        }

        $("#" + elements).css('display', 'block');
        return true;
    }
};

function Watcher(callback, sync) {
    this.syncOnUserInput = sync;
    this.controls = [];
    this.callback = callback;
}

Watcher.prototype.watch = function () {
    if (this.syncOnUserInput) {
        for (control in this.controls) {
            $("#" + this.controls[control]).change(this.callback);
        }
    }
}

Watcher.prototype.addControl = function (control) {
    this.controls.push(control);
};

Watcher.prototype.addControls = function (controls) {
    this.controls = this.controls.concat(controls);
};

function SelectTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function http()
{
    this.url = '';
    this.data = {};
    this.type = {};
    this.statuses = {};
    this.beforeCall = function () {

    };

    this.onSuccess = function (data, status, xhr) {

    };

    this.onError = function (xhr, status, error) {

    };

    this.get = function (url, data) {
        this.type = 'GET';
        this.setUrlAndData(url, data);

        return this;
    };

    this.post = function (url, data) {
        this.type = "POST";
        this.setUrlAndData(url, data);

        return this;
    };

    this.setUrlAndData = function (url, data) {
        this.url = url;

        if (data != null || data != undefined)
            this.data = data;
    };

    this.prepare = function (callback) {
        this.beforeCall = callback;

        return this;
    };

    this.then = function (callback) {
        this.onSuccess = callback;

        return this;
    };

    this.whenError = function (callback) {
        this.onError = callback;

        return this;
    };

    this.whenStatus = function (statusCode, callback) {
        this.statuses[statusCode] = callback;

        return this;
    };

    this.run = function (data, onSuccess) {
        var rData = this.data;
        var onSuccessCallable = this.onSuccess;

        if (data != null || data != undefined)
            rData = data;

        if (onSuccess != null || onSuccess != undefined)
            onSuccessCallable = onSuccess;

        ajaxCaller(this.url, rData, this.type, this.beforeCall, onSuccessCallable, this.onError, this.statuses);
    }
}

var ajaxCaller = function (url, data, type, beforeSend, onSuccess, onError, statuses) {
    $.ajax({
        type: type,
        url: url,
        async: true,
        data: JSON.stringify(data),
        beforeSend: beforeSend,
        success: onSuccess,
        error: onError,
        statusCode: statuses,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
};

var User = {
    CurrentPosition: function () {
        var userPosition = null;

        if (navigator.geolocation) {
            console.log(navigator.geolocation);
            navigator.geolocation.getCurrentPosition(function (position) {
                userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
        return userPosition;
    }
}

function Church(id, parish, address, schedule, ventilation, comment, photo) {
    this.id = id;
    this.parish = parish;
    this.address = address;
    this.schedule = schedule;
    this.ventilation = ventilation;
    this.comment = comment;
    this.photo = photo;
}

Church.prototype.render = function () {
    return '<a href="#" target="_blank" id="churchItem" data-id="' + this.id + '" class="churchItem">' +
                '<div class="row church-result">' +
                    '<div class="col-md-4">' +
                        '<img class="img-responsive" src="' + this.photo + '">' +
                    '</div>' +
                    '<div class="col-md-8">' +
                        '<h4 class="church-name text-danger">' + this.parish + '</h4>' +
                        '<p class="church-location text-muted">' + this.address + '</p>' +
                        '<div class="church-details">' +
                            '<p>Mass Schedule: <strong>' + this.schedule + '</strong></p>' +
                            '<p>Ventilation: <strong>' + this.ventilation + '</strong></p>' +
                        '</div>' +
                        '<p class="text-comment">Comments: <em>"' + this.comment + '"</em></p>' +
                    '</div>' +
                '</div>' +
            '</a>';
}

function Adoration(id, name, address, schedule, ventilation, comment, photo) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.schedule = schedule;
    this.ventilation = ventilation;
    this.comment = comment;
    this.photo = photo;
}

Adoration.prototype.render = function () {
    return '<a href="#" target="_blank" id="adorationItem" data-id="' + this.id + '" class="adorationItem">' +
                '<div class="row church-result">' +
                    '<div class="col-md-4">' +
                        '<img class="img-responsive" src="' + this.photo + '">' +
                    '</div>' +
                    '<div class="col-md-8">' +
                        '<h4 class="church-name text-danger">' + this.name + '</h4>' +
                        '<p class="church-location text-muted">' + this.address + '</p>' +
                        '<div class="church-details">' +
                            '<p>Adoration Schedule: <strong>' + this.schedule + '</strong></p>' +
                            '<p>Ventilation: <strong>' + this.ventilation + '</strong></p>' +
                        '</div>' +
                        '<p class="text-comment">Comments: <em>"' + this.comment + '"</em></p>' +
                    '</div>' +
                '</div>' +
            '</a>';
}

function GMap(selector, options) {
    this.selector = selector;
    this.options = options;
    this.map = null;
    this.markers = new Map();
    this.directionsService = null;
    this.directionsDisplay = null;
}

GMap.prototype.Create = function () {
    this.map = new google.maps.Map(this.selector, this.options);
};

GMap.prototype.SetUpDirectionService = function () {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

    this.directionsDisplay.setMap(this.map);
}

GMap.prototype.DrawRoute = function (from, to) {
    var gmap = this;

    this.directionsService.route({
        origin: from,
        destination: to,
        travelMode: 'DRIVING',

    }, function (response, status) {
        gmap.directionsDisplay.setDirections(response);
    });
}

GMap.prototype.AddMarker = function (id, data, hasIcon) {
    data.map = this.map;
    if (! hasIcon)
        data.icon = 'Images/pointer.png';
    this.markers.set(id, new google.maps.Marker(data));
}

GMap.prototype.RemoveMarker = function (id) {
    this.markers.get(id).setMap(null);
}

GMap.prototype.SetMarkerVisited = function (id) {
    this.getMarker(id).setIcon('Images/flag_green_pointer.png');
}

GMap.prototype.SetMarkerUnvisited = function (id) {
    this.getMarker(id).setIcon('Images/flag_red_pointer.png');
}

GMap.prototype.SetMarkerCurrentlyHere = function (id) {
    this.getMarker(id).setIcon('Images/arrow_pointer.png');
}

GMap.prototype.ClearMarker = function () {
    this.markers.forEach(function (marker) {
        marker.setMap(null);
    });
}

GMap.prototype.setActiveMarker = function (id) {
    this.centerMapIfMarkerOutOfBounds(id);

    this.AnimateMarker(id);

    this.getMarker(id).setIcon('Images/active_pointer.png');
}

GMap.prototype.setInactiveMarker = function (id) {
    this.RemoveMarkerAnimation(id);

    this.getMarker(id).setIcon('Images/pointer.png');
}

GMap.prototype.AnimateMarker = function (id) {
    this.getMarker(id).setAnimation(google.maps.Animation.BOUNCE);
}

GMap.prototype.RemoveMarkerAnimation = function (id) {
    this.getMarker(id).setAnimation(null);
}

GMap.prototype.getMarker = function (id) {
    return this.markers.get(id);
}

GMap.prototype.centerMapIfMarkerOutOfBounds = function (id) {
    if (! this.map.getBounds().contains(this.getMarker(id).getPosition()))
    {
        this.map.panTo(this.getMarker(id).position);
    }
}

function Checkbox(element)
{
    this.element = $("#" + element);
}

Checkbox.prototype.getValue = function () {
    return this.element.is(':checked');
}

Checkbox.prototype.setValue = function (value) {
    this.element.prop('checked', value);
}

Checkbox.prototype.reset = function () {
    this.setValue(false);
}

function Selectbox(element)
{
    this.element = $("#" + element);
}

Selectbox.prototype.getValue = function () {
    return this.element.val();
}

Selectbox.prototype.setValue = function (value) {
    this.element.val(value);
}

Selectbox.prototype.reset = function () {
    this.setValue("");
}

function Textbox(element)
{
    this.element = $("#" + element);
}

Textbox.prototype.getValue = function () {
    return this.element.val();
}

Textbox.prototype.setValue = function (value) {
    this.element.val(value);
}

Textbox.prototype.reset = function() {
    this.setValue("");
}

function Radiobutton(element)
{
    this.element = element;
}

Radiobutton.prototype.getValue = function () {
    return $("input[type='radio']." + this.element + ":checked").val();
}

Radiobutton.prototype.setValue = function (value) {
    $('input[name="' + this.element + '"][value="' + value + '"]').prop('checked', true);
}

Radiobutton.prototype.reset = function() {
    this.setValue("");
}

function FilterCache()
{
    this.history = new Map();
    this.controls = new Map();
    
}

FilterCache.prototype.registerControls = function (id, control) {
    this.controls.set(id, control);
}

FilterCache.prototype.SaveState = function () {
    var state = new Map();

    this.controls.forEach(function (control, key) {
        state.set(key, control.getValue());
    });

    this.history.set(this.history.size + 1, state);
}

FilterCache.prototype.RevertToLastState = function () {
    var state = this.history.get(this.history.size);
    var controls = this.controls;

    state.forEach(function (value, key) {
        controls.get(key).setValue(value);
    });
}

function GrabCoordinates(place, callback) {
    if (place == "") {
        callback({
            'Latitude': 0,
            'Longitude': 0
        });
        return;
    }
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        data: {
            key: "AIzaSyDWGq_DSsFLKGAqIZyguSqBHCqGQxypS8Q",
            address: place
        },
        success: function (data) {
            if (data.status == 'OK') {
                callback({
                    'Latitude': data.results[0].geometry.location.lat,
                    'Longitude': data.results[0].geometry.location.lng
                });
            }

            else if (data.status == 'ZERO_RESULTS') {
                callback(null);
            }
        },
        error: function (xhr, status, errorThrown) {
            if (xhr.responseJSON.status == 'INVALID_REQUEST') {
                callback(null);
            }
        }
    });
}

function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}