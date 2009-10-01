// Deshabilitamos seleccion de texto
function disableselect(e){
    return false
}

function reEnable(){
    return true
}

//if IE4+
document.onselectstart = new Function("return false")
//if NS6
if (window.sidebar) {
    document.onmousedown = disableselect
    document.onclick = reEnable
};


var $contentFx;
/*
 * Funcion de configuracion del menu de navegacion.
 * funtion initMenu
 */
var initMenu = function(options){
    window.addEvent('domready', function(){
    
        $('content').setStyles({
            opacity: 0,
            visibility: 'visible'
        });
        
        // Slide de Info de actividades.
        var infoSlide = new Fx.Slide('infoWin');
        
        $('infoWinContainer').show();
        
        
        infoSlide.hide();
        
        $('infoWin').addEvent('mousedown', function(e){
            e = new Event(e);
            infoSlide.slideOut();
            e.stop();
        });
        
        // btns son los botones de todo la barra de Menu. Es MUY importante le orden de los nodos DOM en la estructura html
        var $btns = $$('#menuBar div div');
        
        // Agregamos eventos
        $btns.each(function($btn, $iB){
        
            if ($btn.getProperty('action') != null) {
                $btn.addEvents({
                    'mouseenter': function(){
                        $btn.setStyle('background-position', $iB * (-60).toString() + 'px -60px')
                    },
                    'mouseleave': function(){
                        $btn.setStyle('background-position', $iB * (-60).toString() + 'px top')
                    },
                    'mousedown': function(){
                        $btn.setStyle('background-position', $iB * (-60).toString() + 'px -120px')
                    },
                    'mouseup': function(){
                        $btn.setStyle('background-position', $iB * (-60).toString() + 'px top')
                    },
                    'click': function(e){
                        var $arrAction2Btn = $btn.getProperty('action').split(':');
                        
                        // Restart
                        if ($arrAction2Btn[0] == 'restart') {
                            initAct();
                        };
                        
                        // Check
                        if ($arrAction2Btn[0] == 'check') {
                            checkAct();
                        };
                        
                        // Info
                        if ($arrAction2Btn[0] == 'info') {
                            e = new Event(e);
                            infoSlide.toggle();
                            e.stop();
                        };
                        
                        // Home
                        if ($arrAction2Btn[0] == 'home') {
                            var link = (document.location).toString();
                            var arrlink = link.split('/');
                            var letraAct = arrlink[arrlink.length - 1].substring(3, 4);
                            var menuAct = link.substr(0, link.length - arrlink[(arrlink.length) - 1].length - arrlink[(arrlink.length) - 2].length - 1) + 'menu' + letraAct + '.html';
                            document.location = menuAct;
                        };
                        
                        // Link
                        if ($arrAction2Btn[0] == 'link') {
                            var link = (document.location).toString();
                            var arrlink = link.split('/');
                            var letraNext = String.fromCharCode(arrlink[arrlink.length - 1].charCodeAt(5) + 1);
                            var actNext = $arrAction2Btn[1];
                            var linkNext = link.substr(0, link.length - arrlink[(arrlink.length) - 1].length - arrlink[(arrlink.length) - 2].length - 1) + actNext + '/' + actNext + '.html';
                            document.location = linkNext;
                        };
                                            }
                });
            }
            else {
                $btn.setStyles({
                    'cursor': 'default',
                    'background-position': $iB * (-60).toString() + 'px -180px'
                })
            }
        });
    });
};

var reLoad = function(){
    document.location.reload();
};

var activityComplete = function(){
    /*
     var $menuNavigator = $('menuNavigator');
     var $btn5Ani = new Element('div', {
     'id': 'btn05-ani',
     'styles': {
     'opacity': 0
     }
     });
     $btn5Ani.inject($menuNavigator);
     $('btn05').setStyle('background-position', '-300px -180px');
     
     var fxComplete = new Fx.Styles($btn5Ani, {duration:500, wait:false});
     fxComplete.start ({
     opacity: 1
     }).chain(function() {
     fxComplete.start ({
     opacity: 0
     });
     soundManager.play('sndEndAct');
     }).chain(function() {
     $btn5Ani.setStyle('background-position', '-300px -240px');
     fxComplete.start ({
     opacity: 1
     });
     }).chain(function() {
     $('btn05').setStyle('background-position', '-300px top');
     fxComplete.start ({
     opacity: 0
     });
     }).chain(function() {
     $btn5Ani.remove();
     });
     */
};
var activityCompleteSound = function(seconds){
    seconds = (seconds) ? seconds : 0;
    (function(){
        soundManager.play('sndEndAct');
    }).delay(seconds);
};

window.addEvent('load', function(){

    $contentFx = new Fx.Morph($('content'), {
        duration: 300
    });
    
    $contentFx.start({
        'opacity': 1
    });
});
