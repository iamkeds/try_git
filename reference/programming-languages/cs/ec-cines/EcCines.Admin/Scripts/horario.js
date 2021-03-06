﻿/*
Date:     Feb.16/2014
Modified: Apr.15/2015
*/
var maskSettings = {
    placeholder: 'HH:MM',
    completed: function () {
        var parts = this.val().split(":"),
            error = false;
        if (parts[0] > 23) {
            error = true;
        }
        if (parts[1] > 59) {
            error = true;
        }
        if (true === error) {
            this.val("00:00");
        }
    }
};

$(function () { LoadPage(); });
/*****************************************************************************************************************/
LoadPage = function () {
    Load();
    //window.Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(BeginRequestHandler);
    window.Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
};
/*****************************************************************************************************************/
BeginRequestHandler = function (sender, args) {
    if ($('#panelCargando').attr('id') != undefined) $('#panelCargando').show();
};
/*****************************************************************************************************************/
EndRequestHandler = function (sender, args) {
    Load();
    //if ($('#panelCargando').attr('id') != undefined) $('#panelCargando').hide();
};
/*****************************************************************************************************************/
onKeyDownEvent = function (e) {
    if (e.which == 13) {
        e.preventDefault();
        if ($(this).val() != "00:00") {
            adicionarInputHora($(this));
        }
    }
};
/***********************************************************************/
/**************Carga inicial de las funciones del sistema***************/
/***********************************************************************/
Load = function () {
    setDatepicker($('.txt_fecha'));
    $('.mas').click(function (e) { e.preventDefault(); acordeon($(this)); });
    $('.masHora').click(function (e) { e.preventDefault(); adicionarInputHora($(this)); });
    $('.txt_hora').mask('99:99', maskSettings).keydown(onKeyDownEvent);
    $('.clon').click(function (e) { e.preventDefault(); clonar($(this)) });
    $('#addFecha').click(function () { adicionarFecha(); });
    $('#btnGuardar').click(function () { ObtenerInfoProgramacion(); });
    $('#btnGuardarTop').click(function () { ObtenerInfoProgramacion(); });
};

/*****************************************************************************************************************/
getMinDate = function () { return new Date(); };
FormatoHora = function () { $('.horas').keypress(function (e) { return Move(e) || Numbers(e); }); };
Move = function (e) { return e.which < 32; };
Numbers = function (e) { return (e.which >= 48 && e.which <= 57); };
/*****************************************************************************************************************/

adicionarInputHora = function (elem) {
    var element = $(elem).parent('div');
    if (element.children('input').last().length == 0 || element.children().last().val() != "") {
        element.append('<input class="txt_hora" placeholder="HH:MM" autocomplete="off" type="text" value="">');
        element.children().last().focus();
        element.children().last().mask('99:99', maskSettings).last().keydown(onKeyDownEvent);
    } else {
        if (element.children('input').last().length > 0) {
            element.children().last().focus();
        }
    }
};
/*****************************************************************************************************************/
acordeon = function (elem) {
    $(elem).parent('div').parent('div').children('.horas').toggle('slow');
    var img = $(elem).find('img');
    if ($(img).attr('src') == 'images/FlechaAba.png')
        $(img).attr('src', 'images/FlechaDer.png');
    else
        $(img).attr('src', 'images/FlechaAba.png');
};

