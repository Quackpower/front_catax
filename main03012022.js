var session;
var dataInicial = [];
var allowToContinue = false;
var envioDatos = [];
var responseSend;
var folio;
var serv = "http://140.82.0.198:8069/";
var firstTimeCalled = true;
var latitudUser = 0;
var longitudUser = 0;
var markers = [];
var isUserLocationMarked = false;
var posicionUsuario = {
    lat: 19.4545963,
    lng: -96.9602712
};
var tiposArchivosPermitidos = ['jpg', 'jpeg', 'png', 'gif'];
var categoria, subcategoria, categoriaTXT, subcategoriaTXT, direccion;
var imagen_reducida;
var CMAS = false;
var mapR;
var mapT;
var toggler = document.getElementsByClassName("boxTree");
var iTree;
var imgPaso2;
var mapaIniciado = false;
var featuresCount = new Array();
var checkarray;
var xxx;
var detallesCat="";
var desdeBuscador = false;

$(document).ready(function() {

    materialDesign();
    if (home) {
        localStorage.removeItem('colonia');
        localStorage.removeItem('cp');
        llenaCategoriasSubcategorias();

        readyToSave();
        steps();

        getLocalizationReal();
        listenersMapa();
    } 

    

    $(document).on('click', '.menuHam', function() {
        $('.navbar-collapse').toggleClass('menuTactil');
        $('.blockUser').toggle();
        $(this).toggleClass("menuAbierto");
    });



    $(document).mouseup(function(e){
        var container = $(".navegacionTop");

        if (!container.is(e.target) && container.has(e.target).length === 0 && $('.menuTactil').length ==1 && e.target.className !== "menuHam") 
        {
            $('.navbar-collapse').toggleClass('menuTactil');
            $('.blockUser').toggle();
        }
    });


    $('.loadingSpinner').css('display', 'none');
});




function steps() {
    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;

    $(document).on('click', '.next', function() {
        var aqui = $(this);
        var pasar = true;
        var notDetalles = false;
        if ($(this).closest('fieldset').hasClass('detalles')) {

            if ($('#email').val()=="") {
                $.confirm({
                    title: 'Atención',
                    content: 'Si no proporciona su correo electrónico, no podrá consultar el seguimiento del reporte ni responder la escuesta de satisfacción.',
                    icon: 'fa fa-warning',
                    type: 'red',
                    buttons: {
                        regresar: function () {
                            pasar=false;
                        },
                        continuar: {
                            text: 'Continuar sin correo',
                            btnClass: 'btn-blue',
                            keys: ['enter', 'shift'],
                            action: function(){
                                pasar = true;
                                var faltante="";
                                $(" #Calle,#descripcion_reporte ").each(function() {
                                    if ($(this).val() === "" && $(this).attr('name') != "no_ext") {
                                        $(this).addClass('campo_faltante');
                                        pasar = false;
                                        faltante=faltante+"<br/>Calle y descripción deben ser llenados<br/>"
                                    } else {
                                        $(this).removeClass('campo_faltante');

                                    }
                                });

                                if ($('#telefono').val()=="") {
                                    $('#telefono').addClass('campo_faltante');
                                    pasar=false;
                                    faltante=faltante+"<br/>El campo teléfono debe ser llenado<br/>"
                                }
                                else if ($('#telefono').val().length!=10){
                                    pasar=false;
                                    faltante=faltante+"<br/>El campo teléfono debe ser a 10 dígitos<br/>"
                                }
                                else{
                                    $('#telefono').removeClass('campo_faltante');
                                }

                                if (ARBO) {
                                    if( document.getElementById("imagen").files.length == 0 ){
                                        $('#imagen').closest('div').addClass('campo_faltante');
                                        pasar=false;
                                        faltante=faltante+"<br/>Foto requerida<br/"
                                    }
                                    else{
                                        $('#imagen').closest('div').removeClass('campo_faltante');
                                    }
                                }

                                if (PTCI) {
                                    

                                    if ($('#nombre_completo').val()=="") {
                                        $('#nombre_completo').addClass('campo_faltante');
                                        pasar=false;
                                        faltante=faltante+"<br/>Nombre completo es requerido<br/"
                                    }
                                    else{
                                        $('#nombre_completo').removeClass('campo_faltante');
                                    }

                                    if (isAPDP) {
                                        if ($('#afectacion_vivienda').val()=="") {
                                            $('#afectacion_vivienda').addClass('campo_faltante');
                                            pasar=false;
                                            faltante=faltante+"<br/>Seleccione la afectación en vivienda<br/"
                                        }
                                        else{
                                            $('#afectacion_vivienda').removeClass('campo_faltante');
                                        }
                                    }

                                }

                                if (pasar==false) {
                                    $.dialog({
                                        title: 'Error',
                                        icon: 'fa fa-warning',
                                        type: 'red',
                                        typeAnimated: true,
                                        content: "Hay campos vacios que deben ser llenados."+faltante
                                    });
                                }

                                if (pasar) {
                                    current_fs = aqui.closest('fieldset');
                                    next_fs = aqui.closest('fieldset').next();

                                    //Add Class Active
                                    $("#steps_c li").eq($("fieldset").index(next_fs)).addClass("active");

                                    //show the next fieldset
                                    next_fs.show();
                                    //hide the current fieldset with style
                                    current_fs.animate({
                                        opacity: 0
                                    }, {
                                        step: function(now) {
                                            // for making fielset appear animation
                                            opacity = 1 - now;

                                            current_fs.css({
                                                'display': 'none',
                                                'position': 'relative'
                                            });
                                            next_fs.css({
                                                'opacity': opacity
                                            });
                                        },
                                        duration: 600
                                    });

                                    var elmnt = document.getElementById("steps_c");
                                    elmnt.scrollIntoView();
                                } 
                            }
                        }
                    }
                });
            }
            else{
                notDetalles = true;
                $(" #Calle,#descripcion_reporte,#telefono ").each(function() {
                    if ($(this).val() === "" && $(this).attr('name') != "no_ext") {
                        $(this).addClass('campo_faltante');
                        notDetalles = false;
                    } else {
                        $(this).removeClass('campo_faltante');


                    }
                });
                if (notDetalles==false) {
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: "Hay campos vacios que deben ser llenados."
                    });
                }
                if($('#telefono').val().length!=10){
                    pasar=false;
                    notDetalles = false;
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: "El campo teléfono debe ser a 10 dígitos."
                    });
                }
                
            }
            

        }
        else{
            notDetalles=true;
        }

        if ($(this).closest('fieldset').hasClass('sub')) {
            $('<input type="button"  class="next pasofinal action-button" value="Siguiente" />').insertAfter($('.detallesReporteGenerales').closest('fieldset').find('.previous').last());
        }

        if (notDetalles) {
            current_fs = $(this).closest('fieldset');
            next_fs = $(this).closest('fieldset').next();

            //Add Class Active
            $("#steps_c li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({
                opacity: 0
            }, {
                step: function(now) {
                    // for making fielset appear animation
                    opacity = 1 - now;

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({
                        'opacity': opacity
                    });
                },
                duration: 600
            });

            var elmnt = document.getElementById("steps_c");
            elmnt.scrollIntoView();
        }       

        

        

    });

    $(document).on('click', '.previous', function() {

        current_fs = $(this).closest('fieldset');
        if(desdeBuscador){
            previous_fs = $(this).closest('fieldset').prev().prev(); // Regresa dos pasos si vino desde el buscador
            $('#subcategoria').removeClass('active');
        }
        else{
            previous_fs = $(this).closest('fieldset').prev();
        }
        
        $('input.next').remove();

        $("#steps_c li").eq($("fieldset").index(current_fs)).removeClass("active");

        previous_fs.show();
        current_fs.animate({
            opacity: 0
        }, {
            step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({
                    'opacity': opacity
                });
            },
            duration: 600
        });

        if ($(this).closest('fieldset').hasClass('final')) {
            $('<input type="button"  class="next pasofinal action-button" value="Siguiente" />').insertAfter($('.detallesReporteGenerales').closest('fieldset').find('.previous').last());
        }
    });

    $('.radio-group .radio').click(function() {
        $(this).parent().find('.radio').removeClass('selected');
        $(this).addClass('selected');
    });

    $(".submit").click(function() {
        return false;
    })
}

