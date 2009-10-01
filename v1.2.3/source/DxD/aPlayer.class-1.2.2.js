var PP_CONFIG = {
  flashVersion: 9,       // version of Flash to tell SoundManager to use - either 8 or 9. Flash 9 required for peak / spectrum data.
  useMovieStar: true,    // Flash 9.0r115+ only: Support for a subset of MPEG4 formats.
  useVideo: true,        // show video when applicable
  usePeakData: true      // L/R peak data
}

//var isHome = true;
soundManager.bgColor = '#f9f9f9';
soundManager.debugMode = false;
soundManager.url = '../main/scripts/swf/';

/*soundManager.url = '../main/scripts/swf/soundmanager2.swf';
soundManager.debugMode = false;
soundManager.waitForWindowLoad = true;
*/

// Array de clases
aPlayer = new Class({
    Implements: [Events, Options],
    
    // Opciones de nuestra clase
    options: {
		name: 'sm2',
		basicSounds: true,
		sounds: false,
		prefixFile: 'snd',
		addFileExtension: true,
		snds: [
			{id: 'sndOk', url: '../main/audio/ok.mp3'},
			{id: 'sndError', url: '../main/audio/error1.mp3'},
			{id: 'sndTic', url: '../main/audio/tic1.mp3'},
			{id: 'sndPop', url: '../main/audio/pop1.mp3'},
			{id: 'sndGood', url: '../main/audio/ok.mp3'},
			{id: 'sndEndAct', url: '../main/audio/truing1.mp3'}
		],

		url: 'audio/',
		smDO: {
            'autoLoad': true, // enable automatic loading (otherwise .load() will be called on demand with .play()..)
            'stream': true, // allows playing before entire file has loaded (recommended)
            'autoPlay': false, // enable playing of file as soon as possible (much faster if "stream" is true)
            'onid3': null, // callback function for "ID3 data is added/available"
            'onload': null, // callback function for "load finished"
            'whileloading': null, // callback function for "download progress update" (X of Y bytes received)
            'onplay': null, // callback for "play" start
            'whileplaying': null, // callback during play (position update)
            'onstop': null, // callback for "user stop"
            'onfinish': null, // callback function for "sound finished playing"
            'onbeforefinish': null, // callback for "before sound finished playing (at [time])"
            'onbeforefinishtime': 5000, // offset (milliseconds) before end of sound to trigger beforefinish..
            'onbeforefinishcomplete': null, // function to call when said sound finishes playing
            'onjustbeforefinish': null, // callback for [n] msec before end of current sound
            'onjustbeforefinishtime': 200, // [n] - if not using, set to 0 (or null handler) and event will not fire.
            'multiShot': false, // let sounds "restart" or layer on top of each other when played multiple times..
            'pan': 0, // "pan" settings, left-to-right, -100 to 100
            'volume': 100 // self-explanatory. 0-100, the latter being the max.
        },
		onload: Class.empty
    },

    // Constructor
    initialize: function(options) {

        // Seteamos elementos de la clase.
        this.setOptions(options);

		// Conectamos soundManager con nombre propio de la clase, por defecto, sm2
		this[this.options.name] = soundManager;

		// Cargamos sonidos Basicos. Seteamos Opciones por defecto de soundManager
	    this[this.options.name].onload = function(){

			// Configuracion inicial del soundManager
			this[this.options.name].defaultOptions = this.options.smDO;

			// Llamamos a funcion de que crea los correspondientes audios.
			this.createSounds ();

			// Disparamos evento onLoad sobre el objeto
			this.fireEvent('load', this);

		}.bind (this);

    },
	
	createSounds: function () {
		// Creamos sonidos basicos, comunes ?
		if (this.options.basicSounds) {
			(this.options.snds).each(function(snd, iS){
				soundManager.createSound({
					id: snd.id,
					url: snd.url
				});
			}, this);
		};

        // Extension de archivos
		var extension = this.options.addFileExtension ? '.mp3' : '';

		// Agregamos archivos de sonido en funcion del tipo de variable definido en 'this.options.sounds'
		switch($type(this.options.sounds)) {

			// En el caso que pasemos un numero como parametro el motodo buscara cadenas de audio con patrones repetitivos por convension
			case 'number':
				for (var i = 0; i < this.options.sounds; i++) {
					soundManager.createSound({
						id: this.options.prefixFile + i,
						url: this.options.url + this.options.prefixFile + i + extension,
						onfinish: this.finishPlay.bind(this, this.speakers[i]),
						onload: this.eventControl.bind(this, this.speakers[i])
					});
					this.speakers[i].idSnd = this.options.prefixFile + i;
				};
			break;

			// en 'array' contemplamos el caso en que los archivos vienen definidos en cada elemento del array
			case 'array':
				this.options.sounds.each (function ($fileName, $iF){
					soundManager.createSound({
						id: this.options.prefixFile + $iF,
						url: this.options.url + $fileName + extension
					});
				}.bind(this));
			break;

			// En caso de que el tipo sea 'object' estamos en ante un array asociativo.
			case 'object':

			break;
		};
	},

	// Funciones de acceso rapido a Sonidos
	Ok: function () {soundManager.play ('sndOk');},
	Error: function () {soundManager.play ('sndError');},
	Tic: function () {soundManager.play ('sndTic');},
	Pop: function () {soundManager.play ('sndPop');},
	Good: function () {soundManager.play ('sndGood');},
	EndAct: function () {soundManager.play ('sndEndAct');}
});

