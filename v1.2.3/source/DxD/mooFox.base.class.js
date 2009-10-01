/*
 * evento randomize para arrays. Desordena todos sus elementos.
 */
Array.prototype.randomize = function(){
	// Array temporal, copia del original.
	var $arrTmp = new Array(0);
	
	var $arrTmpIndRnd = new Array(this.length);
	var $arrIndRnd = new Array(this.length);

	for (var $i = 0; $i < $arrTmpIndRnd.length; $i++) 
		$arrTmpIndRnd[$i] = $i;
		
	$arrTmp.extend(this);
	
	// Quitar y poner (los grosos le dice 'Pick and Drop')
	for (var i = 0; $arrTmp.length; i++) {
		var rndNum = $random(0, ($arrTmp.length - 1));
		this[i] = $arrTmp[rndNum];
		$arrIndRnd[i] = $arrTmpIndRnd[rndNum];

		$arrTmp.splice(rndNum, 1);
		$arrTmpIndRnd.splice(rndNum, 1);
	};
	return $arrIndRnd;
}

// Variable de variable
String.prototype.toVar = function (value) {
    window[this]=value || null;
    return null;
}


/*
 * setCircular. Nos da coordenadas de n elementos sobre una elipse de ancho y alto.
 */
Array.prototype.setCircular = function (options) {

    options.alphaIni = (options.alphaIni) ? (2 * Math.PI/360)*options.alphaIni : 0;
    options.alphaFin = (options.alphaFin) ? (2 * Math.PI/360)*options.alphaFin : 2 * Math.PI;

    var angulo = (options.alphaFin - options.alphaIni) / this.length;
    for (var iE = 0, el = this[iE]; iE < this.length; iE ++) {
        var alfa = angulo * iE + options.alphaIni;

        this[iE] = {
            x: (Math.sin(alfa) * (options.width / 2) + options.left).toInt(),
            y: (Math.cos(alfa) * (-options.height / 2) + options.top).toInt()
        };
    };
};