function llenaCategoriasSubcategorias() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": serv + "catax/categorias_subcategorias/",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }

    $.ajax(settings).done(function(response) {
        //Si la peticion es exitosa procede a parsearla a json y a ejecutar los metodos siguientes, no cabiar el orden de ejecucion!!
        dataInicial = JSON.parse(response);

        if (dataInicial.status) {
            for (var x = 0; x < dataInicial.categorias.length; x++) {


                    

                    var titulo = "<p class='tituloCard'>" + dataInicial.categorias[x]['categoria'] + "</p><p class='descCard'>" + dataInicial.categorias[x]['desc'].replace(/(?:\r\n|\r|\n)/g, '<br>') + "</p>";
                    
                    var figura = "<img style='width:50px;' src=data:image/png;base64," + dataInicial.categorias[x]['icono'].split("'")[1] + " />"

                    var datas = 'data-clave="'+ dataInicial.categorias[x]['clave'] + '" id="' + dataInicial.categorias[x]['categoria'].replace(/ /g, '_') + '" ';
                    
                        var div = '<div class="box red selectCategoria" '+datas+'"><h2><p class="tituloCard22">' + dataInicial.categorias[x]['categoria'] + '</p></h2>'+
                                    '<p class="descCard22">'+dataInicial.categorias[x]['desc'].replace(/(?:\r\n|\r|\n)/g, '<br>')+'</p>'+
                                figura+'</div>'
                    

                    $('.categorias .catt').append(div)
                    

                    var extra = "";

                    $('.imgCirculo').css('height', $('.tarjetita').height()).css('width', $('.tarjetita').height())
                
                
            }



            buscadorPrincipal();
            $('#cmas').click()
        }
    });

    $(document).on('click', '.quejas', function() {
        window.open("https://xalapa.gob.mx/contraloria/modulo-de-quejas-y-denuncias/", '_blank');
    });





    $(document).on('click', '.selectCategoria', function() {
        $('.subcategoria .main-container-cards').html('')
        var y = 0;
        categoria = $(this).data('clave')
        categoriaTXT = $(this).find('.tituloCard').text();
        sipinna=false;
        clases_extra="";
        html_extra="";
        for (var x = 0; x < dataInicial.subcategorias.length; x++) {
            if ($(this).attr('id').replace(/ /g, '_') == dataInicial.subcategorias[x]['categorias'].replace(/ /g, '_')) {



                var titulo = "<p class='tituloCard22 "+clases_extra+"'>" + dataInicial.subcategorias[x]['subcategoria'] + "</p>" + html_extra;
                var datas = 'data-clave="'+ dataInicial.subcategorias[x]['clave'] + '" ';  

                //var div = '<div class="col-xs-12 col-md-4"><div class="box blue selectSubcategoria animate glow delay-1" '+datas+'"><h2><p class="tituloCard22">' + titulo + '</p></h2><p>'+dataInicial.subcategorias[x]['desc']+'</p></div></div>'
                var div = '<div class="col-xs-12 col-md-4">'+
                '<div class="box blue selectSubcategoria animate glow delay-1" '+datas+'">'+
                '<h2><p class="tituloCard22">' + titulo + '</p></h2><p>'+dataInicial.subcategorias[x]['desc']+'</p></div></div>'


                var div = '<figure class="shape-box shape-box_half selectSubcategoria" '+datas+'>'+
                '<img src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" alt="">'+
                '<div class="brk-abs-overlay z-index-0 bg-black opacity-60"></div>'+
                '<figcaption> <div class="show-cont"><h4 class="card-main-title">'+titulo+'</h4>'+
                '</div><p class="card-content">'+dataInicial.subcategorias[x]['desc']+'</p></figcaption><span class="after"></span></figure>'


                $('.subcategoria .box-wrapper ').append(div)
                


            }
        }
        
        imgPaso2 = $(this).find('.imgCirculo img').attr('src');
        $('#catPasoDos').attr('src', imgPaso2)
        $('.catPasoTres').attr('src', imgPaso2)
        $('.selectCategoria').removeClass('activo')
        $(this).addClass('activo')
        $('input.next').remove();
        $(this).closest('.form-card').append('<input type="button"  class="next action-button irSubcategoria" value="Siguiente" />');

        $('.irSubcategoria').click();

    });

    $(document).on('click', '.tel_eme', function() {
        $('#myModal').modal('show');
    });

    $(document).on('click', '.selectSubcategoria', function() {

        

        $('.detallesReporteGenerales').show();

        $('.selectSubcategoria').removeClass('activo')
        $(this).addClass('activo')
        subcategoria = $(this).data('clave')
        subcategoriaTXT = $(this).find('.tituloCard').text();
        $('input.next').remove();
        $('<input type="button"  class="next detallesPaso action-button" value="Siguiente" />').insertAfter($(this).closest('fieldset').find('.previous').last());

        $('.detallesPaso').click();


        
    });

    $('#checkbox_id').click(function() {
        if ($('.enviarReporteBox').css('visibility') == 'hidden')
            $('.enviarReporteBox').css('visibility', 'visible');
        else
            $('.enviarReporteBox').css('visibility', 'hidden');
    });

    $(document).on('click', '.pasofinal', function(e) {

        $('.datos').html(
            '<p>Los siguientes datos serán enviados. Si está de acuerdo, pulse el botón "Enviar reporte"</p>' +
            '<p><b>Categoría : </b> ' + categoriaTXT + '</p>' +
            '<p><b>Subcategoría : </b> ' + subcategoriaTXT + '</p>' +
            '<p><b>Teléfono : </b> ' + document.getElementById('telefono').value + '</p>' +
            '<p><b>Correo eléctronico : </b> ' + document.getElementById('email').value + '</p>' +
            '<p><b>Dirección :</b>' + $('#Calle').val() + ", " + $('#no_ext').val() + ", " + $('#colonia').text() +  '</p>' +
            '<p><b>Referencias :</b>' + document.getElementById('Referencias').value + '</p>' +
            '<p><b>Descripción del reporte : </b> ' + document.getElementById('descripcion_reporte').value.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</p>'
        );

    });

    respondToVisibility = function(element, callback) {
        var options = {
            root: document.documentElement
        }

        var observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                callback(entry.intersectionRatio > 0);
            });
        }, options);

        observer.observe(element);
    }
    if (document.getElementById("detallesReporteGenerales") != null) {
        respondToVisibility(document.getElementById("detallesReporteGenerales"), visible => {
            if (visible && mapaIniciado == false) {
                iniciaMapa();
                generatemMapConsulta(localStorage.getItem('latitud'), localStorage.getItem('longitud'), mapR);
                mapaIniciado = true;
            }
        });
    }
}

