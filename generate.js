/**
 * @author Piotr
 */

//theme and images
var currentTheme;
var tileImages;
var tileBg;

//for storing the current selection
var flippedSymbolId;
var flippedTileImg;

//array of width*height symbol IDs (every ID exists twice, except for odd counts where there's one spare')
var boardState;

//statistics
var flipsSoFar;
var startTime;

//score
var currentScore;
var scoreToWin;

function setTheme()
{
	var dropdownTheme = document.getElementById('DropDownTheme');
	var themeName = dropdownTheme.options[ dropdownTheme.selectedIndex ].value;

	if(currentTheme === themeName)
	{
		return;
	}
	
	//disable old theme if there is one
	if(currentTheme !== undefined)
	{
		var currentCSS = document.getElementById(currentTheme);
		currentCSS.media = "none";
	}
	//enable new theme
	var newThemeCSS = document.getElementById(themeName);
	newThemeCSS.media = "";

	currentTheme = themeName;
	
	loadImages("Images/" + themeName + "/", 18);
}

function loadImages(inPath, inCount)
{
	tileImages = new Array(inCount);
	for(i = 0; i < inCount; ++i)
	{
		tileImages[i] = new Image();
		tileImages[i].src = inPath + 'tile (' + i + ').png';
	}
	
	tileBg = new Image();
	tileBg.src = inPath +  'tile-back.png';
}

function startNewGame()
{
	//see what size is needed
	var dropdownX = document.getElementById('DropDownX');
	var width = dropdownX.options[ dropdownX.selectedIndex ].value;
	var dropdownY = document.getElementById('DropDownY'); 
	var height = dropdownY.options[ dropdownY.selectedIndex ].value;

	//drop previous game content and reset state
	var table = document.getElementById('PlayAreaTable');
	table.innerHTML = "";
	currentScore = 0;
	scoreToWin = width * height / 2;
	
	//set/change theme if needed
	setTheme();

	//create cells and tile images
	var cellId = 0;
	for(y = 0; y < height; ++y)
	{
		var addedRow = table.insertRow(y);
		for(x = 0; x < width; ++x)
		{
			var addedCell = addedRow.insertCell(x);

			var newImg = document.createElement('img');
			newImg.id = "" + cellId;
			newImg.src = tileBg.src;
			newImg.addEventListener('click', function(){
				imageClicked(this);
			});
			newImg.className = "Tile";
			addedCell.appendChild(newImg);

			
			++cellId;
		}
	}
	
	createBoardState(width * height);

	startTime = new Date();
	
	//don't use the same images all over just because they are earlier on the list
	shuffle(tileImages);
}

function createBoardState(inTileCount)
{
	boardState = new Array(inTileCount);
	for(i = 0; i < inTileCount / 2; ++i)
	{
		boardState[i * 2] = i;
		boardState[i * 2 + 1] = i;
	}
	shuffle(boardState);
	flippedSymbolId = -1;
}

function hideFlippedTiles(tile1, tile2)
{
	flippedSymbolId = -1;
	tile1.src = tileBg.src;	
	tile2.src = tileBg.src;	
}

function scoreFlippedTiles(tile1, tile2)
{
	tile1.id = null;
	tile2.id = null;
	flippedSymbolId = -1;
	currentScore++;
	var scoreText = document.getElementById('Score');
	scoreText.innerHTML = 'Score: '+ currentScore;	
	if(currentScore === scoreToWin)
	{
		var endTime = new Date();
		var duration = endTime - startTime; 
	}
}

function imageClicked(img)
{
	if(flippedSymbolId === null || img.id === null || img === flippedTileImg)
	{
		return;
	}
	
	var newlyFlippedSymbolId = boardState[img.id];
	img.src = tileImages[boardState[img.id]].src;

	if(flippedSymbolId === -1)
	{
		flippedSymbolId = newlyFlippedSymbolId;
		flippedTileImg = img;
	}
	else
	{
		if(flippedSymbolId !== newlyFlippedSymbolId)
		{
			setTimeout(hideFlippedTiles.bind(null, img, flippedTileImg), 1200);
			flippedSymbolId = null;
		}
		else
		{
			scoreFlippedTiles(img, flippedTileImg);
		}
	}
}

//utility func from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}