aPlayer.speakers = new Class ({
    Extends: aPlayer,
	options: {
		sounds: 0,
		adjSpeakers: false,
		cssName: 'speakerS',
		stopAll: false,
        prefixFile: 'sndSpk'
	},
	initialize: function (nodesSpeaker, options) {
		// Ejecutamos metodo constructor padre
		this.parent(options);

		this.speakers = new Array (nodesSpeaker.length)

		nodesSpeaker.each (function (speaker, iS){
			this.speakers[iS] = speaker;
		}, this);

		// Acomodamos los parlantes
		if (this.options.adjSpeakers != false) this.adjustSpeakers ();

		// Instalamos controlador de eventos
		//this.eventControl ();
	},

	eventControl: function (speaker) {
			// Agregamos clase CSS inicial
			if (speaker && this.options.cssName) speaker.addClass (this.options.cssName + '-ini');

			// Agregamos eventos
			speaker.addEvents ({
				'mouseenter': function () {
					// Clase CSS
					if (this.options.cssName) speaker.addClass (this.options.cssName + '-enter');
				}.bind(this),

				'mouseleave': function () {
					// Clase CSS
					if (this.options.cssName) speaker.removeClass (this.options.cssName + '-enter');
				}.bind(this),

				'mousedown': function () {
					// Clase CSS
					if (this.options.cssName) speaker.addClass (this.options.cssName + '-play');
					this.sm2.play(speaker.idSnd);
				}.bind(this)
			})
		//}, this);
		
	},
	
	finishPlay: function (speaker) {
		if (speaker && this.options.cssName) speaker.removeClass (this.options.cssName + '-play');
	},

    adjustSpeakers: function(){
		// Recorremos todos los elementos speakers
		(this.speakers).each(function(speaker, iS){
			speaker.setStyle ('position', 'absolute');

			// Ahora definimos su posición
			speaker.position(this.options.adjSpeakers[iS]);
		}, this);
	},

	createSounds: function () {
		// Creamos sonidos basicos, comunes ?
		if (this.options.basicSounds) {
			(this.options.snds).each(function(snd, iS){
				soundManager.createSound({
					id: snd.id,
					url: snd.url
				});
			}, this);
		};

		// Extension de archivos
		var extension = this.options.addFileExtension ? '.mp3' : '';

		// Agregamos archivos de sonido en funcion del tipo de variable definido en 'this.options.sounds'
		switch($type(this.options.sounds)) {
		
			// En el caso que pasemos un numero como parametro el motodo buscara cadenas de audio con patrones repetitivos por convension
			case 'number':
				for (var i = 0; i < this.options.sounds; i++) {
					soundManager.createSound({
						id: this.options.prefixFile + i,
						url: this.options.url + this.options.prefixFile + i + extension,
						onfinish: this.finishPlay.bind(this, this.speakers[i]),
						onload: this.eventControl.bind(this, this.speakers[i])
					});
					this.speakers[i].idSnd = this.options.prefixFile + i;
				};
			break;
			
			// en 'array' contemplamos el caso en que los archivos vienen definidos en cada elemento del array
			case 'array':
				this.options.sounds.each (function ($fileName, $iF){
					soundManager.createSound({
						id: this.options.prefixFile + $iF,
						url: this.options.url + $fileName + extension,
						onfinish: this.finishPlay.bind(this, this.speakers[$iF]),
						onload: this.eventControl.bind(this, this.speakers[$iF])
					});
					if (this.speakers[$iF]) this.speakers[$iF].idSnd = this.options.prefixFile + $iF;
				}.bind(this));
			break;

			// En caso de que el tipo sea 'object' estamos en ante un array asociativo.
			case 'object':
				
			break;
		};

	}
});