function buscador() {
    $(document).on('click', '#buscarFolio', function() {
        var saveUrl = "catax/buscar/";

        f = new FormData();

        f.append("folio", $('#folio').val());

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": serv + saveUrl,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": f
        }

        if ($('#folio').val() != "") {

            $.ajax(settings).done(function(response) {
                responseSend = JSON.parse(response);
                if (responseSend.folio == false) {
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: "Folio no encontrado" + "</br>"
                    });
                } else if (responseSend.correo == false) {
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: "Correo electrónico incorrecto, no asociado al folio" + "</br>"
                    });
                } else if (responseSend.data.length == 0) {
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: "Folio no encontrado" + "</br>"
                    });
                } else {
                    if (responseSend.data.descripcion_reporte != false) {
                        var desc = responseSend.data.descripcion_reporte
                    } else {
                        var desc = "";
                    }
                    if (responseSend.data.comentario_seguimiento != false) {
                        var comt = responseSend.data.comentario_seguimiento
                    } else {
                        var comt = "";
                    }

                    var estatus = ""

                    if (responseSend.data.estatus == "R") {
                        estatus = "Recibido"
                    } else if (responseSend.data.estatus == "enproceso") {
                        estatus = "En proceso"
                    } else if (responseSend.data.estatus == "ATEN") {
                        estatus = "Atendido"
                    }

                    $('.resultadosBusquedaTxt').html(
                        '<p><b>Estatus :</b><span> ' + estatus + '</span></p>' +
                        '<p><b>Categoria :</b><span> ' + responseSend.data.categoria + '</span></p>' +
                        '<p><b>Subcategoria :</b><span> ' + responseSend.data.subcategoria + '</span></p>' +
                        '<p><b>Descripción del reporte :</b><span> ' + desc.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</span></p>' +
                        '<p><b>Comentarios de seguimiento: </b> <span>' + comt.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</span></p>'
                    );

                    $('.resultadosBusqueda').html(
                        '<div class="col-xs-12 col-md-12" style="margin-top: 1%;"><div id="map" class="map" style="height: 400px; width: 100%;"></div></div>'
                    );

                    if (responseSend.data.evidencias.length>0) {
                        $('.evidencia_documental1').remove();
                        $('.evidencia_documental2').remove();
                        
                        $('.fondoGeneral').append(
                            '<div class="col-xs-12 col-md-12 evidencia_documental1" style="margin-top: 5%;text-align:center;" ><p class="tituloOtrasPag" style="font-size: 1em !important;margin-bottom: 2% !important;">Evidencia</p></div><div class="col-xs-12 col-md-12 evidencia_documental2" style="margin-top: 5%;text-align:center;"></div>'
                        );

                        $('body').append(
                            '<div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog modal-xl" >'
                            +'<div class="modal-content"><div class="modal-body"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Cerrar</span></button>'
                            +'<img src="" class="imagepreview" style="width: 100%;" ></div></div></div></div>'
                        );


                        for(var x=0;x<responseSend.data.evidencias.length;x++){
                            var file = responseSend.data.evidencias[x]['evidencia'].split("'")[1] 
                            var ext = responseSend.data.evidencias[x]['filename'].split(/[.]+/).pop().toLowerCase()

                            if(tiposArchivosPermitidos.includes(ext) ){

                                $('.fondoGeneral .evidencia_documental1').append(
                                    '<div class="col-md-3"><p class="pop"> <img style="width:80%;cursor:pointer;" src=data:image/png;base64,' + file + ' /></p></div>'
                                );    
                            }
                            else{
                                var descarga = document.createElement("a");
                                var archivo = "data:application/"+ext+";base64,"+file;
                                document.body.appendChild(descarga);
                                descarga.href = archivo;
                                descarga.className="descargable"
                                descarga.innerText="Descargar - " + responseSend.data.evidencias[x]['nombre_archivo']
                                descarga.download = responseSend.data.evidencias[x]['nombre_archivo'] + "." +ext ;
                                evidencia_doc = true

                                $('<div class="col-md-2 filediv"> </div> ').appendTo(".fondoGeneral .evidencia_documental2 ");
                                $("body > .descargable").prepend('<img style="width:80%;cursor:pointer;" src="../recursos/img/descargar.png" /><br/>').appendTo(".fondoGeneral .evidencia_documental2 .filediv:last");
                               
                            }
                                                        
                        }


                        $('.pop').on('click', function() {
                            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
                            $('#imagemodal').modal('show');   
                        });     
                    }
                    else{
                        $('.evidencia_documental1').remove();
                        $('.evidencia_documental2').remove();
                    }
                    
                    var map = new ol.Map({
                        target: 'map',
                        layers: [
                            new ol.layer.Tile({
                                title: 'OSM',
                                type: 'base',
                                visible: true,
                                source: new ol.source.OSM()
                            })
                        ],
                        view: new ol.View({
                            center: ol.proj.transform([responseSend.data['longitud'], responseSend.data['latitud']], 'EPSG:4326', 'EPSG:900913'),
                            zoom: 18,
                            minZoom: 12,
                        })
                    });

                    map.updateSize();
                    generatemMapConsulta(responseSend.data['latitud'], responseSend.data['longitud'], map);
                }
            })
        } else {
            $.dialog({
                title: 'Error',
                icon: 'fa fa-warning',
                type: 'red',
                typeAnimated: true,
                content: "Llene el campo de folio" + "</br>"
            });
        }
    });
}


function puntos(filtro){
    var countRaiz = 0;
    var countSub = 0;
    var countCluster = 0;
    var arrayRaiz = [];
    $('#generateTree').html('');

    f = new FormData();
    f.append("filtro",filtro);
    var saveUrl = "catax/get_all_data/";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": serv + saveUrl,
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": f
    }

    $.ajax(settings).done(function(response) {
        responseSend = JSON.parse(response);
        if (responseSend.status) {
            new Promise((resolver, rechazar) => {
                    responseSend['data'].forEach(
                        element => {
                            var categoriaAlpha = element.categoria.replace(/ /g, '_');
                            var categoriaAlphaIcon = element.categoria.replace(/ /g, '').toLowerCase();
                            var catIconBeta = categoriaAlphaIcon.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (document.getElementById(categoriaAlpha) == null) {
                                
                                $('#generateTree').append(
                                    '<div class="noPadding" id="' + categoriaAlpha + '" style="font-size: 15px;">' +
                                    '<ul id="myTree">' +
                                    '<li class="sidebar-dropdown">' +
                                    '<img src="./../recursos/img/' + catIconBeta + '.png" style="height: 30px;"/>' +
                                    '<input type="checkbox" id="checkAl' + countRaiz + '" style="" class="selector_sub selector_padre" name="' + element.categoria + '" value="" onclick="functionViewStatus(&quot;c1' + element.categoria + '&quot;)" />  ' +
                                    '<label for="checkAl' + countRaiz + '" style="color: black;">' + element.categoria + '</label>  ' +
                                    '<a href="#">' +
                                    '<i class="fa fa-plus" onclick="showFuntion(&quot;' + element.categoria + '&quot;)"></i>' +
                                    '</a>' +
                                    '<ul id="myTree" class="sidebar-submenu">' +
                                    '<div id="sub' + countRaiz + '"></div>' +
                                    '</ul>' +
                                    '</li>' +
                                    '</ul>' +
                                    '</div>'
                                );
                                arrayRaiz[countRaiz] = {
                                    'clase': 'sub' + countRaiz,
                                    'nombre': element.categoria
                                }
                                countRaiz = countRaiz + 1;
                            }
                            var categoriaBeta = element.subcategoria.replace(' ', '_');
                            if (document.getElementById(categoriaBeta) == null) {
                                arrayRaiz.forEach(
                                    elements => {
                                        if (elements.nombre == element.categoria) {
                                            $('#' + elements.clase).after(
                                                '<li id="' + categoriaBeta + '">' +
                                                "<input type='checkbox' id='checkBe" + countSub + "' class='selector_sub' name='" + element.categoria + element.subcategoria_clave + "' value='' onclick='functionViewStatus(&quot;c1" + element.subcategoria_clave + "&quot;)' >  " +
                                                '<label for="checkBe' + countSub + '" style="color: black;">' + element.subcategoria + '</label>' +
                                                '</li>'
                                            );
                                        }
                                    }
                                );
                                countSub = countSub + 1;
                            }
                            var colorStokes;
                            var colorFills;

                            if (element.categoria == 'Alumbrado') {
                                colorFills = '#000000';
                                colorStokes = '#ffff00';
                            } else if (element.categoria == 'Mantenimiento vial') {
                                colorFills = '#ffffff';
                                colorStokes = '#000000';
                            } else if (element.categoria == 'Limpia pública') {
                                colorFills = '#ffffff';
                                colorStokes = '#d14a4a';
                            } else if (element.categoria == 'Arbolado urbano') {
                                colorFills = '#ffffff';
                                colorStokes = '#ff0000';
                            } else if (element.categoria == 'Reforestación') {
                                colorFills = '#ffffff';
                                colorStokes = '#006400';
                            } else if (element.categoria == 'Propuesta ciudadana') {
                                colorFills = '#ffffff';
                                colorStokes = '#cc3399';
                            } else if (element.categoria == 'Agua') {
                                colorFills = '#ffffff';
                                colorStokes = '#0000ff';
                            } else if (element.categoria == 'Parques y jardines') {
                                colorFills = '#000000';
                                colorStokes = '#00ff00';
                            } else {
                                colorFills = '#ffffff';
                                colorStokes = '#b0c4de';
                            }

                            featuresCount[countCluster] = new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.transform([element.longitud, element.latitud], 'EPSG:4326', 'EPSG:900913')),
                                categoria: element.categoria,
                                estatus: element.estatus,
                                subcategoria: element.subcategoria,
                                descripcion_reporte: element.descripcion_reporte,
                                comentario_seguimiento: element.comentario_seguimiento,
                                colorStokes: colorStokes,
                                colorFills: colorFills,
                                colorIcons: catIconBeta,
                                title: element.subcategoria,
                                clave: element.categoria + element.subcategoria_clave,
                                visible: false
                            });

                            countCluster = countCluster + 1;
                        }
                    );
                    
                    resolver();
                })
                .then(() => {
                    var sourceClus = new ol.source.Vector({
                        features: featuresCount
                    });

                    var clusterSource = new ol.source.Cluster({
                        distance: 20,
                        source: sourceClus
                    });

                    var styleCache = {};
                    var clusters = new ol.layer.Vector({
                        name: 'pointshadow',
                        visible: true,
                        source: clusterSource,
                        style: function(feature, resolution) {
                            if(feature.getProperties().features.length>0){
                                if(feature.getProperties().features[0].values_.estatus=="R"){

                                    var size = feature.get('features').length;
                                    var style = styleCache[size];
                                    if (size != 1) {
                                        if (!style) {
                                            console.log('A')
                                            style = [new ol.style.Style({
                                                image: new ol.style.Circle({
                                                    radius: 10,
                                                    stroke: new ol.style.Stroke({
                                                        color: '#fff'
                                                    }),
                                                    fill: new ol.style.Fill({
                                                        color: '#3399CC'
                                                    })
                                                }),
                                                text: new ol.style.Text({
                                                    text: size.toString(),
                                                    fill: new ol.style.Fill({
                                                        color: '#fff'
                                                    })
                                                })
                                            })];
                                            styleCache[size] = style;
                                        }
                                        return style;
                                    } else {
                                        style = [new ol.style.Style({
                                            image: new ol.style.Icon({
                                                anchor: [0.5, 1],
                                                scale: 0.2,
                                                src: './../recursos/img/' + feature.getProperties().features[0].values_.colorIcons + '.png'
                                            })
                                        })];
                                        return style;
                                    }
                                }
                            }
                        }
                    });

                    mapT.addLayer(clusters);
                    $('#recibidos').trigger('click');
                })
        } else {
            $.dialog({
                title: 'Error',
                icon: 'fa fa-warning',
                type: 'red',
                typeAnimated: true,
                content: "Folio no encontrado" + "</br>"
            });
        }
    });
}

