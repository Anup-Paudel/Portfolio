// /js/playzone.js
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Play Zone scripts loaded.");

    const chessBoardElement = document.getElementById('chessBoard');
    const chessProblemStatusElement = document.getElementById('chessProblemStatus');
    const resetPuzzleButton = document.getElementById('resetPuzzleButton');

    if (chessBoardElement && typeof Chessboard === 'function' && chessProblemStatusElement) {
        let game = null; 
        let board = null;
        const mateInOneFEN = '1k6/3R4/8/8/8/8/8/K7 w - - 0 1'; // Example: White Rook vs Black King
        const mateInOneSolution = { from: 'd7', to: 'd8' };

        function setupBoard() {
            if (typeof Chess === 'function') {
                try {
                    game = new Chess(mateInOneFEN);
                } catch(e) {
                    console.error("Error initializing chess.js:", e);
                    game = null;
                }
            } else {
                console.warn("chess.js library not found. Move validation will be limited.");
                game = null;
            }

            function onDragStart (source, piece, position, orientation) {
                if (game && game.game_over()) return false;
                if (piece.search(/^w/) === -1) return false; // Only pick up white pieces
                // Additional logic: if puzzle solved, don't allow drag
                if (chessProblemStatusElement.classList.contains('success')) return false;
            }
            
            function onDrop (source, target) {
                let moveAttempt = { from: source, to: target, promotion: 'q' }; // Default promotion
                let SGFmove = null;

                if (game) { 
                    SGFmove = game.move(moveAttempt);
                    if (SGFmove === null) { // Illegal move according to chess.js
                        chessProblemStatusElement.textContent = 'Not a legal move. Try again!';
                        chessProblemStatusElement.className = 'chess-status-message error';
                        return 'snapback';
                    }
                }

                // Check if the move is the solution
                if (source === mateInOneSolution.from && target === mateInOneSolution.to) {
                    chessProblemStatusElement.textContent = 'Correct! Mate in 1. Well done!';
                    chessProblemStatusElement.className = 'chess-status-message success';
                    if (typeof gsap !== 'undefined') { // GSAP animation for status
                        gsap.fromTo(chessProblemStatusElement, {scale: 1.2, opacity: 0}, {scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)"});
                    }
                } else if (game && game.in_checkmate()) { 
                    chessProblemStatusElement.textContent = 'That\'s a checkmate, but not the puzzle solution!';
                    chessProblemStatusElement.className = 'chess-status-message warning';
                } else if (SGFmove !== null) { // Valid move, but not the solution
                    chessProblemStatusElement.textContent = 'Good move, but not the specific solution. Try again!';
                    chessProblemStatusElement.className = 'chess-status-message error';
                    // Undo the move for a strict puzzle
                    setTimeout(() => { 
                        if(game) game.undo(); 
                        if(board) board.position(game ? game.fen() : mateInOneFEN, false);
                    }, 800);
                } else if (!game) { // No chess.js for validation
                     chessProblemStatusElement.textContent = `Moved ${source}-${target}. Not the solution.`;
                     chessProblemStatusElement.className = 'chess-status-message error';
                     return 'snapback'; // Snap back if no validation and not solution
                }

                // Update board position if chess.js is used and move was legal
                // This is actually handled by onSnapEnd more reliably for UI consistency
            }
            
            function onSnapEnd () { // Update board to reflect chess.js state
                if (game && board) {
                    board.position(game.fen());
                }
            }

            const boardConfig = {
                draggable: true,
                position: mateInOneFEN,
                onDragStart: onDragStart,
                onDrop: onDrop,
                onSnapEnd: onSnapEnd,
                pieceTheme: '../assets/images/chess-pieces/{piece}.png', // Ensure these images exist
                appearSpeed: 300,
                moveSpeed: 300,
                snapSpeed: 100,
                snapbackSpeed: 200,
                dropOffBoard: 'snapback' // Pieces snap back if dropped off board
            };

            try {
                board = Chessboard('chessBoard', boardConfig);
                chessProblemStatusElement.textContent = 'White to move and mate in one. Good luck!';
                chessProblemStatusElement.className = 'chess-status-message info';
            } catch(e) {
                console.error("Error initializing Chessboard.js:", e);
                chessBoardElement.innerHTML = "<p style='color:red;'>Error loading chessboard. Please ensure chessboard.js is included.</p>";
            }
        }

        setupBoard(); // Initialize

        if (resetPuzzleButton && board) {
            resetPuzzleButton.addEventListener('click', () => {
                if (game) game.load(mateInOneFEN); 
                board.position(mateInOneFEN, true); 
                chessProblemStatusElement.textContent = 'White to move and mate in one. Good luck!';
                chessProblemStatusElement.className = 'chess-status-message info';
            });
        }
        
        // Make the board responsive
        window.addEventListener('resize', () => {
            if (board) {
                try {
                    board.resize();
                } catch(e) {
                    console.warn("Error resizing chessboard:", e);
                }
            }
        });
    } else {
        if (!chessBoardElement) console.log("Chessboard element not found.");
        if (typeof Chessboard !== 'function') console.log("Chessboard.js library not loaded.");
        if (!chessProblemStatusElement) console.log("Chess problem status element not found.");
    }
});