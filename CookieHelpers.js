/**
 * @author Piotr
 */

"use strict";

var scoreDataForSymbolMatch;

function readSymbolMatchScoreDataFromCookie()
{
	scoreDataForSymbolMatch = new Array();
    var cookieData = document.cookie.split(';');
    if(cookieData.length > 1)
    {
		for(var i = 0; i < cookieData.length; i++)
		{
			var kevValuePair = cookieData[i];
			var pair = kevValuePair.split('=');
			alert(pair[0]);
			alert(pair[1]);
	    }
    }
}

function writeSymbolMatchScoreDataToCookie()
{
    var cookieData = document.cookie;
	
}

function addSymbolMatchScore(newScore)
{
	var categoryToInsertTo;
	for(var i = 0; i < scoreDataForSymbolMatch.length; i++)
	{
		var category = scoreDataForSymbolMatch[i];
		if(category.boardSize === newScore.boardSize)
		{
			categoryToInsertTo = category;
			break;
		}
	}
	if(categoryToInsertTo === undefined)
	{
		categoryToInsertTo = {boardSize: newScore.boardSize, scores: new Array()};
		scoreDataForSymbolMatch.push(categoryToInsertTo);
	}
	categoryToInsertTo.scores.push(
		{moves:newScore.gameMoves,
		duration:newScore.gameDuration,
		date:newScore.gameDate}
	);
}
