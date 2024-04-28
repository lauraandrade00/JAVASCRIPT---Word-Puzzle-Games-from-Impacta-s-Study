buzz.defaults.formats = ['ogg', 'mp3'];
buzz.defaults.preload = 'metadata';

var games = [
        { img: 'img/elephant.png', imgHard: 'img/elephantsSilhouette.png', color:'#a36513', word: 'elephant', sound: 'sounds/elephant' },
        { img: 'img/monkey.png', imgHard: 'img/monkeysSilhouette.png', color:'#e8c39c', word: 'monkey', sound: 'sounds/monkey' },
        { img: 'img/bear.png', imgHard: 'img/bearsSilhouette.png', color:'#807148', word: 'bear', sound: 'sounds/bear' },
        { img: 'img/horse.png', imgHard: 'img/horsesSilhouette.png', color:'#bc9e6c', word: 'horse', sound: 'sounds/horse' },
        { img: 'img/parrot.png', imgHard: 'img/parrotsSilhouette.png', color:'#83f28f', word: 'parrot', sound: 'sounds/parrot' },
        { img: 'img/crow.png', imgHard: 'img/crowsSilhouette.png', color:'#2f2f2f', word: 'crow', sound: 'sounds/rabe' },
        { img: 'img/cow.png', imgHard: 'img/cowsSilhouette.png', color:'#2f4538', word: 'cow', sound: 'sounds/cow' },
        { img: 'img/dolphin.png', imgHard: 'img/dolphinsSilhouette.png', color:'#02315a', word: 'dolphin', sound: 'sounds/dolphin' },
        { img: 'img/lion.png', imgHard: 'img/lionsSilhouette.png', color:'#dd992d', word: 'lion', sound: 'sounds/lion' },
        { img: 'img/wolf.png', imgHard: 'img/wolfsSilhouette.png', color:'#3b3b3b', word: 'wolf', sound: 'sounds/wolf' },
        { img: 'img/panda.png', imgHard: 'img/pandasSilhouette.png', color:'#989a91', word: 'panda', sound: 'sounds/panda' },
        { img: 'img/cat.png', imgHard: 'img/catsSilhouette.png', color:'#e17f93', word: 'cat', sound: 'sounds/meow' },
        { img: 'img/seagull.png', imgHard: 'img/seagullsSilhouette.png', color:'#dd992d', word: 'seagull', sound: 'sounds/seagull' },
        { img: 'img/puppy.png', imgHard: 'img/puppysSilhouette.png', color:'#834f23', word: 'puppy', sound: 'sounds/puppy' },
        { img: 'img/rooster.png', imgHard: 'img/roostersSilhouette.png', color:'#f94449', word: 'rooster', sound: 'sounds/rooster' },
        { img: 'img/gorilla.png', imgHard: 'img/gorillasSilhouette.png', color:'#176580', word: 'gorilla', sound: 'sounds/gorilla' },
        { img: 'img/fox.png', imgHard: 'img/foxsSilhouette.png', color:'#0fffff', word: 'fox', sound: 'sounds/fox' },
        { img: 'img/sheep.png', imgHard: 'img/sheepsSilhouette.png', color:'#dd992d', word: 'sheep', sound: 'sounds/schafe' },
        { img: 'img/duck.png', imgHard: 'img/ducksSilhouette.png', color:'#add8e6', word: 'duck', sound: 'sounds/duck' },
        { img: 'img/rhinoceros.png', imgHard: 'img/rhinocerossSilhouette.png', color:'#eaa222', word: 'rhinoceros', sound: 'sounds/rhinoceros' }
];

// sounds variables
var winSound = new buzz.sound('sounds/win'),
    errorSound = new buzz.sound('sounds/error'),
    alphabetSounds = {},
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''),
    gameSound = null; // adição da variável gameSound globalmente para manipulação de sobreposição

for (var i in alphabet) {
    var letter = alphabet[i];
    alphabetSounds[letter] = new buzz.sound('sounds/kid/' + letter);
}
// counter variables
var errorCount = 0, 
    consecutiveErrors = 0,
    consecutiveWins = 0;