function mapaGeneral() {
    var view = new ol.View({
        center: ol.proj.transform([-96.9602712, 19.4545963], 'EPSG:4326', 'EPSG:900913'),
        zoom: 14,
    });
    
    mapT = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new ol.source.OSM()
            })
        ],
        view: view
    });

    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: true
    });
    mapT.addOverlay(popup);

    mapT.on('singleclick', function(evt) {
        element.innerHTML = '';
        var feature = mapT.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return feature;
        });

        if (feature) {
            var coord = feature.getGeometry().getCoordinates();
            var props = feature.getProperties();
            var descr;
            var comen;

            if (feature.values_.features[0].values_.descripcion_reporte == false) {
                descr = '';
            } else {
                descr = feature.values_.features[0].values_.descripcion_reporte;
            }

            if (feature.values_.features[0].values_.comentario_seguimiento == false) {
                comen = '';
            } else {
                comen = feature.values_.features[0].values_.comentario_seguimiento;
            }

            var info = '<div class="gm-style-iw gm-style-iw-c" style="width: max-content; padding-right: 0px; padding-bottom: 0px; max-width: 648px; max-height: 269px; min-width: 0px; position: absolute; box-sizing: border-box; overflow: hidden; top: 0; left: 0; transform: translate(-50%,-100%); background-color: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 7px 1px rgb(0 0 0 / 30%); font-weight: 300; font-size: 13px;">' +
                '<div class="gm-style-iw-d" style="overflow: hidden; max-height: 251px; box-sizing: border-box;">' +
                '<div style="box-sizing: border-box;">' +
                '<div class="container_info">' +
                '<span  id="popup-closer" class="ol-popup-closer"></span>' +
                '<p style="margin: 0 0 10px;"><b style="font-weight: bold;">Categoría:</b><br> ' + feature.values_.features[0].values_.categoria + '</p>' +
                '<p style="margin: 0 0 10px;"><b style="font-weight: bold;">Subcategoría:</b><br> ' + feature.values_.features[0].values_.subcategoria + '</p>' +
                '<p style="margin: 0 0 10px;"><b style="font-weight: bold;">Descripción:</b><br> ' + descr + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            popup.setPosition(evt.coordinate);
            element.innerHTML = info;

            mapT.getView().setCenter(evt.coordinate, 'EPSG:4326', 'EPSG:900913');
        }
    });

    puntos("'R','enproceso'")
    $('.containerGeneral').height($('.containerGeneral').height() + 200);

    
}

function showFuntion(val) {
    $('[name*="'+val+'"].selector_padre').closest('li').find('ul').toggle();

    var icono = $('[name*="'+val+'"].selector_padre').siblings('a').find('i')

    if (icono.hasClass('fa-plus')) {
        icono.removeClass('fa-plus').addClass('fa-minus')
        var valorLargo = $('#generateTree').height();
        $('.containerGeneral').height($('.containerGeneral').height() + valorLargo);
    }
    else{
        icono.removeClass('fa-minus').addClass('fa-plus')
        var valorLargo = $('#generateTree').height();
        $('.containerGeneral').height($('.containerGeneral').height() - valorLargo);
    }
    

    
}

