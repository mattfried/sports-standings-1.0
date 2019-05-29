const socket = io();

// current year(s) season for each league
const nhlSeason = '2018-2019';
const nbaSeason = '2018-2019';
const nflSeason = '2018';
const mlbSeason = '2019';

// League HTML variables, & standings content
const nhlBtn = document.getElementById('nhlBtn');
const nbaBtn = document.getElementById('nbaBtn');
const nflBtn = document.getElementById('nflBtn');
const mlbBtn = document.getElementById('mlbBtn');
const standingsDiv = document.getElementById('standings');
let nhlContent = '';
let nbaContent = '';
let nflContent = '';
let mlbContent = '';

// initially hide standings html until user clicks league button
standingsDiv.style.visibility = 'hidden';
standingsDiv.style.opacity = '0';

// Show standings when corresponding league button is clicked
const showStandings = (e) => {
  if (e === nhlBtn) {
    standingsDiv.innerHTML = nhlContent;
  } else if (e === nbaBtn) {
    standingsDiv.innerHTML = nbaContent;
  } else if (e === nflBtn) {
    standingsDiv.innerHTML = nflContent;
  } else {
    standingsDiv.innerHTML = mlbContent;
  }
  standingsDiv.style.visibility = 'visible';
  standingsDiv.style.opacity = '1';
  document.querySelector('#select').style.display = 'none';
}

// Check if all 4 league data requests are complete
// If so, .btnContainer appears & user prompt text changes
// const isReady = () => {
//   if (count === 4) {
//     document.querySelector('#select').classList.remove('infinite');
//     document.querySelector('#select').classList.add('bounceIn');
//     // change user prompt text
//     document.querySelector('#select').innerHTML = 'Please select a League';
//     // unhide btnContainer containing league buttons
//     document.querySelector('#btnContainer').style.opacity = '1';
//   }
// }


//======================================
//======================================