/*
 * aPlayer.rePro.
 * Reproductor de audio tradicional.
 */
aPlayer.rePro = aPlayer.extend ({

	options: {
		audioPlayerName: 'sound.mp3',
		audioPlayerDir: 'audio/',
		playerName: 'rePro',

		nodeId: 'player',
		htmlNodeInsert: 'header',
		htmlString: '<div id="aviPlayerUpload"><div id="uploading">loading sound ...</div></div><div id="aviPlayer"><div id="dspTime"></div><div id="btnsPlayer"><div></div><div></div><div></div><div></div></div><div id="playing"><div id="knob"></div></div></div>',

		refreshTime: 40,
		onFinish: Class.empty
	},

    initialize: function(options) {
		// Ejecutamos metodo constructor padre
		this.parent(options);

		// Implementamos elementos HTML en la pagina ?
		if (this.options.htmlNodeInsert) {

			this.elPlayer = new Element('div', {
				id: this.options.nodeId
			});

			this.nodePlayer = $(this.elPlayer);

			this.elPlayer.injectInside(this.options.htmlNodeInsert);
			this.nodePlayer.setHTML(this.options.htmlString);
			
			this.knob = $('knob');
			this.txtTime = $('dspTime');
			this.tempo;
		};

		// slide de Player
		this.FxSlidePlay = new Fx.Slide('aviPlayer', {
			'mode': 'vertical',
			'duration': 500
		});
		// Escondemos el nodo del player
		this.FxSlidePlay.hide ();
		
		// Slide de Uploading ...
		this.FxSlideLoad = new Fx.Slide($('aviPlayerUpload'), {
			'mode': 'vertical',
			'duration': 500,
			onComplete: function(){
				$('aviPlayer').setStyle('visibility', 'visible');
				$('aviPlayerUpload').setStyle('visibility', 'hidden');
				this.txtTime.setText ('0s');
				this.FxSlidePlay.slideIn();
				this.knob.setStyle('width', 12);
            }.bind (this)
		});
	},

	createSounds: function () {
		// Creamos sonido Básicos llamando al metrodo padre.
		this.parent();

		// Creamos objeto tipo SoundManager para el player
		soundManager.createSound({
			id: this.options.playerName,
			url: this.options.audioPlayerDir + this.options.audioPlayerName,

			whileloading: function () {
//				var porcentaje = (this.bytesLoaded / this.bytesTotal) * 100;
//				var leftBGI = porcentaje * 2.6 - 258;
//				$('uploading').setText(porcentaje.toInt() + '%');
//				$('uploading').setStyle('background-position', leftBGI + 'px center');
			},
			
			whileplaying: function whilePlaying(){
				var porcentaje = (this.player.position / this.player.duration) * 100;
				var moveKnob = porcentaje * 2.6;
				this.knob.setStyle('left', moveKnob);
			}.bind (this),

			// Audio del player cargado ...
			onload: function(){
				// Hacemos puente entre el sonido creado por el player con this.player
				this.player = soundManager.sounds[this.options.playerName];

				// escondemos el slider de uploading ... y este mostrará el slide del player
				this.FxSlideLoad.slideOut();
				this.addPlayerSlider();
				this.addButtons();
			}.delay(1000, this),
			
			onfinish: function () {
				this.tempo = $clear (this.tempo);
				this.playerSlider.set(0);
				this.txtTime.setText('end');
				this.btnsPlayer[0].setStyle('background-position', 'left top');
				this.stdBtns[0] = 1;
				this.fireEvent ('finish');
			}.bind (this)
		});

	},

	addPlayerSlider: function () {
		this.playerSlider = new Slider($('playing'), this.knob, {
			steps: 258,
				onChange: function(step) {
				var moveSndTo = step * this.player.duration / 240;
				this.player.setPosition(moveSndTo);
				this.player.slPosition = moveSndTo;
			}.bind (this)
		}).set(0);
	},
	
	printState: function () {
		this.txtTime.setHTML((this.player.position / 1000).toInt() + 's');
	},
	
	addButtons: function () {
		this.stdBtns = [1, 1, 1, 1];
		this.btnsPlayer = $$('#btnsPlayer div');

		this.btnsPlayer.each(function(btn, iB){
			// Acomodamos el film de los botones
			btn.setStyle('background-position', (-24) * iB.toString() + 'px top');

			btn.addEvents({
				mouseenter: function(){
					if (this.stdBtns[iB]) 
						btn.setStyle('background-position', ((-24) * iB - 96).toString() + 'px top');
					}.bind(this),

					mouseleave: function(){
                        if (this.stdBtns[iB]) 
                            btn.setStyle('background-position', (-24) * iB.toString() + 'px top');
                    }.bind(this),

                    mousedown: function(){
                        switch (iB) {
                            case 0:// PLay
                                if (this.stdBtns[iB]) {
									this.tempo = this.printState.periodical (this.options.refreshTime, this, this.player.position);
									this.player.play();
									this.player.setPosition(this.player.slPosition);
                                    btn.setStyle('background-position', ((-24) * iB - 192).toString() + 'px top');
                                    this.stdBtns[iB] = 0;
                                }
                                break;
                                
                            case 1: // Pausa
                                if (!this.stdBtns[0]) {
									this.player.togglePause();

                                    if (this.stdBtns[iB]) {
                                        //posicion = soundManager.sounds.aviPlayer.position;
										this.tempo = $clear (this.tempo);
                                        btn.setStyle('background-position', ((-24) * iB - 192).toString() + 'px top');
                                        this.stdBtns[iB] = 0;
                                    }
                                    else {
										this.tempo = this.printState.periodical (this.options.refreshTime, this);
										btn.setStyle('background-position', (-24) * iB.toString() + 'px top');
                                        this.stdBtns[iB] = 1;
                                    };
                                };
                                break;

                            case 2: // Stop
								this.tempo = $clear (this.tempo);
								this.player.stop();
								this.playerSlider.set(0);
								this.txtTime.setText('0s');
								btn.setStyle('background-position', ((-24) * iB - 192).toString() + 'px top');
								this.btnsPlayer[0].setStyle('background-position', 'left top');
								this.btnsPlayer[1].setStyle('background-position', '-24px top');
								this.stdBtns[0] = 1;
								this.stdBtns[1] = 1;
								break;

                            case 3: // Review
                                this.player.setPosition(0);
                                this.playerSlider.set(0);
                                this.player.slPosicion = 0;
                                btn.setStyle('background-position', ((-24) * iB - 192).toString() + 'px top');
                                break;
							}
                    }.bind(this)
                })
            }, this)
        }
});