function functionViewStatus(value) {
    console.log('llamado con valor' + value);
    var arraytratado = [];
    var clavetratado = [];
    var haySeleccionados=false;


    //$('[name*="'+value.substr(2)+'"]').attr( "checked", true );

    if (value.substr(0, 2) == 'c1') {
        var checks=true;
        document.querySelectorAll('input[type=checkbox]').forEach(
            element => {
                if($('[name*="'+value.substr(2)+'"].selector_padre').length>0){
                    if($('[name*="'+value.substring(2)+'"].selector_padre')[0].checked){
                        checks=true
                    }
                    else{
                        checks=false
                    }

                    if (element.name.includes(value.substr(2)) && !element.className.includes('selector_padre')) {
                        element.checked = checks;
                        
                    }
                    if (element.checked == true) {
                        clavetratado.push(element.name);
                        if (element.name!="recibidos" && element.name!="proceso" && element.name!="finalizado" ) {
                            haySeleccionados = true;
                        }
                    }
                    
                }
                else{
                    if (element.checked == true) {
                        clavetratado.push(element.name);
                        if (element.name!="recibidos" && element.name!="proceso" && element.name!="finalizado" ) {
                            haySeleccionados = true;
                        }
                    }
                    
                }
            }
        );
    
    }

    else if(value=="estatus"){
        document.querySelectorAll('input[type=checkbox].selector_sub').forEach(
            element => {
                
                if (element.checked == true) {
                    haySeleccionados = true;
                    clavetratado.push(element.name);
                }
            }
        );
    }

    selectoresEstatus = [];
    $('input:checkbox.selectorEstatus').each(function () {
       if (this.checked) {
        selectoresEstatus.push($(this).val())
       }
    });

    if (!haySeleccionados && selectoresEstatus.length!=0) {
        document.querySelectorAll('input[type=checkbox]').forEach(
            element => {
                clavetratado.push(element.name);
            }
        );
    }
        

    featuresCount.forEach(
        element => {
            clavetratado.forEach(
                cargacat => {
                    if (cargacat == element.values_.clave) {
                        arraytratado.push(element);
                    }
                }
            );
        }
    );


    mapT.getLayers().array_.forEach(
        element => {
            if (element.values_.name == 'pointshadow') {
                mapT.removeLayer(element);
            }
        }
    );


    if (selectoresEstatus.length==0) {
        arraytratado=[]
    }

    


    var sourceClus = new ol.source.Vector({
        features: arraytratado
    });

    var clusterSource = new ol.source.Cluster({
        distance: 20,
        source: sourceClus
    });


    var styleCache = {};
    var clusters = new ol.layer.Vector({
        name: 'pointshadow',
        visible: true,
        source: clusterSource,
        style: function(feature, resolution) {
            if (feature.get('features').length>1) {
                for( var i = 0; i < feature.get('features').length; i++){ 
                   if (!selectoresEstatus.includes(feature.get('features')[i].values_.estatus) ) {
                     feature.get('features').splice(i, 1); 
                   }
                }
            }

            var size = feature.get('features').length;
            var style = styleCache[size];
            if (size != 1) { //marcadores en cluster
                if (!style) {
                    style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            stroke: new ol.style.Stroke({
                                color: '#fff'
                            }),
                            fill: new ol.style.Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: '#fff'
                            })
                        })
                    })];
                    styleCache[size] = style;
                }
                return style;
            } else { // marcador solo
                

                if(selectoresEstatus.includes(feature.getProperties().features[0].values_.estatus)){
                    style = [new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1],
                            scale: 0.2,
                            src: './../recursos/img/' + feature.getProperties().features[0].values_.colorIcons + '.png'
                        })
                    })];
                    
                }
                return style;
            }
        }
    });

    mapT.addLayer(clusters);

}

$(document).on('click', '.selectorEstatus', function(e) {
    functionViewStatus('estatus')
   

});



function iniciaMapa() {

    f = new FormData();

    f.append("lng", localStorage.getItem('longitud'));
    f.append("lat", localStorage.getItem('latitud'));
    f.append("categoria", categoria);


    var url = serv + "catax/get_closest_reports/"

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": f
    }

    $.ajax(settings).done(function(response) {
            response = JSON.parse(response);

            var icono = categoriaTXT.replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    scale: 0.2,
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '../recursos/img/' + icono + '.png',
                }),
            });

            for (var x = 0; x < response.length; x++) {
                var layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([response[x]['longitud'], response[x]['latitud']])),
                                desc: response[x]['desc'],
                                subcategoria: response[x]['subcategoria'],
                                folio: response[x]['folio']
                            })
                        ],

                    }),
                    customAttr: 'punto_cercano',
                    style: iconStyle
                });

                mapR.addLayer(layer);
                layer.setZIndex(999);
            }

        })
        .fail(function(response) {
            $.dialog({
                title: 'Error',
                icon: 'fa fa-warning',
                type: 'red',
                typeAnimated: true,
                content: 'Error'
            });

        });

    var view = new ol.View({
        center: ol.proj.transform([localStorage.getItem('longitud'), localStorage.getItem('latitud')], 'EPSG:4326', 'EPSG:900913'),
        zoom: 17,
        minZoom: 12,
        //extent: [-10794744.84438, 2212072.63612, -10775612.40370, 2225646.98972],
    });
    

    mapR = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new ol.source.OSM()
            })
        ],
        view: view
    })
    $('#detallesReporteGenerales').append('<div class="popup" id="popup"></div>')
    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: true
    });
    mapR.addOverlay(popup);

    mapR.on('singleclick', function(evt) {
        var feature = mapR.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return feature;
        });

        var coordinate = ol.proj.toLonLat(evt.coordinate);
        var prettyCoord = ol.proj.transform(evt.coordinate, 'EPSG:900913', 'EPSG:4326')

        var urlCal = 'https://nominatim.openstreetmap.org/search.php?q=' + prettyCoord[1] + '%2C%20' + prettyCoord[0] + '&addressdetails=1&format=jsonv2';
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", urlCal, false);
        xmlHttp.send(null);

        var createCharge = JSON.parse(xmlHttp.responseText);


        if (feature) {
            if (feature.get('desc') != undefined) {
                var geometry = feature.getGeometry().getCoordinates();

                var content = '<div class="gm-style-iw gm-style-iw-c" style="width: 300px; padding-right: 0px; padding-bottom: 0px; min-width: 0px; position: absolute; box-sizing: border-box; overflow: hidden; top: 0; left: 0; transform: translate(-50%,-100%); background-color: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 7px 1px rgb(0 0 0 / 30%); font-weight: 300; font-size: 13px;z-index:99999;">' +
                    '<div class="gm-style-iw-d" style="overflow: hidden; max-height: 251px; box-sizing: border-box;">' +
                    '<div style="box-sizing: border-box;">' +
                    '<div class="container_info" data-folio=' + feature.get('folio') + '>' +
                    '<span  id="popup-closer" class="ol-popup-closer"></span>' +
                    '<p style="margin: 0 0 10px;font-size: 1.2em;"><b style="font-weight: bold;">' + categoriaTXT + '</b> </p>' +
                    '<p style="margin: 0 0 10px;"><b style="font-weight: bold;">Subcategoria:</b><br> ' + feature.get('subcategoria') + '</p>' +
                    '<p style="margin: 0 0 10px;"><b style="font-weight: bold;">Descripción:</b><br> ' + feature.get('desc') + '</p>' +
                    '<p><span class="btnOk apoyar_reporte">Apoyar reporte</span></p>'
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

                popup.setPosition(evt.coordinate);
                document.getElementById('popup').innerHTML = content;

                mapR.getView().setCenter(evt.coordinate, 'EPSG:4326', 'EPSG:900913');

            } else {
                document.getElementById('popup').innerHTML = '';
                localStorage.setItem('colonia', feature.values_['NOMBRE']);
                localStorage.setItem('cp', feature.values_['CP']);

                $('#colonia').text(localStorage.getItem('colonia'));
                $('#cp').text(localStorage.getItem('cp'))
                //$('#cp').text(createCharge[0]['address']['postcode']);
                document.getElementById('Calle').value = createCharge[0]['address']['road'];
                direccion = createCharge[0]['display_name'];

                document.getElementById('getLat').value = prettyCoord[1];
                document.getElementById('getLon').value = prettyCoord[0];

                localStorage.setItem('latitud', prettyCoord[1]);
                localStorage.setItem('longitud', prettyCoord[0]);

                f = new FormData();

                f.append("lng", prettyCoord[0]);
                f.append("lat", prettyCoord[1]);
                f.append("categoria", categoria);

                var url = serv + "catax/get_closest_reports/"

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": url,
                    "method": "POST",
                    "processData": false,
                    "contentType": false,
                    "mimeType": "multipart/form-data",
                    "data": f
                }

                mapR.getLayers().forEach(layer => {
                    try {
                        if (layer.get('name') && layer.get('name') == 'MapLayer') {
                            mapR.removeLayer(layer)
                        }
                    } catch (ex) {}
                });

                $.ajax(settings).done(function(response) {
                        response = JSON.parse(response);

                        var layersToRemove = [];
                        mapR.getLayers().forEach(function(layer) {
                            if (layer.get('customAttr') != undefined && layer.get('customAttr') === 'punto_cercano') {
                                layersToRemove.push(layer);
                            }
                        });

                        var len = layersToRemove.length;
                        for (var i = 0; i < len; i++) {
                            mapR.removeLayer(layersToRemove[i]);
                        }

                        var icono = categoriaTXT.replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        var pStyle = new ol.style.Style({
                            image: new ol.style.Icon(({
                                anchor: [0.5, 1],
                                scale: 0.2,
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: '../recursos/img/' + icono + '.png',
                            }))
                        })


                        for (var x = 0; x < response.length; x++) {
                            var layer = new ol.layer.Vector({
                                source: new ol.source.Vector({
                                    features: [
                                        new ol.Feature({
                                            geometry: new ol.geom.Point(ol.proj.fromLonLat([response[x]['longitud'], response[x]['latitud']])),
                                            desc: response[x]['desc'],
                                            subcategoria: response[x]['subcategoria'],
                                            folio: response[x]['folio']
                                        })
                                    ]

                                }),
                                customAttr: 'punto_cercano',
                                style: pStyle
                            });
                            mapR.addLayer(layer);
                            layer.setZIndex(999);
                        }
                    })
                    .fail(function(response) {
                        $.dialog({
                            title: 'Error',
                            icon: 'fa fa-warning',
                            type: 'red',
                            typeAnimated: true,
                            content: 'Error'
                        });
                    });

                var MarkerIcon = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([prettyCoord[0], prettyCoord[1]])),
                    name: 'MapLayer',
                    desc: '<label>Details</label>'
                })
                MarkerIcon.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 50],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: './../recursos/img/marcador-de-p.png'
                    })
                }));

                var MapSource = new ol.source.Vector({
                    features: [
                        MarkerIcon
                    ]
                })

                var MapLayer = new ol.layer.Vector({
                    source: MapSource
                });

                MapLayer.setZIndex(0);
                MapLayer.set('name', 'MapLayer');
                //MapLayer.setZIndex(999);
                mapR.addLayer(MapLayer);
            }
        } else {
            document.getElementById('popup').innerHTML = '';
            console.log(createCharge[0]);

            document.getElementById('colonia').value = createCharge[0]['address']['neighbourhood'];
            document.getElementById('Calle').value = createCharge[0]['address']['road'];
            direccion = createCharge[0]['display_name'];

            document.getElementById('getLat').value = prettyCoord[1];
            document.getElementById('getLon').value = prettyCoord[0];

            localStorage.setItem('latitud', prettyCoord[1]);
            localStorage.setItem('longitud', prettyCoord[0]);

            f = new FormData();

            f.append("lng", prettyCoord[0]);
            f.append("lat", prettyCoord[1]);
            f.append("categoria", categoria);

            var url = serv + "catax/get_closest_reports/"

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "POST",
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": f
            }

            mapR.getLayers().forEach(layer => {
                try {
                    if (layer.get('name') && layer.get('name') == 'MapLayer') {
                        mapR.removeLayer(layer)
                    }
                } catch (ex) {}
            });

            $.ajax(settings).done(function(response) {
                    response = JSON.parse(response);

                    var layersToRemove = [];
                    mapR.getLayers().forEach(function(layer) {
                        if (layer.get('customAttr') != undefined && layer.get('customAttr') === 'punto_cercano') {
                            layersToRemove.push(layer);
                        }
                    });

                    var len = layersToRemove.length;
                    for (var i = 0; i < len; i++) {
                        mapR.removeLayer(layersToRemove[i]);
                    }

                    var icono = categoriaTXT.replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    var pStyle = new ol.style.Style({
                        image: new ol.style.Icon(({
                            anchor: [0.5, 1],
                            scale: 0.2,
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            src: '../recursos/img/' + icono + '.png',
                        }))
                    })


                    for (var x = 0; x < response.length; x++) {
                        var layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: [
                                    new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([response[x]['longitud'], response[x]['latitud']])),
                                        desc: response[x]['desc'],
                                        subcategoria: response[x]['subcategoria'],
                                        folio: response[x]['folio']
                                    })
                                ]

                            }),
                            customAttr: 'punto_cercano',
                            style: pStyle
                        });
                        mapR.addLayer(layer);
                        layer.setZIndex(999);
                    }
                })
                .fail(function(response) {
                    $.dialog({
                        title: 'Error',
                        icon: 'fa fa-warning',
                        type: 'red',
                        typeAnimated: true,
                        content: 'Error'
                    });
                });

            var MarkerIcon = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([prettyCoord[0], prettyCoord[1]])),
                name: 'MapLayer',
                desc: '<label>Details</label>'
            })
            MarkerIcon.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 50],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: './../recursos/img/marcador-de-p.png'
                })
            }));

            var MapSource = new ol.source.Vector({
                features: [
                    MarkerIcon
                ]
            })

            var MapLayer = new ol.layer.Vector({
                source: MapSource
            });

            MapLayer.setZIndex(0);
            MapLayer.set('name', 'MapLayer');
            //MapLayer.setZIndex(999);
            mapR.addLayer(MapLayer);
        }
    });

    
}

