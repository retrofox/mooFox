/*
    Script: mmtt.class-1.2.2.1.js
    Clase MMTT.
        Clase que incorpora un funcionamiento tipo MemoTest

    License:
    MIT-style license.

    @author: Damián Súarez (damian.suarez@xifox.net)
 */

var MMTT = new Class({
  Implements: [Events, Options],

  options: {
    coverTag: 'div',
    randomTabs: true,
    bgOffsetInOne: false,
    bgOffsetInTwo: true,
    printNumbers: true,
    delayOne2Two: 800
  },

  // Constructor
  initialize: function($groupOne, $groupTwo, options){
    // Seteamos elementos de la clase.
    this.setOptions(options);

    this.boxes = [];
    this.buildDesk ($groupOne, $groupTwo);

    this.addInteractivity();
  },

  addInteractivity: function () {
    this.boxes.each (function ($objBox, $iB) {
      // mostramos los elementos

      this.boxes[$iB].fxSlide.wrapper.setStyles ({
        left: 0,
        top: 0
      });

      $objBox.elCover.addEvents ({
        'mousedown': function(e){
          e.stop();

          if (this.enabledTabs && $objBox.enabled) {
            if (this.cttMoved == 0) {
              this.tabOne = $objBox;
              this.tabOne.out = true;
              this.enabledTabs = false;
              $objBox.fxSlide.slideOut();
            }
            else {
              this.tabTwo = $objBox;
              this.tabTwo.out = true;
              $objBox.fxSlide.slideOut();
              this.enabledTabs = false;
            };

            this.cttMoved++;
          };


        }.bind(this),
        'mouseenter': function () {
          $objBox.elCover.addClass ('enter-cover');
        }.bind(this),
        'mouseleave': function () {
          $objBox.elCover.removeClass ('enter-cover');
        }.bind(this)
      });
    }, this);
  },

  buildDesk: function ($groupOne, $groupTwo) {
    this.buildGroup ($groupOne, 0);
    this.buildGroup ($groupTwo, 1);

    this.tabOne = true;
    this.tabTwo = false;
    this.enabledTabs = true;
    this.cttMoved = 0;
    this.cttPair = this.boxes.length/2;
		
    if (this.options.randomTabs) {
      this.shuffle();
    };
  },

  buildGroup: function ($elIdGroup, $numberGroup) {
    var $bgOffset;
    if (!$numberGroup) {
      $bgOffset = this.options.bgOffsetInOne;
      this.elGroupOne = $elIdGroup;
    }
    else {
      $bgOffset = this.options.bgOffsetInTwo;
      this.elGroupTwo = $elIdGroup;
    };

    $tabGroup = $($elIdGroup).getChildren();
    $tabGroup.each (function ($elBox, $iB) {

      if (!$numberGroup) {
        $elBox.addClass ('tabGroupOne');
      }
      else {
        $elBox.addClass ('tabGroupTwo');
      };

      $elCover = new Element (this.options.coverTag, {
        styles: ({
          margin: 0,
          position: 'absolute',
          top: 0,
          left: 0
        }),
        'class': 'cover'
      });
            
      if ($bgOffset) {
        if ($type($bgOffset == 'object')) {
          $elBox.setStyle('background-position', (-1) * $iB * $bgOffset.width.toString() + 'px ' + $bgOffset.top.toString() + 'px');
        }
        else {
          if ($type($bgOffset) == 'number') $elBox.setStyle('background-position', (-1) * $iB * $bgOffset.toString() + 'px ' + $pos[1]);
        };
      };

      $elCover.inject ($elBox);

      $optionsFx = {
        onComplete: function () {
          this.tabFxComplete ($iB);
        }.bind (this)
      }

      this.boxes.include ({
        enabled: true,
        elTab: $elBox,
        elCover: $elCover,
        pair: $numberGroup,
        ind: $iB,
        fxSlide: new Fx.Slide($elCover, $optionsFx)
      });

      if (this.options.randomTabs) {
        $elBox.dispose();
      };
    }, this);
  },

  tabFxComplete: function ($iTab) {
    $tab = this.boxes[$iTab];

    if (this.tabOne.out && this.tabTwo.out) {

      if (this.tabOne.ind !== this.tabTwo.ind) {
        this.fireEvent ('falsePair', [this.tabOne.ind, this.tabTwo.ind]);
        this.tabOne.fxSlide.slideIn();
        
        (function () {this.tabTwo.fxSlide.slideIn();}).delay (this.options.delayOne2Two, this);

        
      }
      else {
        this.fireEvent ('truePair', [this.tabOne.ind, this.tabTwo.ind]);
        this.tabOne.enabled = false;
        this.tabOne.enabled = false;
        this.cttPair--;
        if (!this.cttPair) {
          this.fireEvent('gameComplete');
        };

        this.enabledTabs = true;
      };

      this.tabOne.out = false;
      this.tabTwo.out = false;
      this.cttMoved = 0;
      
    }
    else if ((!this.tabOne.out && !this.tabTwo.out) || (this.cttMoved  !== 0)) {
      this.enabledTabs = true;
    }
  },
	
  enableDesk: function () {
    this.enabledTabs = true;
  },

  shuffle: function () {
    this.boxes.randomize();
    this.boxes.each (function ($objBox, $iOB){
			
      if ($iOB < (this.boxes.length/2)) {
        $objBox.elTab.inject(this.elGroupOne);
      }
      else {
        $objBox.elTab.inject(this.elGroupTwo);
      };
      if (this.options.printNumbers) $objBox.elCover.set('html', $iOB+1);
    }, this)
  }
});