// Receive nhl data from index.js
socket.on('nhl-data', function(data) {
  let nhlData;
  nhlData = data;
  
  console.log('this is the data:');
  console.log(nhlData);


  // Get standings function to call for each league
  const getStandings = (data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league) => {

    let content = '';

    /* if MYSPORTSFEEDS response data misses a rank #,
    then object property will be undefined in for loops below.
    console error will be logged as per for loops below...*/

    // PUSH TEAMS INTO OVERALL STANDINGS, BASED ON OVERALL RANK
    for (let rank = 1; rank <= totalTeams; rank++ ) {
      for (let i = 0; i < totalTeams; i++) {
        if (data.teams[i].overallRank.rank === rank) {
          overallStandings.push(data.teams[i]);
        }
      }
    }

    console.log(league + ' overall standings:');
    console.log(overallStandings);

    // ORGANIZE OVERALL STANDINGS INTO DIVISIONS
    // for each division
    for (let d = 0; d < divisions.length; d++) {
      let current = [];

      // for each team
      for (let t = 0; t < data.teams.length; t++) {
        /* NFL response data object from MYSPORTSFEEDS may have skipped a rank #,
        therefore overallStandings object is missing team(s) */

        //  console log error message if object property is undefined
        if (typeof overallStandings[t] === 'undefined') {
          console.log(`${league} team with index ${t} could not be found in overallStandings object,
                          when looping through ${divisions[d]} division. Team(s) may be missing from the DOM standings`);
        }
        // MLB league response data has duplicate division names,
        // therefore counter variable is used to distinguish which conference
        else if (league === 'mlb') {
          let counter = 0;
          if (d >= 3) {
            counter = 1;
            }
          if ((overallStandings[t].divisionRank.divisionName === divisions[d]) && (overallStandings[t].conferenceRank.conferenceName === confs[counter])) {
            current.push(overallStandings[t]);
          }
        }
        // all leagues other than MLB
        else if (overallStandings[t].divisionRank.divisionName === divisions[d]) {
          current.push(overallStandings[t]);
        }

      } // end of each team loop

      divisionStandings.push(current);
    } // end of each division loop

    console.log(league + ' division standings:');
    console.log(divisionStandings);


    // main title html
    content += `
      <div class="title">
        <h1>${league}: Regular Season Standings
    `;

    if (league === "nhl") {
      content += nhlSeason;
    } else if (league === "nba") {
      content += nbaSeason;
    } else if (league === "nfl") {
      content += nflSeason;
    } else {
      content += mlbSeason;
    }

    content += `
        </h1>
      </div>
    `;

    // each conference html
    for (let div = 0; div < divisions.length; div++) {
      // MLB league response data has duplicate division names,
      // therefore divCounter variable is used to distinguish which conference
      if (league === 'mlb') {
      let divCounter = 0;
        if (div >= 3) {
          divCounter = 1;
        }

        if ((divisions[div] === firstDivsInConfs[0]) && (divCounter === 0)) {
          content += `
            <div class="conf-title">
              <h2>${confs[0]} Conference</h2>
            </div>
          `;
        } else if ((divisions[div] === firstDivsInConfs[1]) && (divCounter === 1)) {
            content += `
              <div class="conf-title">
                <h2>${confs[1]} Conference</h2>
              </div>
            `;
        }
      }
      // all leagues other than MLB
      else {
        if (divisions[div] === firstDivsInConfs[0]) {
          content += `
            <div class="conf-title">
              <h2>${confs[0]} Conference</h2>
            </div>
          `;
        } else if (divisions[div] === firstDivsInConfs[1]) {
            content += `
              <div class="conf-title">
                <h2>${confs[1]} Conference</h2>
              </div>
            `;
        }
      }


      // start table for division
      content += `
        <table class="table">
          <thead>
            <tr>
              <th colspan="7">
      `;


      // each division title
      for (let d = 0; d < divisions.length; d++) {
        // MLB league response data has duplicate division names,
        // therefore divCounter variable is used to distinguish which conference
        if (league === 'mlb') {
          let dCounter = 0;
          if (d >= 3) {
            dCounter = 1;
          }
          if ((divisionStandings[div][0].divisionRank.divisionName === divisions[d]) && (divisionStandings[div][0].conferenceRank.conferenceName === confs[dCounter])) {
            content += `${divisions[d]} Division</th>`;
          }
        }
        // all leagues other than MLB
        else if (divisionStandings[div][0].divisionRank.divisionName === divisions[d]) {
          content += `${divisions[d]} Division</th>`;
        }
      }


      // table row headings
      content += `
        </tr>
        <tr>
        <td>Rank</td>
        <td class="text-left">Team</td>
        <td>GP</td>
        <td>W</td>
        <td>L</td>
      `;

      if ((league === "nba") || (league === "mlb")) {
        content += `
          <td>Win%</td>
          <td>GB</td>
        `;
      } else if (league === 'nfl') {
        content += `
          <td>T</td>
          <td>Win%</td>
        `;
      } else {
        content += `
          <td>OTL</td>
          <td>Pts</td>
        `;
      }

      content += `
          </tr>
        </thead>
        <tbody>
      `;


      // each team data row for current division
      for (let t = 0; t < divisionStandings[div].length; t++) {

        let teamName = divisionStandings[div][t].team.name.toLowerCase();
        teamName = teamName.replace(/\s/g, '');


        content += `
          <tr>
          <td>${divisionStandings[div][t].divisionRank.rank}</td>
          <td class="text-left">
        `;

        //  change team website url for Portland Trail Blazers (NBA)
        if (teamName === 'trailblazers') {
          content += `<a href="https://www.${league}.com/blazers" target="_blank">`;
        }
        //  change team website url for Arizona Diamondbacks (MLB)
        else if (teamName === 'diamondbacks') {
          content += `<a href="https://www.${league}.com/dbacks" target="_blank">`;
        }
        //  all other team website url's
        else {
          content += `<a href="https://www.${league}.com/${teamName}" target="_blank">`;
        }

        content += `
              ${divisionStandings[div][t].team.city} ${divisionStandings[div][t].team.name}
            </a>
          </td>
          <td>${divisionStandings[div][t].stats.gamesPlayed}</td>
          <td>${divisionStandings[div][t].stats.standings.wins}</td>
          <td>${divisionStandings[div][t].stats.standings.losses}</td>
        `;


        if ( (league === 'nba') || (league === 'mlb') ) {
          content += `
              <td>${divisionStandings[div][t].stats.standings.winPct}</td>
              <td>${divisionStandings[div][t].overallRank.gamesBack}</td>
            </tr>
          `;
        } else if (league === 'nfl') {
          content += `
              <td>${divisionStandings[div][t].stats.standings.ties}</td>
              <td>${divisionStandings[div][t].stats.standings.winPct}</td>
            </tr>
          `;
        } else {
          content += `
              <td>${divisionStandings[div][t].stats.standings.overtimeLosses}</td>
              <td>${divisionStandings[div][t].stats.standings.points}</td>
            </tr>
          `;
        }

      } // end division -for- loop


      // end of table after all divisions are complete
      content += `
          </tbody>
        </table>
      `;
    } // end conference -for- loop


    // access html in global scope variable, standingsContent
    if (league === 'nhl') {
      nhlContent = content;
    } else if (league === 'nba') {
      nbaContent = content;
    } else if (league === 'nfl') {
      nflContent = content;
    } else {
      mlbContent = content;
    }

  } // end getStandings function



//let count = 0;
// set NHL variables for getStandings function arguments
    const league = 'nhl';
    const confs = ['Eastern', 'Western'];
    const divisions = ["Atlantic", "Metropolitan", "Pacific", "Central"];
    const firstDivsInConfs = ['Atlantic', 'Pacific'];
    const totalTeams = data.teams.length;
    const overallStandings = [];
    const divisionStandings = [];


    // call getStandings function, passings nhl data & divisions
    getStandings(data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league);


});
