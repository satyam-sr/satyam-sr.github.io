var board,
    game = new Chess();   
    

var minimaxRoot =function(depth, game, isMaximisingPlayer) {
    var newGameMoves = game.ugly_moves();
    if(!(blackCastledOrCantBeCastled && whiteCastledOrCantBeCastled)) castlingState(game.board())
    if(endgame == false) isEndgame(game.board());
    if(isMaximisingPlayer) {
        var bestMove = -9999;
        var value = -9999;
        var bestMoveFound;

        for(var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i]
            game.ugly_move(newGameMove);
            if(!game.in_threefold_repetition())
                value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
            game.undo();
            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }
        console.log("bestMove "+bestMove)
        return bestMoveFound;
    } else {
        var bestMove = 9999;
        var bestMoveFound;
        var value = 9999;

        for(var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i]
            game.ugly_move(newGameMove);
            if(!game.in_threefold_repetition())
                value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
            game.undo();
            if(value <= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }
        console.log("bestMove "+bestMove)
        return bestMoveFound;
    }
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var endgame = false 

var isEndgame = function(board){
    let pieceCount = new Map()
    pieceCount['blackBishop']=0,pieceCount['whiteBishop']=0,pieceCount['blackKnight']=0;
    pieceCount['whiteKnight']=0,pieceCount['blackRook']=0,pieceCount['whiteRook']=0;
    pieceCount['blackQueen']=0,pieceCount['whiteQueen']=0;

    for(var i=0; i<8; i++){
        for(var j =0; j<8 ; j++){
            let piece = board[i][j];
            if(piece == null) continue;
            if(piece.type == 'b' && piece.color == 'b'){
                pieceCount['blackBishop']= pieceCount['blackBishop']+1;
            }

            else if(piece.type == 'b' && piece.color == 'w'){
                pieceCount['whiteBishop']= pieceCount['whiteBishop']+1;
            }

            else if(piece.type == 'n' && piece.color == 'b'){
                pieceCount['blackKnight']= pieceCount['blackKnight']+1;
            }

            else if(piece.type == 'n' && piece.color == 'w'){
                pieceCount['whiteKnight']= pieceCount['whiteKnight']+1;
            }

            else if(piece.type == 'r' && piece.color == 'b'){
                pieceCount['blackRook']= pieceCount['blackRook']+1;
            }
            else if(piece.type == 'r' && piece.color == 'w'){
                pieceCount['whiteRook']= pieceCount['whiteRook']+1;
            }
            else if(piece.type == 'q' && piece.color == 'b'){
                pieceCount['blackQueen']= pieceCount['blackQueen']+1;
            }
            else if(piece.type == 'q' && piece.color == 'w'){
                pieceCount['whiteQueen']= pieceCount['whiteQueen']+1;
            }
        }
    }

    let totalBlack = pieceCount['blackBishop']+pieceCount['blackQueen']+pieceCount['blackRook']+pieceCount['blackKnight'];
    let totalWhite = pieceCount['whiteBishop']+pieceCount['whiteQueen']+pieceCount['whiteRook']+pieceCount['whiteKnight']

    var whiteScore = 0
    var blackScore = 0
    if(pieceCount['blackBishop'] == 2) blackScore = 5
    if(pieceCount['whiteBishop'] == 2) whiteScore = 5
    
    if(oppositePlayerCol == 'w') bishopPairBonus = blackScore - whiteScore
    else bishopPairBonus = whiteScore - blackScore

    if(totalBlack > 2 || totalWhite > 2) return ;

    if((totalBlack ==2 && pieceCount['blackQueen'] == 1) || (totalWhite == 2 && pieceCount['whiteQueen'] == 1))
        return ;

    if(pieceCount['blackRook'] == 2 || pieceCount['whiteRook'] == 2) return ; 
    
    endgame = true;
    return ;
}

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    if(endgame) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                totalEvaluation = totalEvaluation + getPieceValueEndgame(board[i][j], i ,j);
            }
        }
    } else {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
                totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
            }
        }
    }

    if(!(blackCastledOrCantBeCastled && whiteCastledOrCantBeCastled)) totalEvaluation = totalEvaluation + getKingSafetyEval(board)
    return totalEvaluation + getPawnStructureScore(board) + bishopPairBonus
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var kingEndGameWhite = [
    [ -5.0, -4.0, -3.0, -2.0, -2.0, -3.0, -4.0, -5.0],
    [ -3.0, -2.0, -1.0,  0.0,  0.0, -1.0, -2.0, -3.0],
    [ -3.0, -1.0,  2.0,  3.0,  3.0,  2.0, -1.0, -3.0],
    [ -3.0, -1.0,  3.0,  4.0,  4.0,  3.0, -1.0, -3.0],
    [ -3.0, -1.0,  3.0,  4.0,  4.0,  3.0, -1.0, -3.0],
    [ -3.0, -1.0,  2.0,  3.0,  3.0,  2.0, -1.0, -3.0],
    [ -3.0, -3.0,  0.0,  0.0,  0.0,  0.0, -3.0, -3.0],
    [ -5.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -5.0]
];

