/*
 File: script.js
 Assignment: Scrabble Game
 Bikash Shrestha, UMass Lowell Computer Science, Bikash_Shrestha@student.uml.edu
 Copyright (c) 2023 by Bikash Shrestha. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author.
 Updated by BS on July 1,  2023, at 8:00 PM.
 Instructor: Professor Wenjin Zhou
 Help: w3 Schools/ Stack Overflow / jQuery / Google 
 Basic Description: This is the fifth assignment where we use jQuery UI, HTML, and CSS to create a game of Scrabble. The assingment mostly focues on the drag-and-drop method. 
*/

const RACK_MAX_TILES = 7;
var totalScore = 0;

$(document).ready(function() {
  /* Creating scrabble object */
    ObjScrabble.init();

    /* Initialize custom board */
    var $blank = $('<div>').addClass('board-blank slot droppable ui-widget-header')
                           .attr('letter-mult', 1)
                           .attr('word-mult', 1);
    var $doublew = $blank.clone()
                         .addClass('board-double-word')
                         .removeClass('board-blank')
                         .attr('word-mult', 2);
    var $doublel = $blank.clone()
                         .addClass('board-double-letter')
                         .removeClass('board-blank')
                         .attr('letter-mult', 2);
    var i = 0;
    $('#board')
        .append($blank.clone().attr('col', i++))
        .append($doublew.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++))
        .append($doublel.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++))
        .append($doublew.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++));

    /* Draw tiles to rack */
    drawHand();
    /* Refresh Scoreboard */
    refreshScoreboard();
    /* Tile dragging functionality */
    makeTilesDraggable();

    /** Allow the dropping of tiles into the board slots **/
    $('.slot').droppable({
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (event, ui) {
            var $this = $(this);
            if ( $this.children().length == 0 ) {
                ui.draggable
                    .detach()
                    .css({top: 0, left: 0})
                    .addClass('drawn')
                    .appendTo($this);
                refreshScoreboard();
                $('#next-word').prop('disabled', false);
            }
        }
    });

    /** Allow the dropping of tiles back into the rack **/
    $('#rack').droppable({
        accept: '.drawn',
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (e, ui) {
            ui.draggable.detach()
                        .removeClass('drawn')
                        .css({top:0, left:0})
                        .appendTo($(this));
            refreshScoreboard();
        }
    });

    $('#reset').on('click', function(e) {
        e.preventDefault();
        ObjScrabble.init();
        $('#board').children().empty();
        $('#rack').empty();
        drawHand();
        makeTilesDraggable();
        refreshScoreboard();
        totalScore = 0;
        $('#total-score').text(totalScore);
    })

    $('#next-word').on('click', function(e) {
        e.preventDefault();
        $('#board').children().empty();
        drawHand();
        makeTilesDraggable();

        var curScore = parseInt($('#cur-score').text(), 10);
        totalScore += curScore;
        $('#total-score').text(totalScore);
        refreshScoreboard();
    });

});

// Stores the tile letter values into a
// Updates the total and current score
// Updates the number of tiles left in bag.
function refreshScoreboard() {

    var stringWord = "";
    var score = 0;
    var letterVal;
    var letterMult = 1;
    var wordMult = 1;

    /* For each drawn tile, calculate its value based on the tile itself
       and the board slot in which it resides. */
    $('.slot').each(function() {
        var $this = $(this);
        var $child;
        if ( $this.children().length > 0 ) {
            $child = $this.find('img');
            stringWord += $child.attr('letter');

            letterVal = parseInt($child.attr('value'), 10);
            letterMult = parseInt($this.attr('letter-mult'), 10);

            score += (letterVal * letterMult);
            wordMult *= parseInt($this.attr('word-mult'), 10);
        } else {
            stringWord += '.';
        }

    });

    // Write out values
    $('#word').text(stringWord);
    $('#cur-score').text(score*wordMult);
    $('#bag').text(ObjScrabble.bag.length);

}

// Draws tiles from the bag in order to fill player's hand to 7 tiles.
function drawHand() {
    var $rack = $('#rack');
    var $tile = $('<img>').addClass('tile draggable ui-widget-content');
    var i = $rack.children().length;
    for (; i < RACK_MAX_TILES; ++i) {
        var key = ObjScrabble.drawTileFromBag();
        if (key) {
            var strSrc = 'images/tiles/Scrabble_Tile_' + key + '.jpg';
            var $newTile = $tile.clone()
                                .attr('value', ObjScrabble.dictTiles[key].value)
                                .attr('letter', key)
                                .attr('src', strSrc)
                                .appendTo('#rack');
        }
    }
}

