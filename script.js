const playersDiv = document.querySelector(".players");

async function loadFplData() {
  const response = await fetch("./data.json");
  const data = await response.json();
  return data;
}

async function loadPlayersData() {
  const fplData = await loadFplData();
  const fplPlayers = fplData.elements;
  for (let i = 0; i < 10; i++) {
    playersDiv.innerHTML += `<div><h2>${fplPlayers[i].first_name} ${fplPlayers[i].second_name}</h2><p>Expected goal involvment per 90: ${fplPlayers[i].expected_goal_involvements_per_90}</p></div>`;
  }
}