var kingEndGameBlack = reverseArray(kingEndGameWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }

    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 32 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 32 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 1000 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === playerCol ? absoluteValue : -absoluteValue;
};

var getPieceValueEndgame = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }

    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 32 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 33 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 1000 + (isWhite ? kingEndGameWhite[y][x] : kingEndGameBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === playerCol ? absoluteValue : -absoluteValue;
};

var getPawnStructureScore = function(board) {

    var doubledPawns = 0; 
    var doubledPwanOpp = 0
    let ar = new Array()
    let br = new Array()

   for(var i=0;i<8;i++){
       let countInFile = 0;
       let countInFileOpp = 0;

       for(var j=0;j<8;j++){
            let piece = board[j][i];
            if(piece != null && piece.type ==='p' && piece.color === playerCol) countInFile = countInFile+1;
            if(piece != null && piece.type ==='p' && piece.color === oppositePlayerCol) countInFileOpp = countInFileOpp+1;   
       }

       if(countInFile > 1) doubledPawns = doubledPawns + countInFile;
       if(countInFileOpp > 1) doubledPwanOpp = doubledPwanOpp + countInFileOpp;
       ar.push(countInFile)
       br.push(countInFileOpp)
   }   
   
   let isolatedPawns = 0 ;
   let isolatedPawnsOpp = 0;
   for(var i=0;i<8;i++){
       if(ar[i] > 0){
           if((i-1 >= 0 && ar[i-1] != 0) || (i+1 < 8 && ar[i+1] != 0)) {
           } else {
                isolatedPawns = isolatedPawns + ar[i];
           }
       }
       if(br[i] > 0){
        if((i-1 >= 0 && br[i-1] != 0) || (i+1 < 8 && br[i+1] != 0)) {
        } else {
            isolatedPawnsOpp = isolatedPawnsOpp + br[i];
        }
    }
   }

   let penalty = (doubledPwanOpp + isolatedPawnsOpp) * 3;
   let bonus = (doubledPawns + isolatedPawns) * 3;
   
//    if(log) console.log("isolatedPawn "+isolatedPawns+ " doubled pawns "+doubledPawns);
   return penalty-bonus;
}

var getKingSafetyEval = function (board) {
    let a1  = board[7][0]
    let c1  = board[7][2]
    let d1 = board[7][3]
    let f1 = board[7][5]
    let e1  = board[7][4]
    let g1  = board[7][6]
    let h1  = board[7][7]
    let a8  = board[0][0]
    let c8  = board[0][2]
    let d8 = board[0][3]
    let f8 = board[0][5]
    let e8  = board[0][4]
    let g8  = board[0][6]
    let h8  = board[0][7]
    let blackScore = 0
    let whiteScore = 0

    if(!whiteCastledOrCantBeCastled){
        if((c1 !== null && c1.color === 'w' && c1.type === 'k' && d1 !== null && d1.color === 'w' && d1.type === 'r') || 
            (g1 !== null && g1.color === 'w' && g1.type ==='k' && f1 !== null && f1.color === 'w' && f1.type === 'r')) {
                whiteScore= whiteScore+5
            }

            else if(e1 === null || e1.color !== 'w' || e1.type !== 'k' || ((a1===null || a1.type !== 'r' || a1.color !== 'w')
                 && (h1 ===  null || h1.type !== 'r' || h1.color !== 'w'))){
                    whiteScore= whiteScore-12
            }    
    }

    if(!blackCastledOrCantBeCastled){
        if((c8 !== null && c8.color === 'b' && c8.type === 'k' && d8 !== null && d8.color === 'b' && d8.type === 'r') || 
            (g8 !== null && g8.color === 'b' && g8.type === 'k' && f8 !== null && f8.color === 'b' && f8.type === 'r')) {
                blackScore= blackScore+5
            }

            else if(!(e8 !== null && e8.color === 'b' && e8.type === 'k' && ((a8!==null && a8.type === 'r' && a8.color === 'b')
                 || (h8 !== null && h8.type === 'r' && h8.color === 'b')))){
                    blackScore= blackScore-12
            }    
    }
    
    if(oppositePlayerCol == 'b' ) return whiteScore - blackScore
    else return blackScore - whiteScore

}

