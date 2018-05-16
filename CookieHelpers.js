/**
 * @author Piotr
 */

"use strict";

var scoreDataForSymbolMatch;
/* 	scoreDataForSymbolMatch
array
{
	boardSize
	array
	{
		moves,
		duration
		date
		time
	}
}
*/

function readSymbolMatchScoreDataFromCookie()
{
    var cookieData = document.cookie;
	scoreDataForSymbolMatch = new Array();
    var cookieData = document.cookie.split(';');
    if(cookieData.length > 1)
    {
		for(var i = 0; i < cookieData.length; i++)
		{
			var category = cookieData[i];
			var keyScoresPair = category.split('=');
			var scoreValues = keyScoresPair[1].split('_');

			scoreDataForSymbolMatch.push({});
			scoreDataForSymbolMatch[i].boardSize = parseInt(keyScoresPair[0].split('_')[1]);
			scoreDataForSymbolMatch[i].scores = new Array();

			 for(var j = 0; j < scoreValues.length / 4; ++j)
			 {
			 	scoreDataForSymbolMatch[i].scores.push({});
			 	scoreDataForSymbolMatch[i].scores[j].moves = parseInt(scoreValues[j * 4]);
			 	scoreDataForSymbolMatch[i].scores[j].duration = parseInt(scoreValues[j * 4 + 1]);
			 	scoreDataForSymbolMatch[i].scores[j].date = scoreValues[j * 4 + 2];
			 	scoreDataForSymbolMatch[i].scores[j].time = scoreValues[j * 4 + 3];
			 }
	    }
    }
}

function getDateTextFromDate(date)
{
	var dateHTML = '';
	if(date.getDate() < 10)
	{
		dateHTML = '0';
	}
	dateHTML += date.getDate() + '.';
	if(date.getMonth() < 9)
	{
		dateHTML += '0';
	}
	dateHTML += (date.getMonth()+1) + '.' + date.getFullYear();
	return dateHTML;
}

function getTimeTextFromDate(date)
{
	var timeHTML = '';
	if(date.getHours() < 10)
	{
		timeHTML += '0';
	}
	timeHTML += date.getHours() + ':';
	if(date.getMinutes() < 10)
	{
		timeHTML += '0';
	}
	timeHTML += date.getMinutes();
	return timeHTML;
}

function addSymbolMatchScore(newScore)
{
	//newScore object format: boardSize, gameDuration, gameMoves, gameDate
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
		date:getDateTextFromDate(newScore.gameDate),
		time:getTimeTextFromDate(newScore.gameDate)
		}
	);

    var expires = "";
	var date = new Date();
	date.setTime(date.getTime() + (3*24*60*60*1000));
	expires = "; expires=" + date.toUTCString();

    var cookieValue = 'category_' + newScore.boardSize + '=';
	for(var i = 0; i < categoryToInsertTo.scores.length; ++i)
	{
		var score = categoryToInsertTo.scores[i];
		cookieValue += score.moves + '_' + score.duration + '_' + score.date + '_' + score.time + '_'; 
	}
	cookieValue = cookieValue.slice(0, -1);//chop off last underscore
	document.cookie = cookieValue + expires + "; path=/";
}