$(document).on('click', '#popup-closer', function() {
    document.getElementById('popup').innerHTML = '';
});

function listenersMapa() {
    $(document).on('click', '.apoyar_reporte', function() {
        $('#modalApoyo').remove();
        $('body').append('<div id="modalApoyo" data-folio="' + $(this).closest('.container_info').data('folio') + '" class="modal fade in" role="dialog" aria-hidden="false" style="display: block;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close closeModalPopUp" >×</button><h4 class="modal-title">Comentarios de apoyo</h4></div><div class="modal-body"><textarea type="text" name="comentarios" id="comentarios" class="class0 text-area-full" style="width:100%;" placeholder="Comentarios"></textarea></div><div class="modal-footer"><button type="button" class="btnOk enviarApoyo">Enviar</button></div></div></div></div>')
        $('#modalApoyo').modal('show');
    });

    

    $(document).on('click', '.closeModalPopUp', function() {
        $('#modalApoyo').remove();
        $('.modal-backdrop').remove();
    });

    $(document).on('click', '.enviarApoyo', function() {
        f = new FormData();

        f.append("comentarios", $('#comentarios').val());
        f.append("folio", $(this).closest('#modalApoyo').data('folio'));

        var url = serv + "catax/guardar_comentario_apoyo/"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": f
        }

        $.ajax(settings).done(function(response) {
                response = JSON.parse(response);
                console.log(response);
                if (response.status) {
                    $.confirm({
                        title: '¡Éxito!',
                        type: 'green',
                        icon: 'fa fa-check-circle',
                        typeAnimated: true,
                        columnClass: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1',
                        content: 'Su apoyo a este reporte ha sido agregado correctamente, con el número de folio <b style="color:#a53420">'+ response.folio +'</b>. Puede ver su seguimiento en la pestaña "Consulta de reportes", utilizando dicho folio.',
                        buttons: {
                            Aceptar: {
                                text: 'Aceptar',
                                action: function() {
                                    location.reload();
                                }
                            }
                        }
                    });
                }
            })
            .fail(function(response) {
                $.dialog({
                    title: 'Error',
                    icon: 'fa fa-warning',
                    type: 'red',
                    typeAnimated: true,
                    content: 'Error'
                });

            });
    });
}

function sortSelect(select) {
    var select = $('#' + select);
    select.html(select.find('option').sort(function(x, y) {
        // de a -- z
        return $(x).text() > $(y).text() ? 1 : -1;
    }));
}

function materialDesign() {
    $('.contact-form').find('.form-control').each(function() {
        var targetItem = $(this).parent();
        if ($(this).val()) {
            $(targetItem).find('label').css({
                'top': '10px',
                'fontSize': '14px'
            });
        }
    })
    $('.contact-form').find('.form-control').focus(function() {
        $(this).parent('.input-block').addClass('focus');
        $(this).parent().find('label').animate({
            'top': '10px',
            'fontSize': '14px'
        }, 300);
    })
    $('.contact-form').find('.form-control').blur(function() {
        if ($(this).val().length == 0) {
            $(this).parent('.input-block').removeClass('focus');
            $(this).parent().find('label').animate({
                'top': '25px',
                'fontSize': '16px'
            }, 300);
        }
    })
}

