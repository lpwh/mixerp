﻿/********************************************************************************
Copyright (C) Binod Nepal, Mix Open Foundation (http://mixof.org).

This file is part of MixERP.

MixERP is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MixERP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with MixERP.  If not, see <http://www.gnu.org/licenses/>.
***********************************************************************************/

/*jshint -W032, -W107, -W098 */
/*global areYouSureLocalized, Chart, currencyDecimalPlaces, decimalSeparator, legend, noneLocalized, Page_ClientValidate, selectLocalized, shortDateFormat, Sys, thousandSeparator, today*/

function getDocHeight(margin) {
    var D = document;
    var height = Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );

    if (margin) {
        height += parseInt2(margin);
    };

    return height;
};

var selectDropDownListByValue = function (textBoxId, dropDownListId) {
    var listControl = $("#" + dropDownListId);
    var textBox = $("#" + textBoxId);
    var selectedValue = textBox.val();
    var exists;

    if (isNullOrWhiteSpace(textBox.val())) {
        return;
    };

    if (listControl.length) {
        listControl.find('option').each(function () {
            if (this.value === selectedValue) {
                exists = true;
            }
        });
    }

    if (exists) {
        listControl.val(selectedValue).trigger('change');
    } else {
        textBox.val('').trigger('change');
    }

    triggerChange(dropDownListId);
};

var triggerChange = function (controlId) {
    var element = document.getElementById(controlId);

    if ('createEvent' in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
    } else {
        if ("fireEvent" in element)
            element.fireEvent("onchange");
    }
};

var triggerClick = function (controlId) {
    var element = document.getElementById(controlId);

    if ('createEvent' in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, true);
        element.dispatchEvent(evt);
    } else {
        if ("fireEvent" in element)
            element.fireEvent("onclick");
    }
};

//function fireEvent(element, event) {
//    if (document.createEvent) {
//        // dispatch for firefox + others
//        var evt = document.createEvent("HTMLEvents");
//        evt.initEvent(event, true, true); // event type,bubbling,cancelable
//        return !element.dispatchEvent(evt);
//    } else {
//        // dispatch for IE
//        var evt = document.createEventObject();
//        return element.fireEvent('on' + event, evt);
//    }
//};

var parseFloat2 = function (arg) {
    if (typeof (arg) === "undefined") {
        return 0;
    };

    var input = arg;

    if (currencySymbol) {
        input = input.toString().replace(currencySymbol, "");
    };

    var val = parseFloat(parseFormattedNumber(input.toString()) || 0);

    if (isNaN(val)) {
        val = 0;
    }

    return val;
};

var parseInt2 = function (arg) {
    if (typeof (arg) === "undefined") {
        return 0;
    };

    var val = parseInt(parseFormattedNumber(arg.toString()) || 0);

    if (isNaN(val)) {
        val = 0;
    }

    return val;
};

var confirmAction = function () {
    return confirm(areYouSureLocalized);
};

/******************************************************************************************************
DATE EXPRESSION START
******************************************************************************************************/

var validateByControlId = function (controlId) {
    if (typeof Page_ClientValidate === "function") {
        Page_ClientValidate(controlId);
    };
};