var castlingState = function (board) {
    let a1  = board[7][0]
    let c1  = board[7][2]
    let d1 = board[7][3]
    let f1 = board[7][5]
    let e1  = board[7][4]
    let g1  = board[7][6]
    let h1  = board[7][7]
    let a8  = board[0][0]
    let c8  = board[0][2]
    let d8 = board[0][3]
    let f8 = board[0][5]
    let e8  = board[0][4]
    let g8  = board[0][6]
    let h8  = board[0][7]

    if(!whiteCastledOrCantBeCastled){
        if((c1 != null && c1.color == 'w' && c1.type == 'k' && d1 != null && d1.color == 'w' && d1.type == 'r') || 
            (g1 !== null && g1.color === 'w' && g1.type ==='k' && f1 != null && f1.color == 'w' && f1.type == 'r')) {
                whiteCastledOrCantBeCastled = true 
            }

            else if(e1 === null || e1.color !== 'w' || e1.type !== 'k' || ((a1===null || a1.type !== 'r' || a1.color !== 'w')
                 && (h1 ===  null || h1.type !== 'r' || h1.color !== 'w'))){
                    whiteCastledOrCantBeCastled = true 
            }   
    } 

    if(!blackCastledOrCantBeCastled){
        if((c8 !== null && c8.color === 'b' && c8.type === 'k' && d8 !== null && d8.color === 'b' && d8.type === 'r') || 
            (g8 !== null && g8.color === 'b' && g8.type === 'k' && f8 !== null && f8.color === 'b' && f8.type === 'r')) {
                blackCastledOrCantBeCastled = true 
            }

            else if(!(e8 !== null && e8.color === 'b' && e8.type === 'k' && ((a8!==null && a8.type === 'r' && a8.color === 'b')
                 || (h8 !== null && h8.type === 'r' && h8.color === 'b')))){
                    blackCastledOrCantBeCastled = true 
            }   
    } 

}


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    let pat = '/^'+oppositePlayerCol+'/'
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(pat) !== -1) {
        return false;
    }
    if(blackBtnDisabled == false) document.getElementById("blackOrientationBtn").disabled= true
    if(gameStarted == false) {
        document.getElementById("m2").disabled= true
        document.getElementById("m3").disabled= true
        document.getElementById("gameStart").disabled= true;
    }

};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    mySound.play();
    if (game.game_over()) {
        handleGameOver(game)
    }
};

var makeFirstMoveWithWhite = function () {
    var randomNumber = Math.floor(Math.random() * 4); 
    if(randomNumber%4 == 0) game.move('c4');
    else if(randomNumber % 4 == 1) game.move('d4');
    else if(randomNumber % 4 == 2) game.move('e4');
    else {
        var bestMove = getBestMove(game);
        game.ugly_move(bestMove);
    }
    board.position(game.fen());
    renderMoveHistory(game.history());
    mySound.play();
    if (game.game_over()) {
        handleGameOver(game)
    }
};

var handleGameOver = function(game) {
    if (game.in_draw()) window.setTimeout(alert('Game Drawn'),600)
    else if (game.in_stalemate())  window.setTimeout(alert('Stalemate ! Game Drawn'),600)
    else if (game.in_threefold_repetition()) window.setTimeout(alert('Three moves repeated ! Game Drawn'),600)
    else {
        if(game.turn() == 'w') window.setTimeout(alert('Black Won'),600)
        else window.setTimeout(alert('White Won'),600)
    }
}


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        handleGameOver(game)
    }

    positionCount = 0;

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    mySound.play();
    //TODO : remove next line
    // evaluateBoard(game.board(), true)
    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

$('#blackOrientationBtn').on('click', function () {
    this.disabled = true
    document.getElementById("msg").innerHTML = "You are playing with Black !!";
    board.orientation('black')
    isWhite = false
    playerCol = 'b'
    oppositePlayerCol = 'w'
    document.getElementById("gameStart").disabled= true;
    document.getElementById("m2").disabled= true
    document.getElementById("m3").disabled= true
    gameStarted = true
    makeFirstMoveWithWhite()
    // makeBestMove()
})

$('#gameStart').on('click', function () {
    document.getElementById("blackOrientationBtn").disabled= true;
    document.getElementById("gameStart").disabled= true;
    document.getElementById("m2").disabled= true
    document.getElementById("m3").disabled= true
    gameStarted = true
    alert('Game Started !! Make your Move')
})

 var update = function(level){
     if(level == 'expert') depth = 4; 
 }

 function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

var isWhite= true
var depth = 3
var blackBtnDisabled = false
var playerCol =  'w' 
var oppositePlayerCol= 'b' 
var gameStarted = false
var mySound = new sound("move.wav");

var whiteCastledOrCantBeCastled = false
var blackCastledOrCantBeCastled = false
var bishopPairBonus = 0

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);