function enviaFoto(myFile, e) {
    var reader = new FileReader();

    var validaImg = myFile.value;
    var extensionPermitida = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!extensionPermitida.exec(validaImg)) {
        alert('Por favor seleccione un archivo de imagen.');
        myFile.value = '';
    } else {
        if (myFile.files.length > 0) {
            var file = myFile.files[0];
            if (myFile.files[0].size > 2000000) {
                var calidad = 1;
                if (myFile.files[0].size > 9000000) {
                    calidad = 0.5;
                }
                if (myFile.files[0].size > 5000000) {
                    calidad = 0.8;
                }
                var ctx = document.getElementById('canvas').getContext('2d');
                var img = new Image;
                img.src = URL.createObjectURL(e.target.files[0]);


                img.onload = function() {

                    var widthOriginal = this.width;
                    var heightOriginal = this.height;
                    var wf = 0;
                    var hf = 0;
                    var ratio = 0;
                    ratio = widthOriginal / heightOriginal;

                    if (ratio < 1) {
                        hf = 1200;
                        wf = (hf * ratio)

                    } else if (ratio > 1) {
                        wf = 1200;
                        hf = (wf / ratio)
                    }

                    document.getElementById('canvas').width = wf;
                    document.getElementById('canvas').height = hf;
                    ctx.height = ctx.width * (img.height / img.width);
                    var oc = document.createElement('canvas');
                    var octx = oc.getContext('2d');
                    oc.width = img.width * 0.5;
                    oc.height = img.height * 0.5;
                    octx.drawImage(img, 0, 0, oc.width, oc.height);
                    octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
                    ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
                        0, 0, canvas.width, canvas.height);
                    imagen_reducida = canvas.toDataURL('image/jpeg', calidad);
                    $('.txtFotoCargada').remove();
                    $('<p class="txtFotoCargada">La fotografía se cargó correctamente, para sustituirla por otra, haga clic en el botón de arriba</p>').insertAfter($('#label_imagen'));
                    $('#label_imagen span').text('Cambiar fotografía');
                }

            } else {
                reader.onload = function(e) {
                    var img = new Image();
                    imagen_reducida = reader.result
                    $('.txtFotoCargada').remove();
                    $('<p class="txtFotoCargada">La fotografía se cargó correctamente, para sustituirla por otra, haga clic en el botón de arriba</p>').insertAfter($('#label_imagen'));
                    $('#label_imagen span').text('Cambiar fotografía');

                }
                reader.readAsDataURL(file);
            }


        } else {
            alert('Debe elegir una imagen para continuar.');
        }
    }
}

function readyToSave() {

    $('#enviarReporte').click(function() {
        var saveUrl = "catax/guardar/";
        $(".saveChanges").button('loading');
        $('.loadingSpinner').css('display', 'block');

        f = new FormData();

        f.append("categoria", categoria);
        f.append("sub_categoria", subcategoria);
        f.append("telefono", document.getElementById('telefono').value);
        f.append("correo", document.getElementById('email').value);
        f.append("descripcion_reporte", document.getElementById('descripcion_reporte').value);
        f.append("medio_reporte", 'W');
        f.append("calle", document.getElementById('Calle').value);
        f.append("no_exterior", document.getElementById('no_ext').value);
        f.append("referencia", document.getElementById('Referencias').value);
        f.append("colonia", document.getElementById('colonia').value);

        if (document.getElementById('getLon').value != '') {
            f.append("longitud", document.getElementById('getLon').value);
            f.append("latitud", document.getElementById('getLat').value);
        } else {
            f.append("longitud", localStorage.getItem('longitud'));
            f.append("latitud", localStorage.getItem('latitud'));
        }

        if ($('#imagen').get(0).files.length > 0) {
            var fullBytesSplited = imagen_reducida.split(',');
            var b64file = fullBytesSplited[1];
            var contentType = fullBytesSplited[0];
            f.append('fotografiaReporte', b64file);
        }

        if (CMAS) {
            f.append("CMAS", '1');
            if (isRATB) {
                f.append("tipo_material", $('#tipo_material').val());
            }

            f.append("numero_medidor", document.getElementById('numero_medidor').value);
            f.append("numero_registro", document.getElementById('numero_registro').value);
        }

        

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": serv + saveUrl,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": f
        }

        var urlCal = 'https://nominatim.openstreetmap.org/search.php?q=' + f.get('latitud') + '%2C%20' + f.get('longitud') + '&addressdetails=1&format=jsonv2';
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", urlCal, false);
        xmlHttp.send(null);

        var createCharge = JSON.parse(xmlHttp.responseText);
        var createReset = createCharge[0]['address'];

        

        $.ajax(settings).done(function(response) {
            responseSend = JSON.parse(response);
            if (responseSend.status) {
                $.confirm({
                    title: '¡Éxito!',
                    type: 'green',
                    icon: 'fa fa-check-circle',
                    typeAnimated: true,
                    columnClass: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1',
                    content: 'Su reporte ha sido enviado correctamente, con el número de folio <b style="color: #a53420">' + responseSend.folio + '</b>. Asimismo este folio fue enviado al correo electrónico registrado, guárdelo para su seguimiento.',
                    buttons: {
                        Aceptar: {
                            text: 'Aceptar',
                            action: function() {
                                location.reload();
                            }
                        }
                    }
                });
                $('.loadingSpinner').css('display', 'none');
            } else {
                $.dialog({
                    title: 'Error',
                    icon: 'fa fa-warning',
                    type: 'red',
                    typeAnimated: true,
                    content: "Error en el guardado" + "</br> "+ responseSend.error
                });
                $('.loadingSpinner').css('display', 'none');
                $('.saveChanges').button('reset');
            }

        }).fail(function() {
            $.dialog({
                title: 'Error',
                icon: 'fa fa-warning',
                type: 'red',
                typeAnimated: true,
                content: "Error en el guardado" + "</br> "
            });
            $('.loadingSpinner').css('display', 'none');
            $('.saveChanges').button('reset');
        });
    });
}

function generatemMapConsulta(latitud, longitud, map) {
    map.getView().setCenter(ol.proj.transform([longitud, latitud], 'EPSG:4326', 'EPSG:900913'));
    map.updateSize();
    map.getLayers().forEach(layer => {
        if (layer.get('name') && layer.get('name') == 'MapLayer') {
            map.removeLayer(layer)
        }
    });

    var MarkerIcon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([longitud, latitud], 'EPSG:4326', 'EPSG:900913')),
        name: 'MapLayer',
        desc: '<label>Details</label> <br> Latitude: ' + longitud + ' Longitude: ' + latitud
    })
    MarkerIcon.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 50],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: './../recursos/img/marcador-de-p.png'
        })
    }));

    var MapSource = new ol.source.Vector({
        features: [
            MarkerIcon
        ]
    })

    var MapLayer = new ol.layer.Vector({
        source: MapSource
    });

    MapLayer.set('name', 'MapLayer');
    MapLayer.setZIndex(0);
    map.addLayer(MapLayer);
}

function getLocalizationReal() {
    if (navigator.geolocation) {
        var geoSuccess = function(position) {
            localStorage.setItem('latitud', position.coords.latitude);
            localStorage.setItem('longitud', position.coords.longitude);

            var urlCal = 'https://nominatim.openstreetmap.org/search.php?q=' + localStorage.getItem('latitud') + '%2C%20' + localStorage.getItem('longitud') + '&addressdetails=1&format=jsonv2';
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", urlCal, false);
            xmlHttp.send(null);
            var createCharge = JSON.parse(xmlHttp.responseText);

            if (createCharge[0].display_name.includes('Xalapa') == true) {
                localStorage.setItem('colonia', createCharge[0]['address']['neighbourhood']);
                $('#colonia').text(localStorage.getItem('colonia'));
                document.getElementById('Calle').value = createCharge[0]['address']['road'];
                direccion = createCharge[0]['display_name'];

                document.getElementById('getLat').value = localStorage.getItem('latitud');
                document.getElementById('getLon').value = localStorage.getItem('longitud');
            } else {
                localStorage.setItem('latitud', 19.4545963);
                localStorage.setItem('longitud', -96.9602712);

                localStorage.setItem('colonia', ' Zona Centro');
                $('#colonia').text(localStorage.getItem('colonia'));
                document.getElementById('Calle').value = 'Callejón de Rojas';
                direccion = 'Callejón de Rojas';

                document.getElementById('getLat').value = localStorage.getItem('latitud');
                document.getElementById('getLon').value = localStorage.getItem('longitud');
            }
        }

        var geoOptions = {
            timeout: 10 * 1000
        }

        var geoError = function(error) {
            localStorage.setItem('latitud', 19.4545963);
            localStorage.setItem('longitud',-96.9602712);

            localStorage.setItem('colonia', ' Zona Centro');
            $('#colonia').text(localStorage.getItem('colonia'));
            $('#cp').text('91000');
            document.getElementById('Calle').value = 'Callejón de Rojas';
            direccion = 'Callejón de Rojas';

            document.getElementById('getLat').value = localStorage.getItem('latitud');
            document.getElementById('getLon').value = localStorage.getItem('longitud');
        };

        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }
}