// Makes it so that the tiles can now be draggable
function makeTilesDraggable() {
    $('.tile').draggable({
        revert: true,
        //Animation speed the tiles take to go back to original spot
        revertDuration: 500,
        scroll: false,
        start: function (e, ui) {
            $(this).addClass('hovering');
        },
        stop: function (e, ui) {
            $(this).removeClass('hovering');
        }
    });
}


var debugging = false;

var ObjScrabble = {};
ObjScrabble.dictTiles = [];

ObjScrabble.init = function() {
    /*taken dictionary from:
      https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse_Test.html */
    ObjScrabble.dictTiles['A'] = { 'value': 1,  'freq' : 9,  'quantity' : 9 };
    ObjScrabble.dictTiles['B'] = { 'value': 3,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['C'] = { 'value': 3,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['D'] = { 'value': 2,  'freq' : 4,  'quantity' : 4 };
    ObjScrabble.dictTiles['E'] = { 'value': 1,  'freq' : 12, 'quantity' : 12};
    ObjScrabble.dictTiles['F'] = { 'value': 4,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['G'] = { 'value': 2,  'freq' : 3,  'quantity' : 3 };
    ObjScrabble.dictTiles['H'] = { 'value': 4,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['I'] = { 'value': 1,  'freq' : 9,  'quantity' : 9 };
    ObjScrabble.dictTiles['J'] = { 'value': 8,  'freq' : 1,  'quantity' : 1 };
    ObjScrabble.dictTiles['K'] = { 'value': 5,  'freq' : 1,  'quantity' : 1 };
    ObjScrabble.dictTiles['L'] = { 'value': 1,  'freq' : 4,  'quantity' : 4 };
    ObjScrabble.dictTiles['M'] = { 'value': 3,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['N'] = { 'value': 1,  'freq' : 6,  'quantity' : 6 };
    ObjScrabble.dictTiles['O'] = { 'value': 1,  'freq' : 8,  'quantity' : 8 };
    ObjScrabble.dictTiles['P'] = { 'value': 3,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['Q'] = { 'value': 10, 'freq' : 1,  'quantity' : 1 };
    ObjScrabble.dictTiles['R'] = { 'value': 1,  'freq' : 6,  'quantity' : 6 };
    ObjScrabble.dictTiles['S'] = { 'value': 1,  'freq' : 4,  'quantity' : 4 };
    ObjScrabble.dictTiles['T'] = { 'value': 1,  'freq' : 6,  'quantity' : 6 };
    ObjScrabble.dictTiles['U'] = { 'value': 1,  'freq' : 4,  'quantity' : 4 };
    ObjScrabble.dictTiles['V'] = { 'value': 4,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['W'] = { 'value': 4,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['X'] = { 'value': 8,  'freq' : 1,  'quantity' : 1 };
    ObjScrabble.dictTiles['Y'] = { 'value': 4,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.dictTiles['Z'] = { 'value': 10, 'freq' : 1,  'quantity' : 1 };
    ObjScrabble.dictTiles['_'] = { 'value': 0,  'freq' : 2,  'quantity' : 2 };
    ObjScrabble.size = Object.keys(ObjScrabble.dictTiles).length;

    if (debugging) console.log('ObjScrabble.size: ', ObjScrabble.size);

    /* Setting up the baf */
    ObjScrabble.bag = [];
    for (var key in ObjScrabble.dictTiles) {
        for (var i = 0; i < ObjScrabble.dictTiles[key].quantity; ++i) {
            ObjScrabble.bag.push( key );
        }
    }

    if (debugging) {
        console.log('bag.length: ', ObjScrabble.bag.length);
        console.log(ObjScrabble.bag);
    }
}

/*
 Returns a random letter from the bag
 Removes that letter from the bag
 Decrements the letter's quantity in the dictionary. */
ObjScrabble.drawTileFromBag = function () {
    if (this.bag.length < 1)
        return null;

    var randIndex = Math.floor( Math.random() * this.bag.length );
    var strLetter = this.bag.splice( randIndex, 1 );

    this.dictTiles[strLetter].quantity--;

    if (debugging)
        console.log(strLetter + ' : ' + this.dictTiles[strLetter].quantity);

    return strLetter;
}