$(function () {
    if (!buzz.isSupported()) {
        $('#warning').show();
    }

    var idx = 0,
        $container = $('#container'),
        $picture = $('#picture'),
        $models = $('#models'),
        $letters = $('#letters');

    $('body').bind('selectstart', function () {
        return false
    });

    // Declarando uma variável booleana que impedirá que todos os outros botões do jogo sejam clicados o enquanto a função winGame() estiver em execução, para assim finalizar a animação de vitória sem interrupção e bugs.
    var isGameWon = false;

    $('#next').click(function () {
        if (!isGameWon) {
            refreshGame();
            buildGame(++idx);
        }
        return false;
    });

    $('#previous').click(function () {
        if (!isGameWon) {
            refreshGame();
            buildGame(--idx);
        }
        return false;
    });

    $('#level').click(function () {
        if (!isGameWon) {
            if ($(this).text() == 'easy') {
                $(this).text('medium');
                $models.addClass('medium');
                changeLevel();
            } else if ($(this).text() == 'medium') {
                $(this).text('hard');
                $models.addClass('hard');
                changeLevel();
            } else {
                $(this).text('easy');
                $models.removeClass('medium').removeClass('hard');
                changeLevel();
            }
        }
        return false;
    });

    function refreshGame() {
        $('#models').html('');
        $('#letters').html('');
        consecutiveErrors = 0; 
        errorCount = 0; 
    }

    // Declaração de variável que irá armazenar o som do jogo atual

    function buildGame(x) {
        if (gameSound) {
            gameSound.stop();
        }
        var gameSet = games;
        if ($('#level').text() == 'hard') {
            gameSet = games.map(function(game) {
                return {
                    ...game,
                    img: game.imgHard // Usar a imagem "hard" em vez da imagem padrão
                };
            });
        }
        
        if (x > gameSet.length - 1) {
            idx = 0;
        }
        if (x < 0) {
            idx = gameSet.length - 1;
        }

        var game = gameSet[idx],
            score = 0;

        gameSound = new buzz.sound(game.sound);
        gameSound.play();

        // Fade the background color
        $('body').stop().animate({
            backgroundColor: game.color
        }, 1000);
        $('#header a').stop().animate({
            color: game.color
        }, 1000);

        // Update the picture
        if ($('#level').text() === 'hard') {
            $picture.attr('src', game.imgHard);
        } else {
            $picture.attr('src', game.img);
        }
        // Build model
        var modelLetters = game.word.split('');

        for (var i in modelLetters) {
            var letter = modelLetters[i];
            $models.append('<li>' + letter + '</li>');
        }

        var letterWidth = $models.find('li').outerWidth(true);

        // as bordas dos elementos li (boxes das letras) estão entrando no cálculo e fazendo com que haja uma quebra de linha, então para considerá-las na conta fizemos uma adição não tão significativa para assim não desalinhar a simetria dos componentes dispostos da página e resolver o problema
        $models.width((letterWidth + 1) * $models.find('li').length);

        // Build shuffled letters
        var letters = game.word.split(''),
            shuffled = letters.sort(function () { return Math.random() < 0.5 ? -1 : 1 });

        for (var i in shuffled) {
            $letters.append('<li class="draggable">' + shuffled[i] + '</li>');
        }

        $letters.find('li').each(function (i) {
            var top = ($models.position().top) + (Math.random() * 100) + 80,
                left = ($models.offset().left - $container.offset().left) + (Math.random() * 20) + (i * letterWidth),
                angle = (Math.random() * 30) - 10;

            $(this).css({
                top: top + 'px',
                left: left + 'px'
            });

            rotate(this, angle);

            $(this).mousedown(function () {
                var letter = $(this).text();
                if (alphabetSounds[letter]) {
                    alphabetSounds[letter].play();
                }
            });
        });

        $letters.find('li.draggable').draggable({
            zIndex: 9999,
            stack: '#letters li'
        });

        $models.find('li').droppable({
            accept: '.draggable',
            hoverClass: 'hover',
            drop: function (e, ui) {
                
                var $droppable = $(this);
                // Verificar se o local já está ocupado
                if ($droppable.children().length === 0) {
                    var modelLetter = $droppable.text(),
                        droppedLetter = ui.helper.text();

                    if (modelLetter == droppedLetter) {
                        ui.draggable.animate({
                            top: $droppable.position().top,
                            left: $droppable.position().left
                        }).removeClass('draggable').draggable('option', 'disabled', true);

                        ui.draggable.addClass('blinking')
                        setTimeout(function () {
                            ui.draggable.removeClass('blinking');
                        }, 1000);

                        rotate(ui.draggable, 0);

                        score++;

                        if (score == modelLetters.length) {
                            winGame();
                        }
                    } else {
                        ui.draggable.draggable('option', 'revert', true);

                        errorSound.play();

                        ui.draggable.addClass('wrong');

                        errorCount++; 
                        consecutiveErrors++; 
                        var level = $('#level').text();
                        if ((level == 'medium' && errorCount >= 5) || 
                            (level == 'hard' && consecutiveErrors >= 3)) {
                            checkErrorCount();
                        }

                        setTimeout(function () {
                            ui.draggable.removeClass('wrong');
                            ui.draggable.draggable('option', 'revert', false);
                        }, 700);
                    }
                }
            }
        });
    }

    function winGame() {
        isGameWon = true;
        winSound.play();
        // Incrementação da variável de acertos consecutivos
        if(errorCount == 0) {
            consecutiveWins++;
        } else {
            consecutiveWins = 0;
        }
        // implementação de uma animação caso haja o acerto da palavra, nesse caso foi usado a adição de uma classe com estilização própria que será removida assim que a função setTimeout expirar
        
        $('#letters li').each(function (i) {
            var $$ = $(this);
            setTimeout(function () {
                $$.animate({
                    top: '+=60px',
                });
                $$.addClass('blinking')
            }, i + 1 * 300);
        });

        setTimeout(function () {
            $('#letters li').removeClass('blinking');
            
            // Verificação de condição de passar para o próximo nível 
            var level = $('#level').text();
            if (consecutiveWins == 2 && level !== 'hard' ) {
                showNextLevelSuggestion();
            } else {
                refreshGame();
                buildGame(++idx);
                isGameWon = false;
            }
        }, 3000);
        
    }

    // Função que sugere o retorno de nível
    function checkErrorCount() {
        var answer = confirm("Você cometeu " + (errorCount >= 5 ? '5 erros' : '3 erros consecutivos') + " no nível " + $('#level').text() + ". Deseja mudar para o nível fácil?");
        if (answer) {
            changeLevelEasy();
        } else {
            consecutiveErrors = 0; 
            errorCount = 0; 
        }
    }
    
    // Função que sugere a subida de nível
    function showNextLevelSuggestion() {
        // Mostra um prompt sugerindo ir para o próximo nível
        var answer = confirm("Você acertou dois animais seguidos sem cometer erros. Deseja ir para o próximo nível?");
        if (answer) {
            // Chama a função para mudar para o próximo nível
            winSound.stop();
            changeToNextLevel();
        } else {
            // Reinicia o contador de acertos consecutivos
            refreshGame()
            buildGame(++idx)
            consecutiveWins = 0;
        }
    }

    function changeToNextLevel() {
        var currentLevel = $('#level').text();
        if (currentLevel === 'easy') {
            $('#level').text('medium');
        } else if (currentLevel === 'medium') {
            $('#level').text('hard');
        }
        
        refreshGame();
        buildGame(++idx);
    
        // Reinicia o contador de acertos consecutivos
        consecutiveWins = 0;
    
    }


    function changeLevelEasy() {
        $('#level').text('easy');

        // Remover classes adicionais para os outros níveis
        $models.removeClass('medium').removeClass('hard');
        refreshGame();
        buildGame(0); 
    }

    function changeLevel() {
        refreshGame();
        buildGame(0); 
    }


    function rotate(el, angle) {
        $(el).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    buildGame(idx);
});