function resetSizeMap() {
    mapR.updateSize();
}



$("#imagen").change(function(e) {
    var myFile = document.getElementById("imagen");
    var preview = document.getElementById("preview");
    enviaFoto(myFile, e);
    if (myFile.files && myFile.files[0]) {
        reader = new FileReader();

        reader.onload = function(e) {
          preview.setAttribute('src', e.target.result);
          preview.style.display = "initial";
        }

        reader.readAsDataURL(myFile.files[0]);
      }
});

$("#Calle").change(function(e) {
    coloniaSearch = localStorage.getItem('colonia');
    calleSearch = document.getElementById('Calle').value;

    var urlCal = 'https://nominatim.openstreetmap.org/search.php?q=Xalapa%2C%20' + coloniaSearch + '%2C%20' + calleSearch + '&format=jsonv2';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", urlCal, false);
    xmlHttp.send(null);
    var createCharge = JSON.parse(xmlHttp.responseText);

    mapR.getLayers().forEach(layer => {
        if (layer.get('name') && layer.get('name') == 'MapLayer') {
            mapR.removeLayer(layer)
        }
    });

    var MarkerIcon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([createCharge[0].lon, createCharge[0].lat])),
        name: 'MapLayer',
        desc: '<label>Details</label>'
    })
    MarkerIcon.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 50],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: './../recursos/img/marcador-de-p.png'
        })
    }));

    var MapSource = new ol.source.Vector({
        features: [
            MarkerIcon
        ]
    })

    var MapLayer = new ol.layer.Vector({
        source: MapSource
    });

    MapLayer.set('name', 'MapLayer');
    MapLayer.setZIndex(0);
    mapR.addLayer(MapLayer);
});


   
function getSearchParams(k){
 var p={};
 location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
 return k?p[k]:p;
}

function buscadorPrincipal(){
    $( "#buscador" ).keyup(function( event ) {
        $('.resultados_busqueda .main-container-cards').html('')
        var texto = $(this).val().replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (texto!="") {
            $('.izqSec').hide();
            $('.derSec').hide();
            $('.seleccioneReporteTxt').hide();
            $('.msgInicial').hide();
        
            for(var x=0;x<dataInicial.subcategorias.length;x++){
                var encontrado = false;
                if(!encontrado && dataInicial.subcategorias[x]['desc']!=false){
                    var cadena = dataInicial.subcategorias[x]['desc'].replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");  
                    encontrado = cadena.includes(texto);
                }
                if(!encontrado){
                    var cadena = dataInicial.subcategorias[x]['subcategoria'].replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");  
                    encontrado = cadena.includes(texto);
                }
                if(!encontrado){
                    var cadena = dataInicial.subcategorias[x]['categorias'].replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");  
                    encontrado = cadena.includes(texto);
                }

                if(!encontrado){

                    for(var y=0;y<dataInicial.subcategorias[x].etiquetas.length;y++){
                        var cadena = dataInicial.subcategorias[x].etiquetas[y]['tag'].replace(/ /g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");  
                        encontrado = cadena.includes(texto);

                        if (encontrado) {
                            var dd = "";
                            if(dataInicial.subcategorias[x]['desc']!=false){
                                dd = dataInicial.subcategorias[x]['desc']
                            }
                            

                            var titulo = "<p class='tituloCard'>" + dataInicial.subcategorias[x]['subcategoria'] + "</p><p class='descCard'>" + dd + "</p>";
                            var datas = 'data-clave_cat-txt="' + dataInicial.subcategorias[x]['categorias'] + '"data-clave-txt="' + dataInicial.subcategorias[x]['subcategoria'] +  '"data-clave-sub="' + dataInicial.subcategorias[x]['clave'] + '"data-clave-cat="' + dataInicial.subcategorias[x]['clave_cat'] + '" id="' + dataInicial.subcategorias[x]['clave'] + '" ';
                            //var div = "<div class='selectDesdeBuscador' " + datas + " ><div class='row '><div class='col-xs-12  tarjetita'><div class='recutanguloResultados'>" + titulo + "</div></div></div></div>"
                            var div = '<div class="col-xs-12 selectDesdeBuscador" '+datas+'><div class="box blue selectSubcategoria" '+datas+'"><h2><p class="tituloCard22">' + dataInicial.subcategorias[x]['subcategoria'] + '</p></h2><p class="desc22">'+dd+'</p></div></div>'
                            $('.resultados_busqueda .main-container-cards').append(div)
                            encontrado=false;
                        }
                    }
                }

                if (encontrado) {
                    var dd = "";
                    if(dataInicial.subcategorias[x]['desc']!=false){
                        dd = dataInicial.subcategorias[x]['desc']
                    }
                    

                    var datas = 'data-clave_cat-txt="' + dataInicial.subcategorias[x]['categorias'] + '"data-clave-txt="' + dataInicial.subcategorias[x]['subcategoria'] +  '"data-clave-sub="' + dataInicial.subcategorias[x]['clave'] + '"data-clave-cat="' + dataInicial.subcategorias[x]['clave_cat'] + '" id="' + dataInicial.subcategorias[x]['clave'] + '" ';
                    //var div = "<div class='selectDesdeBuscador' " + datas + " ><div class='row '><div class='col-xs-12  tarjetita'><div class='recutanguloResultados'>" + titulo + "</div></div></div></div>"
                    var div = '<div class="col-xs-12 selectDesdeBuscador" '+datas+'><div class="box blue selectSubcategoria" '+datas+'"><h2><p class="tituloCard22">' + dataInicial.subcategorias[x]['subcategoria'] + '</p></h2><p class="desc22">'+dd+'</p></div></div>'

                    $('.resultados_busqueda .main-container-cards').append(div)
                }
            }
            
        }
        else{
            $('.izqSec').show();
            $('.derSec').show();
            $('.seleccioneReporteTxt').show();
            $('.msgInicial').show();
        }


        
    });

}

$(document).on('click', '.selectDesdeBuscador', function() {
    categoria = $(this).data('clave-cat');
    subcategoria = $(this).data('clave-sub');
    desdeBuscador = true;

    $('.detallesReporteGenerales').show();

    categoriaTXT = $(this).data('clave_cat-txt');
    subcategoriaTXT = $(this).data('clave-txt');

    
    current_fs = $(this).closest('fieldset');
    next_fs = $(this).closest('fieldset').next().next();

    //Add Class Active
    $("#steps_c li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
        opacity: 0
    }, {
        step: function(now) {
            // for making fielset appear animation
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            next_fs.css({
                'opacity': opacity
            });
        },
        duration: 600
    });

    var elmnt = document.getElementById("steps_c");
    elmnt.scrollIntoView();
    for(var j=0;j<dataInicial.categorias.length;j++){
        if (categoria==dataInicial.categorias[j]['clave']) {
            $('.catPasoTres').attr('src',"data:image/png;base64," + dataInicial.categorias[j]['icono'].split("'")[1])
        }
    }

    $('#subcategoria').addClass('active');
    $('<input type="button"  class="next pasofinal action-button" value="Siguiente" />').insertAfter($('.detallesReporteGenerales').closest('fieldset').find('.previous').last());
});