aPlayer.karaoke = aPlayer.rePro.extend ({
	options: {
		wordTag: 'span',
		verseTag: 'p',
		stanzaTag: 'div',
		nodeIdKara: 'karaoke',
		wordSpace: ' ',

		sincro: {},

		nDelay: 0,
		pDelay: 0,
		verseUpDelay: 0,
		timeLastWord: 5,

		onUpWord: Class.empty,
		onDownWord: Class.empty,
		onUpVerse: Class.empty,
		onUpStanza: Class.empty,

		stylesWordUp: {

		},
		stylesWordDown: {

		},

		stylesVerseUp: {
		},

		stylesVerseDown: {
		},

		stylesStanzaUp: {
			display: 'block'
		},
		stylesStanzaDown: {
			display: 'none'
		}

	},
	initialize: function (options) {
		// Ejecutamos metodo constructor padre
		this.parent(options);

		// Si el primer elemento no es null, lo insertamos ...
		if (this.options.sincro != null) this.options.sincro.unshift (null);

		// Acomodamos el vector de tiempos generando un nuevo vector denominado this.sincroTxW.
		// ... digamos, sería algo como sincronizacion de tiempo por palabra.
		// Es muy importante tener en cuenta que la primer palabra es de indice 1, no de cero.
		// Se ha tomado así porque el cero es false, y bla bla bla ...
		this.sincroTxW = new Array (this.options.sincro.length);

		for (var i = 0; i <= this.options.sincro.length; i++)
			if (this.options.sincro[i] != undefined) this.sincroTxW [this.options.sincro[i]] = i;

		// Quitamos undefined
		longitud = this.sincroTxW.length;
		for (var i = 0; i <= longitud; i++) {
			if (this.sincroTxW[i] == undefined) this.sincroTxW[i] = false;
	//		else this.sincroTxW[i] = false;
		}
		
		// Modificamos estructura HTML
		this.modHtml2Kara ();
		
		// Definimos propiedad de tiempo del knob anterior ... yo me entiendo.
		this.timeKnobAnt = -1;
		this.indVerseAnt = -1;
		this.indStanzaAnt = -1;
	},

	modHtml2Kara: function () {
		// Reacomodamos la cancion
		this.stanzas = $(this.options.nodeIdKara).getElements (this.options.stanzaTag);
		this.verses = $(this.options.nodeIdKara).getElements (this.options.verseTag);
		
		(this.stanzas).each (function (stanza, iS){
			stanza.ind = iS;
			stanza.setStyles (this.options.stylesStanzaDown);
		}, this);
		
		this.stanzas[0].setStyles (this.options.stylesStanzaUp);

		// Reacomodamos la cancion verso por verso.
		(this.verses).each (function (verse, iV) {
				var arrWords = verse.innerHTML.toString().split (' ');
				var htmlNewVerse = '';

				arrWords.each (function (word, iW) {
					htmlNewVerse = htmlNewVerse + '<' + this.options.wordTag + '>' + word + this.options.wordSpace + '</' + this.options.wordTag + '>';
				}, this);

				// Imprimimos codigo de verso modificado en la pagina html
				verse.setHTML (htmlNewVerse);
				verse.setStyles (this.options.stylesVerseDown)
				verse.ind = iV ;
		}, this);
		
		this.verses[0].setStyles (this.options.stylesVerseUp)

		// Ahora si ... array de words
		this.words = $(this.options.nodeIdKara).getElements (this.options.wordTag);

		// Le asignamos un indice al elemento de letra, nos puede servir ... y la palabra como propiedad de la misma.
		this.words.each (function (word, iW){
			word.ind = iW;
			word.value = word.getText();
			word.setStyles (this.options.stylesWordDown);
		}, this);
	},

	printState: function () {
		this.parent ();
		var timeKnob = (this.player.position/100).toInt();

		if (this.sincroTxW[timeKnob]) {

			if (this.timeKnobAnt != timeKnob) {
				this.timeKnobAnt = timeKnob;

				var verse = this.words[this.sincroTxW[timeKnob] - 1].getParent ();

				// Calculamos el intervalo de tiempo entre una palabra y la siguiente
				var tmpTime = this.options.sincro[this.sincroTxW[timeKnob] + 1] - this.options.sincro[this.sincroTxW[timeKnob]];
				deltaTime = tmpTime ? tmpTime : this.options.timeLastWord;

				this.wordUp (this.words[this.sincroTxW[timeKnob] - 1], [timeKnob, deltaTime]);
				this.wordDown.delay ((deltaTime + this.options.pDelay)*100, this, [this.words[this.sincroTxW[timeKnob] - 1], timeKnob, deltaTime]);

				// Camcio de verso ?
				if (verse.ind != this.indVerseAnt) {
					var stanza = verse.getParent ();
					this.verseUp.delay (this.options.verseUpDelay*100, this, [verse, (this.indVerseAnt == -1) ? false : this.verses[this.indVerseAnt]]);
					this.indVerseAnt = verse.ind;
					
					// Vambio de estrofa stanza ?
					if (stanza.ind != this.indStanzaAnt) {
						this.stanzaUp (stanza, (this.indStanzaAnt == -1) ? false : this.stanzas[this.indStanzaAnt]);
						this.indStanzaAnt = stanza.ind;
					}
					
				};
			};
		};
	},
	
	wordUp: function (el, time, deltaTime) {
		el.setStyles (this.options.stylesWordUp);
		this.fireEvent ('upWord', [el, time, deltaTime]);
	},

	wordDown: function (el, time, deltaTime) {
		el.setStyles (this.options.stylesWordDown);
		this.fireEvent ('downWord', [el, time, deltaTime]);
	},
	
	verseUp: function (verse, verseAnt) {
		verse.setStyles (this.options.stylesVerseUp);
		if (verseAnt) verseAnt.setStyles (this.options.stylesVerseDown);
		this.fireEvent ('upVerse', [verse, verseAnt]);
	},

	stanzaUp: function (stanza, stanzaAnt) {
		stanza.setStyles (this.options.stylesStanzaUp);
		if (stanzaAnt) stanzaAnt.setStyles (this.options.stylesStanzaDown);
		this.fireEvent ('upStanza', [stanza, stanzaAnt]);
	}
});

