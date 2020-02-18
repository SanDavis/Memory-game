$(() => {  // Es equivalente a $(document).ready(laFuncionDeInicio);
    $('#btn').click(verificarSeleccion); //Boton para verificar el valor del desplegable 
    $('#btn-popup').click(() => {
        $('#popup1').removeClass('tada'); 
        $('#popup1').removeClass('visible');
    });
});

var primeraImg = null;
var tiempo = 0;
var tInterval = null;
var intentos = 0;
var audioVictoria = new Audio('../audio/videojuegos-.mp3');
var audio = new Audio('../audio/Click On-SoundBible.com-1697535117-[AudioTrimmer.com].mp3');
var numImgsDestapadas = 0; //Contador de imagenes coincidentes

function verificarSeleccion() {
    let nivel = $('#desplegable').val(); //obtenemos el valor de la seleccion

    if (nivel) { //Verificamos que se haya seleccionado un valor válido
        
        $(this).text('Reiniciar');
        crearTabla(nivel); //Creamos la tabla segun el nivel seleccionado
        //Reiniciamos todo (tiempo, intentos, contador de imagenes coincidentes,...)
        numImgsDestapadas = 0;
        $('#intentos').text(0);
        intentos = 0, tiempo = 0;
        clearInterval(tInterval);//Cada vez que se cree un nuevo nivel limpiamos ejecucion de setInterval anterior
        tInterval = setInterval(contarTiempo, 1000);
    } else {
        alert('Seleccione un valor válido');
    }
}

function crearTabla(dimension) {
    let col = dimension.charAt(0);
    let fila = dimension.charAt(2);
    let tabla = '';
    let imgs = prepararImgs(((col * fila) / 2));

    for (let i = 0, aux = 0; i < fila; i++) {
        tabla += '<tr>';
        for (let j = 0; j < col; j++ , aux++) {
            tabla += `<td id='${aux}'><img src ='../img/img_${imgs[aux]}.jpeg'></td>`;
        }
        tabla += '</tr>';
    }
    $('#tabla').html(tabla); //Una vez creada la tabla la insertamos
    $('td').click(comprobarImg); //A cada celda le adjuntamos la funcion de comprobacion del click

    $('td, img').addClass('animated'); //Agregamos las clases para la animaciones correspondientes
    $('td').addClass('rollIn');
    $('img').attr('draggable', false); //Para que las imagenes no se puedan arrastrar (por defecto una imagen es arrastable)
}

function prepararImgs(numImgs) {
    let imgs = [];

    for (let i = 0; i < 10; i++) {
        imgs[i] = i;
    }
    imgs = imgs.sort(() => Math.random() - 0.5);
    imgs = imgs.slice(0, numImgs);
    imgs = imgs.concat(imgs);
    imgs = imgs.sort(() => Math.random() - 0.5);

    return imgs; //Devuelve un array de numeros desordenado, del tamaño de la tabla
}

function comprobarImg() {

    let img = $(this).children().first(); //Obtenemos la img clicada

    $(img).show(1);
    $(img).addClass('flipInY');//flipInY swing tada flip wobble heartBeat
    
    if (primeraImg == null) {
        primeraImg = img;
    } else if ($(this).attr('id') != $(primeraImg).parent().attr('id')) {
        if ($(primeraImg).attr('src') == $(img).attr('src')) {
            $.when(eliminarEventos(this, primeraImg)).then(comprobarTriunfo);
        } else {
            $(primeraImg).fadeOut(1000);
            $(img).fadeOut(1000);
        }
        primeraImg = null;
        $('#intentos').text(++intentos);
    }
    audio.play();
}

function eliminarEventos(td1, td2) {
    $(td1).unbind("click");
    $(td2).parent().unbind("click");
}

function comprobarTriunfo() {
    numImgsDestapadas += 2;//Cada vez que dos imgs coinciden aumentamos este contador en dos
    if (numImgsDestapadas == $('td').length) { //caundo numImgsDestapadas sea igual al numero de celda, entonces se habra ganado
       
        //Eliminamos primero la clase para, seguidamente aplicarle otra, de lo contrario no funciona 
        $('td').removeClass('rollIn'); 
        $('td').addClass('flipInY');//tada, rollOut, hinge rotateIn flip rubberBand shake swing wobble
        // heartBeat 

        $('#popup1').addClass('transicion');
        $('#popup1').addClass('tada');//tada, rollOut, hinge rotateIn flip flash
        $('#popup1').addClass('visible');

        $('#tiempo-info').text($('#tiempo').text());
        $('#intentos-info').text($('#intentos').text());
        audioVictoria.play();
        clearInterval(tInterval);
    }
}

function contarTiempo() {
    //La variable tiempo almacena los segundos a traves de los cuales sacaré los minutos y segundos
    let minutos = Math.floor(tiempo / 60);
    minutos = (minutos < 10) ? '0' + minutos : minutos; //Si los mins son menores a 10 agregamos un 0 delante para que se vea 09 y no 9.

    let segundos = tiempo - (60 * minutos);
    segundos = (segundos < 10) ? '0' + segundos : segundos;

    $('#tiempo').text(`${minutos + ':' + segundos}`);//hora + ':' + 
    tiempo++;
}