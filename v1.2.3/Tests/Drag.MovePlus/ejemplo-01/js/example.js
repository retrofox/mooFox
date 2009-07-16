window.addEvent ('domready', function () {
	
  // Variables de Drags y Drops
  var $drags = $$('#drags div');
  var $drops = $$('#drops div ');


  $drags.each (function ($drag, $iD) {

    new Drag.Move($drag, {
      droppables: $drops,
      container: $('content'),

      onDrop: function(element, droppable, event){
        if (!droppable) {
          console.log(element, ' dropped on nothing');
        }
        else {
          droppable.addClass ('drop-Drop');
        }
      },

      onEnter: function(element, droppable){
        element.addClass ('enter-Drag');
        droppable.addClass ('enter-Drop');
      },

      onLeave: function(element, droppable){
        element.removeClass ('enter-Drag');
        droppable.removeClass ('enter-Drop');
      }

    });

    // Acomodamos un poco los drags
    $drag.setStyle ('left', $iD*100 + 100);
  });
});