$(document).ready(function () {
    $(".date").blur(function () {
        if (today === "") return;
        var control = $(this);
        var value = control.val().trim().toLowerCase();
        var result;
        var number;

        if (value === "d") {
            result = dateAdd(today, "d", 0);
            control.val(result).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "m" || value === "+m") {
            control.val(dateAdd(today, "m", 1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "w" || value === "+w") {
            control.val(dateAdd(today, "d", 7)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "y" || value === "+y") {
            control.val(dateAdd(today, "y", 1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "-d") {
            control.val(dateAdd(today, "d", -1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "+d") {
            control.val(dateAdd(today, "d", 1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "-w") {
            control.val(dateAdd(today, "d", -7)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "-m") {
            control.val(dateAdd(today, "m", -1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value === "-y") {
            control.val(dateAdd(today, "y", -1)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value.indexOf("d") >= 0) {
            number = parseInt(value.replace("d"));
            control.val(dateAdd(today, "d", number)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value.indexOf("w") >= 0) {
            number = parseInt(value.replace("w"));
            control.val(dateAdd(today, "d", number * 7)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value.indexOf("m") >= 0) {
            number = parseInt(value.replace("m"));
            control.val(dateAdd(today, "m", number)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }

        if (value.indexOf("y") >= 0) {
            number = parseInt(value.replace("y"));
            control.val(dateAdd(today, "y", number)).trigger('change');
            validateByControlId(control.attr("id"));
            return;
        }
    });
});

function dateAdd(dt, expression, number) {
    var d = Date.parseExact(dt, shortDateFormat);
    var ret = new Date();

    if (expression === "d") {
        ret = new Date(d.getFullYear(), d.getMonth(), d.getDate() + parseInt(number));
    }

    if (expression === "m") {
        ret = new Date(d.getFullYear(), d.getMonth() + parseInt(number), d.getDate());
    }

    if (expression === "y") {
        ret = new Date(d.getFullYear() + parseInt(number), d.getMonth(), d.getDate());
    }

    return ret.toString(shortDateFormat);
};

/******************************************************************************************************
DATE EXPRESSION END
******************************************************************************************************/

var showWindow = function (url) {
    $.colorbox({ width: +$('html').width() * 0.7, height: +$('html').height() * 0.7, iframe: true, href: url });
};

$(document).ready(function () {
    setCurrencyFormat();
    setNumberFormat();

    if (typeof Sys !== "undefined") {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(Page_EndRequest);
    }
});

function Page_EndRequest() {
    setCurrencyFormat();
    setNumberFormat();

    if (typeof (AsyncListener) === "function") {
        AsyncListener();
    };
};

var setCurrencyFormat = function () {
    if (typeof currencyDecimalPlaces === "undefined" || typeof decimalSeparator === "undefined" || typeof thousandSeparator === "undefined") {
        return;
    };

    $('input.currency').number(true, currencyDecimalPlaces, decimalSeparator, thousandSeparator);
};

var setNumberFormat = function () {
    if (typeof decimalSeparator === "undefined" || typeof thousandSeparator === "undefined") {
        return;
    };

    $('input.decimal').number(true, 6, decimalSeparator, thousandSeparator);
    $('input.integer').number(true, 0, decimalSeparator, thousandSeparator);
};

/******************************************************************************************************
Chart BEGIN
******************************************************************************************************/
var chartColors = ["#3366CC", "#DC3912", "#109618", "#FF9900", "#990099", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395", "#994499", "#AAAA11", "#E67300", "#8B0707", "#3B3EAC", "#B77322", "#16D620"];

function getFillColor(index) {
    var color = hexToRgb(chartColors[index]);
    var opacity = 0.8;
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")";
};

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

function prepareChart(datasourceId, canvasId, legendId, type, log) {
    var table = $("#" + datasourceId);
    var labels = [];
    var data = [];
    var datasets = [];
    var title;
    var index = 0;

    //Loop through the table header for labels.
    table.find("tr:first-child th:not(:first-child)").each(function () {
        //Create labels from header row columns.
        labels.push($(this).html());
    });

    //Loop through each row of the table body.
    table.find("tr").not(":first").each(function () {
        //Get an instance of the current row
        var row = $(this);

        //The first column of each row is the legend.
        title = row.find(":first-child").html();

        //Reset the data object's value from the previous iteration.
        data = [];
        //Loop through the row columns.
        row.find(":not(:first-child)").each(function () {
            //Get data from this row.
            data.push(parseFloat2($(this).html()));
        });

        //Create a new dataset representing this row.
        var dataset =
        {
            fillColor: getFillColor(index),
            strokeColor: chartColors[index],
            pointColor: chartColors[index],
            data: data,
            title: title
        };

        //Add the dataset object to the array object.
        datasets.push(dataset);

        if (log) {
            console.log(JSON.stringify(datasets));
        }

        index++;
    });

    table.remove();

    var reportData = {
        labels: labels,
        datasets: datasets
    };

    var ctx = document.getElementById(canvasId).getContext("2d");

    switch (type) {
        case "line":
            new Chart(ctx).Line(reportData);
            break;
        case "radar":
            new Chart(ctx).Radar(reportData);
            break;
        default:
            new Chart(ctx).Bar(reportData);
            break;
    }

    legend(document.getElementById(legendId), reportData);
    table.hide();
}

function preparePieChart(datasourceId, canvasId, legendId, type, hide, titleColumnIndex, valueColumnIndex) {
    var table = $("#" + datasourceId);
    var value;
    var data = [];

    if (typeof titleColumnIndex === "undefined") {
        titleColumnIndex = 0;
    };

    if (typeof valueColumnIndex === "undefined") {
        valueColumnIndex = 1;
    };

    //Reset the counter.
    var counter = 0;

    //Loop through each row of the table body.
    table.find("tr").not(":first").each(function () {
        //Get an instance of the current row
        var row = $(this);

        //The first column of each row is the legend.
        var title = row.find("td:eq(" + parseInt2(titleColumnIndex) + ")").html();

        //The first column of each row is the legend.
        value = parseInt(row.find("td:eq(" + parseInt2(valueColumnIndex) + ")").html());

        var dataset = {
            value: value,
            color: chartColors[counter],
            title: title
        };

        //Add the dataset object to the array object.
        data.push(dataset);
        counter++;
    });

    var ctx = document.getElementById(canvasId).getContext("2d");

    switch (type) {
        case "doughnut":
            new Chart(ctx).Doughnut(data);
            break;
        case "polar":
            new Chart(ctx).PolarArea(data);
            break;
        default:
            new Chart(ctx).Pie(data);
            break;
    }

    legend(document.getElementById(legendId), data);
    if (hide) {
        table.hide();
    };
};

/******************************************************************************************************
Chart END
******************************************************************************************************/



var parseFormattedNumber = function (input) {
    if (typeof window.thousandSeparator === "undefined") {
        window.thousandSeparator = ",";
    };

    if (typeof window.decimalSeparator === "undefined") {
        window.decimalSeparator = ".";
    };

    var result = input.split(thousandSeparator).join("");
    result = result.split(decimalSeparator).join (".");
    return result;
};

var getFormattedNumber = function (input, isInteger) {
    if (typeof window.currencyDecimalPlaces === "undefined") {
        window.currencyDecimalPlaces = 2;
    };

    if (typeof window.thousandSeparator === "undefined") {
        window.thousandSeparator = ",";
    };

    if (typeof window.decimalSeparator === "undefined") {
        window.decimalSeparator = ".";
    };

    var decimalPlaces = currencyDecimalPlaces;

    if (isInteger) {
        decimalPlaces = 0;
    };

    return $.number(input, decimalPlaces, decimalSeparator, thousandSeparator);
};

var makeDirty = function (obj) {
    obj.parent().addClass("error");
    obj.focus();
};

var removeDirty = function (obj) {
    obj.parent().removeClass("error");
};

var isNullOrWhiteSpace = function (obj) {
    return (!obj || $.trim(obj) === "");
};

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    };
};

function displayMessage(a, b) {
    $.notify(a, b);
};

var logError = function (a, b) {
    //Todo
    $.notify(a, b);
};

function logAjaxErrorMessage(xhr) {
    logError(getAjaxErrorMessage(xhr));
};

function logToConsole(message) {
    console.log(message);
};

function logToConsole2(message) {
    console.log(JSON.stringify(message));
};

var sumOfColumn = function (tableSelector, columnIndex) {
    var total = 0;

    $(tableSelector).find('tr').each(function () {
        var value = parseFormattedNumber($('td', this).eq(columnIndex).text());
        total += parseFloat2(value);
    });

    return $.number(total, currencyDecimalPlaces, decimalSeparator, thousandSeparator);
};

var getColumnText = function (row, columnIndex) {
    return row.find("td:eq(" + columnIndex + ")").text();
};

var setColumnText = function (row, columnIndex, value) {
    row.find("td:eq(" + columnIndex + ")").html(value);
};

var fadeThis = function (selector) {
    var options = {};
    var panel = $(selector);
    panel.effect("fade", options, 5000);
};

jQuery.fn.getSelectedItem = function () {
    var listItem = $(this[0]);
    return listItem.find("option:selected");
};

jQuery.fn.getSelectedValue = function () {
    return $(this[0]).getSelectedItem().val();
};

jQuery.fn.getSelectedText = function () {
    return $(this[0]).getSelectedItem().text();
};

var appendParameter = function (data, parameter, value) {
    if (!isNullOrWhiteSpace(data)) {
        data += ",";
    };

    if (value === undefined) {
        value = "";
    };

    data += JSON.stringify(parameter) + ':' + JSON.stringify(value);

    return data;
};

var getData = function (data) {
    if (data) {
        return "{" + data + "}";
    };

    return null;
};

var focusNextElement = function () {
    var $this = document.activeElement;

    // if we haven't stored the tabbing order
    if (!$this.form.tabOrder) {
        var els = $this.form.elements,
            ti = [],
            rest = [];

        // store all focusable form elements with tabIndex > 0
        for (var i = 0, il = els.length; i < il; i++) {
            if (els[i].tabIndex > 0 &&
                !els[i].disabled &&
                !els[i].hidden &&
                !els[i].readOnly &&
                els[i].type !== 'hidden') {
                ti.push(els[i]);
            }
        }

        // sort them by tabIndex order
        ti.sort(function (a, b) { return a.tabIndex - b.tabIndex; });

        // store the rest of the elements in order
        for (i = 0, il = els.length; i < il; i++) {
            if (els[i].tabIndex === 0 &&
                !els[i].disabled &&
                !els[i].hidden &&
                !els[i].readOnly &&
                els[i].type !== 'hidden') {
                rest.push(els[i]);
            }
        }

        // store the full tabbing order
        $this.form.tabOrder = ti.concat(rest);
    }

    // find the next element in the tabbing order and focus it
    // if the last element of the form then blur
    // (this can be changed to focus the next <form> if any)
    for (var j = 0, jl = $this.form.tabOrder.length; j < jl; j++) {
        if ($this === $this.form.tabOrder[j]) {
            if (j + 1 < jl) {
                $($this.form.tabOrder[j + 1]).focus();
            } else {
                $($this).blur();
            }
        }
    }
};

var toggleDanger = function (cell) {
    var row = cell.closest("tr");
    row.toggleClass("negative");
};

var addDanger = function (row) {
    row.removeClass("negative");
    row.addClass("negative");
};

var toggleSuccess = function (cell) {
    var row = cell.closest("tr");
    row.toggleClass("positive");
};

jQuery.fn.bindAjaxData = function (ajaxData, skipSelect, selectedValue) {
    "use strict";
    var selected;
    var targetControl = $(this);
    targetControl.empty();

    if (ajaxData.length === 0) {
        appendItem(targetControl, "", window.noneLocalized);
        return;
    };

    if (!skipSelect) {
        appendItem(targetControl, "", window.selectLocalized);
    }

    $.each(ajaxData, function () {
        selected = false;

        if (selectedValue) {
            if (this.Value === selectedValue) {
                selected = true;
            };
        };

        appendItem(targetControl, this.Value, this.Text, selected);
    });
};

var appendItem = function (dropDownList, value, text, selected) {
    var option = $("<option></option>");
    option.val(value).html(text).trigger('change');

    if (selected) {
        option.prop("selected", true);
    };

    dropDownList.append(option);
};

var getAjax = function (url, data) {
    if (data) {
        return $.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    return $.ajax({
        type: "POST",
        url: url,
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
};

var ajaxUpdateVal = function (url, data, targetControls) {
    var ajax;

    if (data) {
        ajax = getAjax(url, data);
    } else {
        ajax = getAjax(url);
    };

    ajax.success(function (msg) {
        targetControls.each(function () {
            $(this).val(msg.d).trigger('change');
        });

        if (typeof ajaxUpdateValCallback == "function") {
            ajaxUpdateValCallback(targetControls);
        };
    });

    ajax.error(function (xhr) {
        logAjaxErrorMessage(xhr);
    });
};

var ajaxDataBind = function (url, targetControl, data, selectedValue, associatedControl) {
    if (!targetControl) {
        return;
    };

    if (targetControl.length === 0) {
        return;
    };

    var ajax;

    if (data) {
        ajax = new getAjax(url, data);
    } else {
        ajax = new getAjax(url);
    };

    ajax.success(function (msg) {
        if (targetControl.length === 1) {
            targetControl.bindAjaxData(msg.d, false, selectedValue);
        };

        if (targetControl.length > 1) {
            targetControl.each(function () {
                $(this).bindAjaxData(msg.d, false, selectedValue);
            });
        };

        if (associatedControl && associatedControl.val) {
            associatedControl.val(selectedValue).trigger('change');
        };

        if (typeof ajaxDataBindCallBack === "function") {
            ajaxDataBindCallBack(targetControl);
        };
    });

    ajax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(targetControl, 0, err.Message);
    });
};

var getAjaxErrorMessage = function (xhr) {
    if (xhr) {
        var err = $.parseJSON(xhr.responseText).Message;
        return err;
    }

    return "";
};

var repaint = function () {
    setTimeout(function () {
        $(document).trigger('resize');
    }, 1000);
};

var removeRow = function (cell) {
    var result = confirm(areYouSureLocalized);

    if (result) {
        cell.closest("tr").remove();
    }
};

var tableToJSON = function (grid) {
    var colData = [];
    var rowData = [];

    var rows = grid.find("tr:not(:last-child)");

    rows.each(function () {
        var row = $(this);

        colData = [];

        row.find("td:not(:last-child)").each(function () {
            colData.push($(this).text());
        });

        rowData.push(colData);
    });

    var data = JSON.stringify(rowData);

    return data;
};

function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
}

function convertToDebit(balanceInCredit) {
    return balanceInCredit * -1;
};

function popUnder(div, button) {
    div.css("position", "fixed");

    div.position({
        my: "left top",
        at: "left bottom",
        of: button,
        collision: "fit"
    });

    div.show(500);
};

function getSelectedCheckBoxItemIds(checkBoxColumnPosition, itemIdColumnPosition, grid) {
    var selection = [];

    //Iterate through each row to investigate the selection.
    grid.find("tr").each(function () {
        //Get an instance of the current row in this loop.
        var row = $(this);

        //Get the instance of the cell which contains the checkbox.
        var checkBoxContainer = row.select("td:nth-child(" + checkBoxColumnPosition + ")");

        //Get the instance of the checkbox from the container.
        var checkBox = checkBoxContainer.find("input");

        if (checkBox) {
            //Check if the checkbox was selected or checked.
            if (checkBox.prop("checked")) {
                //Get ID from the associated cell.
                var id = row.find("td:nth-child(" + itemIdColumnPosition + ")").html();

                //Add the ID to the array.
                selection.push(id);
            }
        }
    });

    return selection;
};

var toogleSelection = function (element) {
    var property = element.prop("checked");

    if (property) {
        element.prop("checked", false);
    } else {
        element.prop("checked", true);
    }
};

jQuery.fn.getTotalColumns = function () {
    var grid = $($(this).selector);
    var row = grid.find("tr").eq(1);

    var colCount = 0;

    row.find("td").each(function () {
        if ($(this).attr('colspan')) {
            colCount += +$(this).attr('colspan');
        } else {
            colCount++;
        }
    });

    return colCount;
};

function createFlaggedRows(grid, bgColorColumnPos, fgColorColumnPos) {
    if (!bgColorColumnPos) {
        bgColorColumnPos = grid.getTotalColumns() - 1;
    };

    if (!fgColorColumnPos) {
        fgColorColumnPos = grid.getTotalColumns();
    };

    //Iterate through all the rows of the grid.
    grid.find("tr").each(function () {
        //Get the current row instance from the loop.
        var row = $(this);

        //Read the color value from the associated column.
        var background = row.find("td:nth-child(" + bgColorColumnPos + ")").html();
        var foreground = row.find("td:nth-child(" + fgColorColumnPos + ")").html();

        if (background) {
            if (background !== '&nbsp;') {
                row.css("background", background);

                //Iterate through all the columns of the current row.
                row.find("td").each(function () {
                    //Prevent border display by unsetting the border information for each cell.
                    $(this).css("border", "none");
                });
            }
        }

        if (foreground) {
            if (foreground !== '&nbsp;') {
                row.find("td").css("color", foreground);
            }
        }

        row.find(":nth-child(" + bgColorColumnPos + ")").hide();
        row.find(":nth-child(" + fgColorColumnPos + ")").hide();
    });
};

jQuery.fn.updateHiddenFieldOnBlur = function (associatedControl) {
    var element = $(this[0]);
    associatedControl.val(element.getSelectedValue()).trigger('change');

    element.blur(function () {
        associatedControl.val(element.getSelectedValue()).trigger('change');
    });
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

function displaySucess() {
    $.notify(taskCompletedSuccessfullyLocalized, "success");
};

//Semantic UI Tab Support
$(document).ready(function () {
    var tabItems = $('.tabular .item');

    if (tabItems && tabItems.length > 0) {
        tabItems.tab();
    };

    //Semantic UI Button Support
    var buttons = $(".buttons .button");

    buttons.on("click", function () {
        buttons.removeClass("active");
        $(this).addClass("active");
    });
});

var printGridView = function (templatePath, headerPath, reportTitle, gridViewId, printedDate, user, office, windowName, offset, offsetLast) {
    //Load report template from the path.
    $.get(templatePath, function () { }).done(function (data) {
        //Load report header template.
        $.get(headerPath, function () { }).done(function (header) {
            var table = $("#" + gridViewId).clone();

            table.find("tr.tableFloatingHeader").remove();

            table.find("th:nth-child(-n" + offset + ")").remove();
            table.find("td:nth-child(-n" + offset + ")").remove();

            table.find("th:nth-last-child(-n" + offsetLast + ")").remove();
            table.find("td:nth-last-child(-n" + offsetLast + ")").remove();

            table.find("td").removeAttr("style");
            table.find("tr").removeAttr("style");

            table = "<table border='1' class='preview'>" + table.html() + "</table>";

            data = data.replace("{Header}", header);
            data = data.replace("{ReportHeading}", reportTitle);
            data = data.replace("{PrintDate}", printedDate);
            data = data.replace("{UserName}", user);
            data = data.replace("{OfficeCode}", office);
            data = data.replace("{Table}", table);

            //Creating and opening a new window to display the report.
            var w = window.open('', windowName,
                + ',menubar=0'
                + ',toolbar=0'
                + ',status=0'
                + ',scrollbars=1'
                + ',resizable=0');
            w.moveTo(0, 0);
            w.resizeTo(screen.width, screen.height);

            //Writing the report to the window.
            w.document.writeln(data);
            w.document.close();

            //Report sent to the browser.
        });
    });
};

function setVisible(targetControl, visible, time) {
    if (visible) {
        targetControl.show(time);
        return;
    };

    targetControl.hide(time);
};

function createCascadingPair(select, input) {
    input.blur(function () {
        selectDropDownListByValue(this.id, select.attr("id"));
    });

    select.change(function () {
        input.val(select.getSelectedValue());
    });
};

function parseDate(str) {
    return new Date(Date.parse(str));
};

function parseSerializedDate(str) {
    str = str.replace(/[^0-9 +]/g, '');
    return new Date(parseInt(str));
};

//http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
function updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
};
