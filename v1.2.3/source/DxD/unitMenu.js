window.addEvent('load', function() {
	/*
    $contentFx = new Fx.Morph($('content'), {
    duration: 300
    });
      
    $contentFx.start ({
    'opacity': 1
    });
    
    */
	/*$('content').setStyle ('visibility', 'visible');*/
	

    var scroll = new Fx.Scroll('film-wrapper', {
	    wait: false,
	    duration: 2500,
	    transition: Fx.Transitions.Quad.easeInOut
    });
	
	// bar-activities
	$menuActivities = $$('#bar-activities div');

	// film
	$film = $$('#film-inner tr td');
	
	var $iOBack = -1;

	$menuActivities.each (function ($optMenu, $iO){

		$optMenu.addClass ('option');

		$optMenu.addEvents ({
			'mouseenter': function (event) {
				// Redefinimos duration en forma inversamente proporcional al valor absoluto de la diferencia de los indices
				scroll.options.duration = (Math.abs ($iO-$iOBack) + 1)/17*2000 + 500;
				event = new Event(event).stop();
				//scroll.toElement($film[$iO]);
				scroll.start($iO*442, 0);
				$optMenu.addClass ('option-over');
			},
			'mouseleave': function () {
				$optMenu.removeClass ('option-over');
				$iOBack = $iO;
			},
			'click': function (e) {
				var $act = this.getProperty('act');
				openWin('act' + $act + '/act' + $act + '.html', 'act' + $act);
			}
		});
	});
	
	
	$film.each (function ($cuadro, $iC){
		$cuadro.setStyles ({
			left: 450*$iC,
			top: 0
		});
		$cssClass = ($iC%2) ? 'td-a' : 'td-b';
		$cuadro.addClass($cssClass);
		
		$cuadro.addEvents ({
			'mouseenter': function (event) {
				event = new Event(event).stop();
				scroll.start($iC*442, 0);
				$cuadro.addClass('cuadro-over')
			},
			'mouseleave': function (event) {
				$cuadro.removeClass('cuadro-over')
			},
			'click': function (e) {
				var $act = this.getProperty('act');
				openWin('act' + $act + '/act' + $act + '.html', 'act' + $act);
			}
		});
	})
});

function sizeScreen () {
	var sizeSc = new Array (2);
	sizeSc = [window.screen.width, window.screen.height];
	return sizeSc;
};

function openWin (urlWin, titWin) { 
	var size = new Array(2);
	size = sizeScreen();
	var activitiesWin = "width=" + size[0] + ",height=" + size[1] + ",left=0,top=0,resizable=YES, scrollbar=YES";
	location.href= urlWin;
};

// Deshabilitamos seleccion de texto
function disableselect(e) {return false}
function reEnable() {return true}
//if IE4+
document.onselectstart=new Function ("return false")
//if NS6
if (window.sidebar) {
   document.onmousedown=disableselect
   document.onclick=reEnable
};