/*****************************************************************************************************************/
ObtenerInfoProgramacion = function () {
    if ($('#codNuevaFecha').val() == "") return;
    var json = '{"id":' + $('#infoProgramacion').val() + ',"fs":[';
    $.each($('.fechas'), function (i, v) {
        if ($(v).find('.txt_fecha').val() == '') {
            $(v).find('.txt_fecha').focus();
            return false;
        }
        json += '{"f":"' + $(v).find('.txt_fecha').val().split(',')[1].trim() + '","fms":[';
        $.each($(v).find('.formatos'), function (j, f) {
            json += '{"idf":' + $(f).attr('idFormato') + ',"idh":' + $(f).attr('idHorarioPelicula') + ',"h":"';
            $.each($(f).find('.txt_hora'), function (k, h) {
                if ($(h).val() != '')
                    json += $(h).val() + ',';
            });
            if (json.substring((json.length - 1)) == ',')
                json = json.substring((json.length - 1), 0) + '"},';
            else
                json += '"},';
        });
        if (json.substring((json.length - 1)) == ',')
            json = json.substring((json.length - 1), 0) + ']},';
        else
            json += ']},';
    });
    if (json.substring((json.length - 1)) == ',')
        json = json.substring((json.length - 1), 0) + ']}';
    else
        json += ']}';
    $('#infoProgramacion').val(json);
    $('#codNuevaFecha').val("");
};
/*****************************************************************************************************************/
adicionarFecha = function () {
    $('#contentFechas').prepend($('#codNuevaFecha').val());
    setDatepicker($('.txt_fecha'));
    $('.txt_fecha').first().focus();
    $('.mas_nuevo').click(function (e) { e.preventDefault(); acordeon($(this)); });
    $('.masHora_nuevo').click(function (e) { e.preventDefault(); adicionarInputHora($(this)); });
    $('.mas_nuevo').addClass('mas').removeClass('mas_nuevo');
    $('.masHora_nuevo').addClass('masHora').removeClass('masHora_nuevo');
    $('.clon_nuevo').click(function (e) { e.preventDefault(); clonar($(this)) });
    $('.clon_nuevo').addClass('clon').removeClass('clon_nuevo');
};
/*****************************************************************************************************************/
clonar = function (elem) {
    var fechaIn = $($(elem).parent('div').parent('div')).find('.txt_fecha');
    if ($(fechaIn).val() == '') {
        $(fechaIn).focus();
        return;
    }
    var htmlCompleto = $(elem).parent('div').parent('div').html();
    $('#contentFechas').prepend("<div class='fechas'>" + htmlCompleto + "</div>");
    var element = $($('#contentFechas div').first());
    var fechaIn = $(element).find('.txt_fecha');
    $(fechaIn).val('');
    $(fechaIn).removeClass('hasDatepicker');
    $(fechaIn).attr('id', '').attr('value', '');
    setDatepicker($(fechaIn));
    $(fechaIn).focus();
    $.each($(element).find('.formatos'), function (j, f) {
        $(f).attr('idHorarioPelicula', '0');
    });
    $.each($(element).find('.mas'), function (j, g) {
        $(g).click(function (e) { e.preventDefault(); acordeon($(this)); });
    });
    $.each($(element).find('.masHora'), function (j, h) {
        $(h).click(function (e) { e.preventDefault(); adicionarInputHora($(this)); });
    });
    $.each($(element).find('.clon'), function (j, i) {
        $(i).click(function (e) { e.preventDefault(); clonar($(this)) });
    });
    populateClon(elem);
};
/*****************************************************************************************************************/
populateClon = function (elem) {
    var formatosOri = $(elem).parent('div').parent('div').find('.formatos');
    var formatosClon = $('.fechas').first('div.fecha').find('.formatos');
    $.each(formatosOri, function (i, e) {
        var inputsOri = $(e).find('.txt_hora');
        var inputsClon = $(formatosClon[i]).find('.txt_hora');
        $.each(inputsOri, function (j, je) {
            $(inputsClon[j]).val($(je).val());
            $(inputsClon[j]).mask('99:99', maskSettings).keydown(onKeyDownEvent);
        });
    });
};

/*****************************************************************************************************************/
setDatepicker = function (elem) {
    $.datepicker.regional['es'] = { clearText: 'Limpiar', clearStatus: '', closeText: 'Cerrar', closeStatus: '', prevText: '&lt;Ant', prevStatus: '', nextText: 'Sig&gt;', nextStatus: '', currentText: 'Hoy', currentStatus: '', monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], monthStatus: '', yearStatus: '', weekHeader: 'Sm', weekStatus: '', dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], dayNamesShort: ['Dom', 'Lun', 'Mar', 'Miér;', 'Juv', 'Vie', 'Sáb'], dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá;'], dayStatus: 'DD', dateStatus: 'D, M d', dateFormat: 'yy/mm/dd', firstDay: 0, initStatus: '', isRTL: false }; $.datepicker.setDefaults($.datepicker.regional['es']);
    $(elem).datepicker({ dateFormat: 'DD, dd/mm/yy', minDate: getMinDate(), changeMonth: true, changeYear: true });
};