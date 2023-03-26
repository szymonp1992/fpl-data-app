<template>
  <div class="container mt-4">
    <h2>Team stats</h2>
    <table class="table table-striped table-bordered border-light teams-table">
      <thead>
        <tr class="table-secondary">
          <th
            scope="col"
            @click="sortColumn('name')"
            id="name-header"
            :class="activeHeader === 'name-header' ? 'active-header' : ''"
          >
            Team
          </th>
          <th
            scope="col"
            @click="sortColumn('strength')"
            id="strength-header"
            :class="activeHeader === 'strength-header' ? 'active-header' : ''"
          >
            Strength
          </th>
          <th
            scope="col"
            @click="sortColumn('xG')"
            id="xg-header"
            :class="activeHeader === 'xg-header' ? 'active-header' : ''"
          >
            xG
          </th>
          <th
            scope="col"
            @click="sortColumn('xGA')"
            id="xga-header"
            :class="activeHeader === 'xga-header' ? 'active-header' : ''"
          >
            xGA
          </th>
          <th
            scope="col"
            @click="sortColumn('xGD')"
            id="xgd-header"
            :class="activeHeader === 'xgd-header' ? 'active-header' : ''"
          >
            xGD
          </th>
          <th
            scope="col"
            @click="sortColumn('npxG')"
            id="npxg-header"
            :class="activeHeader === 'npxg-header' ? 'active-header' : ''"
          >
            npxG
          </th>
          <th
            scope="col"
            @click="sortColumn('npxGA')"
            id="npxga-header"
            :class="activeHeader === 'npxga-header' ? 'active-header' : ''"
          >
            npxGA
          </th>
          <th
            scope="col"
            @click="sortColumn('last5xG')"
            id="last5xg-header"
            :class="activeHeader === 'last5xg-header' ? 'active-header' : ''"
          >
            xG - last 5
          </th>
          <th
            scope="col"
            @click="sortColumn('last5xGA')"
            id="last5xga-header"
            :class="activeHeader === 'last5xga-header' ? 'active-header' : ''"
          >
            xGA - last 5
          </th>
          <th
            scope="col"
            @click="sortColumn('last5xGD')"
            id="last5xgd-header"
            :class="activeHeader === 'last5xgd-header' ? 'active-header' : ''"
          >
            xGD - last 5
          </th>
          <th
            scope="col"
            @click="sortColumn('last5npxG')"
            id="last5npxg-header"
            :class="activeHeader === 'last5npxg-header' ? 'active-header' : ''"
          >
            npxG - last 5
          </th>
          <th
            scope="col"
            @click="sortColumn('last5npxGA')"
            id="last5npxga-header"
            :class="activeHeader === 'last5npxga-header' ? 'active-header' : ''"
          >
            npxGA - last 5
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in sortedTeams" :key="team.id">
          <td>{{ team.name }}</td>
          <td
            :class="{
              green: team.strength === 5,
              lightgreen: team.strength === 4,
              yellow: team.strength === 3,
              orange: team.strength === 2,
            }"
          >
            {{ team.strength }}
          </td>
          <td :class="colorCells('xG', team.xG, 'desc')">{{ team.xG }}</td>
          <td :class="colorCells('xGA', team.xGA, 'asc')">{{ team.xGA }}</td>
          <td :class="colorCells('xGD', team.xGD, 'desc')">{{ team.xGD }}</td>
          <td :class="colorCells('npxG', team.npxG, 'desc')">
            {{ team.npxG }}
          </td>
          <td :class="colorCells('npxGA', team.npxGA, 'asc')">
            {{ team.npxGA }}
          </td>
          <td :class="colorCells('last5xG', team.last5xG, 'desc')">
            {{ team.last5xG }}
          </td>
          <td :class="colorCells('last5xGA', team.last5xGA, 'asc')">
            {{ team.last5xGA }}
          </td>
          <td :class="colorCells('last5xGD', team.last5xGD, 'desc')">
            {{ team.last5xGD }}
          </td>
          <td :class="colorCells('last5npxG', team.last5npxG, 'desc')">
            {{ team.last5npxG }}
          </td>
          <td :class="colorCells('last5npxGA', team.last5npxGA, 'asc')">
            {{ team.last5npxGA }}
          </td>
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

    // Active header name to be updated to show which column dictates the sorting
    const activeHeader = ref("name-header");

    const sortedTeams = computed(() => {
      return teamsList.value.sort((a, b) => {
        let modifier = 1;
        if (currentSortDir.value === "desc") modifier = -1;
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

    // Function to recognize when we are sorting by the same column and flip direction
    function sortColumn(s) {
      //if s == current sort, reverse
      activeHeader.value = event.target.id;
      if (s === currentSort.value) {
        currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
      }
      currentSort.value = s;
    }

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

    // Sorter for values in the table enabling colorCells function to get arrays of all values in a column
    function sortValues(prop) {
      const arr = [];
      sortedTeams.value.forEach((team) => {
        arr.push(team[prop]);
      });
      arr.sort(function (a, b) {
        return b - a;
      });
      return arr;
    }

    // Function that colors cells according to how high the value is. 4 best get the green, 4 worst - red. In between - steps 4 at a time
    function colorCells(prop, value, order) {
      const arrayOfValues = sortValues(prop);
      if (arrayOfValues.indexOf(value) < 4) {
        if (order === "desc") {
          return "green";
        } else if (order === "asc") {
          return "red";
        }
      }
      if (arrayOfValues.indexOf(value) < 8) {
        if (order === "desc") {
          return "lightgreen";
        } else if (order === "asc") {
          return "orange";
        }
      }
      if (arrayOfValues.indexOf(value) < 12) {
        return "yellow";
      }
      if (arrayOfValues.indexOf(value) < 16) {
        if (order === "desc") {
          return "orange";
        } else if (order === "asc") {
          return "lightgreen";
        }
      }
      if (arrayOfValues.indexOf(value) < 20) {
        if (order === "desc") {
          return "red";
        } else if (order === "asc") {
          return "green";
        }
      }
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

    return { teamsList, sortedTeams, sortColumn, colorCells, activeHeader };
  },
};
</script>
<style scoped>
.container {
  min-width: 940px;
}

table {
  table-layout: fixed;
  width: 100%;
}
td,
th {
  text-align: center;
  vertical-align: middle;
  word-break: break-word;
  hyphens: auto;
  font-size: 0.75rem;
}

.wide {
  width: 10%;
}

.teams-table thead tr th:hover {
  cursor: pointer;
}

.green {
  background-color: #80bd76;
}
.red {
  background-color: #fb4b4b;
}
.yellow {
  background-color: #ffefde;
}
.lightgreen {
  background-color: #abcc88;
}
.orange {
  background-color: #ffb21f;
}
.active-header {
  text-decoration: underline;
  color: #0b5394;
  background-color: #ffe8a2;
}
</style>