/*
 * Agregamos efectos a las palabras, renglones y estrofas.
 */

aPlayer.karaokeFx = aPlayer.karaoke.extend ({
	options: {
		optionsFxWord: {
			duration: 500,
			wait:false,
			transition: Fx.Transitions.Cubic.easeOut
			},
		optionsFxVerse: {
			duration: 1500,
			wait:false,
			transition: Fx.Transitions.Quint.easeOut
			},
		optionsFxStanza: {
			duration: 500,
			wait:false,
			transition: Fx.Transitions.Quint.easeOut
			}
	},

	initialize: function (options) {
		this.parent(options);
		
		// Agregamos efectos a palabras, versos y estrofas
		(this.words).each (function (word, iW){
			word.fx = new Fx.Styles(word, this.options.optionsFxWord);
		}, this);
		
		(this.verses).each (function (verse, iV) {
			verse.fx = new Fx.Styles(verse, this.options.optionsFxVerse);
		}, this);
		
		this.verses[0].fx.start (this.options.stylesVerseUp);
	},
	
	wordUp: function (el, time, deltaTime) {
		el.fx.start (this.options.stylesWordUp);
		this.fireEvent ('upWord', [el, time, deltaTime]);
	},

	wordDown: function (el, time, deltaTime) {
		el.fx.start (this.options.stylesWordDown);
		this.fireEvent ('downWord', [el, time, deltaTime]);
	},

	stanzaUp: function (stanza, stanzaAnt) {
		this.fireEvent ('upStanza', [stanza, stanzaAnt]);
	}

});
