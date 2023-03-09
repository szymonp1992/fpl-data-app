<template>
  <div class="container">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" @click="sortColumn('name')">Team</th>
          <th scope="col" @click="sortColumn('strength')">Strength</th>
          <th scope="col" @click="sortColumn('xG')">xG</th>
          <th scope="col" @click="sortColumn('xGA')">xGA</th>
          <th scope="col" @click="sortColumn('xGD')">xGD</th>
          <th scope="col" @click="sortColumn('npxG')">npxG</th>
          <th scope="col" @click="sortColumn('npxGA')">npxGA</th>
          <th scope="col" @click="sortColumn('last5xG')">xG - last 5</th>
          <th scope="col" @click="sortColumn('last5xGA')">xGA - last 5</th>
          <th scope="col" @click="sortColumn('last5xGD')">xGD - last 5</th>
          <th scope="col" @click="sortColumn('last5npxG')">npxG - last 5</th>
          <th scope="col" @click="sortColumn('last5npxGA')">npxGA - last 5</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in sortedTeams" :key="team.id">
          <td>{{ team.name }}</td>
          <td>{{ team.strength }}</td>
          <td>{{ team.xG }}</td>
          <td>{{ team.xGA }}</td>
          <td>{{ team.xGD }}</td>
          <td>{{ team.npxG }}</td>
          <td>{{ team.npxGA }}</td>
          <td>{{ team.last5xG }}</td>
          <td>{{ team.last5xGA }}</td>
          <td>{{ team.last5xGD }}</td>
          <td>{{ team.last5npxG }}</td>
          <td>{{ team.last5npxGA }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    // Variable keeping an array of team objects with all the statistics needed for this page
    const teamsList = ref([]);

    // Variables keeping track of what column are we sorting and in which direction
    const currentSort = ref("name");
    const currentSortDir = ref("asc");

    // Function to recognize when we are sorting by the same column and flip direction
    function sortColumn(s) {
      //if s == current sort, reverse
      if (s === currentSort.value) {
        currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
      }
      currentSort.value = s;
    }

    const sortedTeams = computed(() => {
      return teamsList.value.sort((a, b) => {
        let modifier = 1;
        if (currentSortDir.value === "desc") modifier = -1;
        console.log(currentSort.value);
        if (currentSort.value == "name") {
          if (a[currentSort.value] < b[currentSort.value]) return -1 * modifier;
          if (a[currentSort.value] > b[currentSort.value]) return 1 * modifier;
          return 0;
        } else {
          if (
            parseFloat(a[currentSort.value]) < parseFloat(b[currentSort.value])
          )
            return -1 * modifier;
          if (
            parseFloat(a[currentSort.value]) > parseFloat(b[currentSort.value])
          )
            return 1 * modifier;
          return 0;
        }
      });
    });

    // Sorter function for teams' names in array of objects from FPL API
    function sortFPLAlphabetically(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }

    // Sorter function for teams' names in array of objects from Understat API
    function sortUnderstatAlphabetically(a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }

    // Asynchronous function loading all teams data from both APIs
    async function loadTeamsData() {
      // Function scoped variable uploaded with every iteration
      const teamsArray = [];
      // Fetching data from fpl.json file that gets its data from FPL API
      const response = await fetch("../../fpl.json");
      const data = await response.json();
      const teams = data.teams.sort(sortFPLAlphabetically);
      // Pushing team's name and team's strength factor to teams' objects
      for (let i = 0; i < teams.length; i++) {
        teamsArray.push({
          name: teams[i].name,
          strength: teams[i].strength,
          id: i,
        });
      }
      // Fetching data from understat.json file that gets its data from Understat API
      const responseUnderstat = await fetch("../../understat.json");
      const dataUnderstat = await responseUnderstat.json();
      const teamsUnderstat = Object.values(dataUnderstat).sort(
        sortUnderstatAlphabetically
      );

      // Variables that will get updated iterating over every game a team has played in current season
      let xG = 0;
      let xGA = 0;
      let npxG = 0;
      let npxGA = 0;
      let last5xG = 0;
      let last5xGA = 0;
      let last5npxG = 0;
      let last5npxGA = 0;

      // Creating a variable for current team
      for (let i = 0; i < teamsUnderstat.length; i++) {
        const teamUnderstatIterated = teamsUnderstat[i];

        // Loop adding all the single game statistics to create a sum for whole season
        for (let i = 0; i < teamUnderstatIterated.history.length; i++) {
          xG += teamUnderstatIterated.history[i]["xG"];
          xGA += teamUnderstatIterated.history[i]["xGA"];
          npxG += teamUnderstatIterated.history[i]["npxG"];
          npxGA += teamUnderstatIterated.history[i]["npxGA"];
        }
        // Loop adding all the single game statistics for last 5 games to create a sum
        for (
          let i = teamUnderstatIterated.history.length - 5;
          i < teamUnderstatIterated.history.length;
          i++
        ) {
          last5xG += teamUnderstatIterated.history[i]["xG"];
          last5xGA += teamUnderstatIterated.history[i]["xGA"];
          last5npxG += teamUnderstatIterated.history[i]["npxG"];
          last5npxGA += teamUnderstatIterated.history[i]["npxGA"];
        }
        // Three calcualtions based on sums that we got from the loops before
        let xGD = xG - xGA;
        let npxGD = npxG - npxGA;
        let last5xGD = last5xG - last5xGA;

        // Assigning new values to existing team objects
        Object.assign(teamsArray[i], {
          xG: xG.toFixed(2),
          xGA: xGA.toFixed(2),
          npxG: npxG.toFixed(2),
          npxGA: npxGA.toFixed(2),
          xGD: xGD.toFixed(2),
          npxGD: npxGD.toFixed(2),
          last5xG: last5xG.toFixed(2),
          last5xGA: last5xGA.toFixed(2),
          last5npxG: last5npxG.toFixed(2),
          last5npxGA: last5npxGA.toFixed(2),
          last5xGD: last5xGD.toFixed(2),
        });
        // Resetting all the metrics for next team iteration
        xG = 0;
        xGA = 0;
        npxG = 0;
        npxGA = 0;
        last5xG = 0;
        last5xGA = 0;
        last5npxG = 0;
        last5npxGA = 0;
        xGD = 0;
        npxGD = 0;
        last5xGD = 0;
      }
      // Uploading teamsList array - it is no longer empty, now it is filled with all the teams data
      teamsList.value = teamsArray;
    }

    // onMounted we launch loadTeamsData function and we wait for the result that will be displayed with a v-for directive as a list
    onMounted(async () => {
      await loadTeamsData();
    });

    return { teamsList, sortedTeams, sortColumn };
  },
};
</script>

<style scoped>
td,
th {
  text-align: center;
}
</style>