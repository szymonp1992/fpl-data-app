<template>
  <div class="container mt-4">
    <h2>Best goalkeepers</h2>
    <table class="table table-striped table-bordered border-light teams-table">
      <col span="2" class="wide" />
      <thead>
        <tr class="table-secondary">
          <th
            scope="col"
            @click="sortColumn('second_name')"
            id="name-header"
            :class="activeHeader === 'name-header' ? 'active-header' : ''"
          >
            Player name
          </th>
          <th
            scope="col"
            @click="sortColumn('team_name')"
            id="team-name-header"
            :class="activeHeader === 'team-name-header' ? 'active-header' : ''"
          >
            Team
          </th>
          <th
            scope="col"
            @click="sortColumn('minutes')"
            id="minutes-header"
            :class="activeHeader === 'minutes-header' ? 'active-header' : ''"
          >
            Minutes played
          </th>
          <th
            scope="col"
            @click="sortColumn('clean_sheets')"
            id="cs-header"
            :class="activeHeader === 'cs-header' ? 'active-header' : ''"
          >
            Clean sheets
          </th>
          <th
            scope="col"
            @click="sortColumn('clean_sheets_per_90')"
            id="cs90-header"
            :class="activeHeader === 'cs90-header' ? 'active-header' : ''"
          >
            Clean sheets per 90
          </th>
          <th
            scope="col"
            @click="sortColumn('goals_conceded')"
            id="gc-header"
            :class="activeHeader === 'gc-header' ? 'active-header' : ''"
          >
            Goals conceded
          </th>
          <th
            scope="col"
            @click="sortColumn('goals_conceded_per_90')"
            id="gc90-header"
            :class="activeHeader === 'gc90-header' ? 'active-header' : ''"
          >
            Goals conceded per 90
          </th>
          <th
            scope="col"
            @click="sortColumn('saves')"
            id="saves-header"
            :class="activeHeader === 'saves-header' ? 'active-header' : ''"
          >
            Saves
          </th>
          <th
            scope="col"
            @click="sortColumn('saves_per_90')"
            id="saves90-header"
            :class="activeHeader === 'saves90-header' ? 'active-header' : ''"
          >
            Saves per 90
          </th>
          <th
            scope="col"
            @click="sortColumn('expected_goals_conceded')"
            id="xgc-header"
            :class="activeHeader === 'xgc-header' ? 'active-header' : ''"
          >
            xGC
          </th>
          <th
            scope="col"
            @click="sortColumn('expected_goals_conceded_per_90')"
            id="xgc90-header"
            :class="activeHeader === 'xgc90-header' ? 'active-header' : ''"
          >
            xGC per 90
          </th>
          <th
            scope="col"
            @click="sortColumn('expected_goal_involvements')"
            id="xgi-header"
            :class="activeHeader === 'xgi-header' ? 'active-header' : ''"
          >
            xGI
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="goalkeeper in sortedPlayers" :key="goalkeeper.id">
          <td>
            {{ goalkeeper.first_name }}
            <strong>{{ goalkeeper.second_name }}</strong>
          </td>
          <td>{{ goalkeeper.team_name }}</td>
          <td>
            {{ goalkeeper.minutes }}
          </td>
          <td
            :class="colorCells('clean_sheets', goalkeeper.clean_sheets, 'desc')"
          >
            {{ goalkeeper.clean_sheets }}
          </td>
          <td
            :class="
              colorCells(
                'clean_sheets_per_90',
                goalkeeper.clean_sheets_per_90,
                'desc'
              )
            "
          >
            {{ goalkeeper.clean_sheets_per_90 }}
          </td>
          <td
            :class="
              colorCells('goals_conceded', goalkeeper.goals_conceded, 'asc')
            "
          >
            {{ goalkeeper.goals_conceded }}
          </td>
          <td
            :class="
              colorCells(
                'goals_conceded_per_90',
                goalkeeper.goals_conceded_per_90,
                'asc'
              )
            "
          >
            {{ goalkeeper.goals_conceded_per_90 }}
          </td>
          <td :class="colorCells('saves', goalkeeper.saves, 'desc')">
            {{ goalkeeper.saves }}
          </td>
          <td
            :class="colorCells('saves_per_90', goalkeeper.saves_per_90, 'desc')"
          >
            {{ goalkeeper.saves_per_90 }}
          </td>
          <td
            :class="
              colorCells(
                'expected_goals_conceded',
                goalkeeper.expected_goals_conceded,
                'asc'
              )
            "
          >
            {{ goalkeeper.expected_goals_conceded }}
          </td>
          <td
            :class="
              colorCells(
                'expected_goals_conceded_per_90',
                goalkeeper.expected_goals_conceded_per_90,
                'asc'
              )
            "
          >
            {{ goalkeeper.expected_goals_conceded_per_90 }}
          </td>
          <td
            :class="
              colorCells(
                'expected_goal_involvements',
                goalkeeper.expected_goal_involvements,
                'desc'
              )
            "
          >
            {{ goalkeeper.expected_goal_involvements }}
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
    const goalkeepersList = ref([]);

    const activeHeader = ref("name");

    const currentSort = ref("minutes");
    const currentSortDir = ref("desc");

    const sortedPlayers = computed(() => {
      return goalkeepersList.value.sort((a, b) => {
        let modifier = 1;
        if (currentSortDir.value === "desc") modifier = -1;
        if (
          currentSort.value == "second_name" ||
          currentSort.value == "team_name"
        ) {
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

    async function loadGoalkeepersData() {
      const response = await fetch("../../fpl.json");
      const data = await response.json();
      const allPlayers = data.elements;
      const allTeams = data.teams;
      // Initial array for teams codes
      const teamsCodes = [];
      // Getting an array of arrays with teams Ids and Names
      allTeams.forEach((team) => {
        const teamCode = team.code;
        const teamName = team.name;
        teamsCodes.push({ teamName: teamName, teamCode: teamCode });
      });
      // Filtering only goalkeepers from all players
      const goalkeepers = allPlayers.filter((player) => {
        return player.element_type === 1 && player.status !== "u";
      });
      // Adding every goalkeeper his team name based on teamsCodes
      goalkeepers.forEach((goalkeeper) => {
        // Getting goalie team code to match it with codes in teamsCodes array
        const gkTeamCode = goalkeeper.team_code;
        // Finding a team that has ID that matches team_code in goalkeeper object
        const matchedTeam = teamsCodes.find((team) => {
          return team.teamCode == gkTeamCode;
        });
        // Appending team_name property to every goalkeeper object
        goalkeeper.team_name = matchedTeam.teamName;
      });
      goalkeepersList.value = goalkeepers;
    }

    // Function to recognize when we are sorting by the same column and flip direction
    function sortColumn(s) {
      activeHeader.value = event.target.id;
      //if s == current sort, reverse
      if (s === currentSort.value) {
        currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
      }
      currentSort.value = s;
    }

    // Sorter for values in the table enabling colorCells function to get arrays of all values in a column
    function sortValues(prop) {
      const arr = [];
      sortedPlayers.value.forEach((player) => {
        arr.push(player[prop]);
      });
      arr.sort(function (a, b) {
        return b - a;
      });
      return arr;
    }

    function colorCells(prop, value, order) {
      const arrayOfValues = sortValues(prop);
      const uniqueValues = [...new Set(arrayOfValues)];
      if (uniqueValues.indexOf(value) < 2) {
        if (order === "desc") {
          return "green";
        } else if (order === "asc") {
          return "red";
        }
      }
      if (uniqueValues.indexOf(value) < 5) {
        if (order === "desc") {
          return "lightgreen";
        } else if (order === "asc") {
          return "orange";
        }
      }
      if (uniqueValues.indexOf(value) > uniqueValues.length - 3) {
        if (order === "desc") {
          return "red";
        } else if (order === "asc") {
          return "green";
        }
      }
      if (uniqueValues.indexOf(value) > uniqueValues.length - 6) {
        if (order === "desc") {
          return "orange";
        } else if (order === "asc") {
          return "lightgreen";
        }
      }
      return "yellow";
    }

    onMounted(async () => {
      await loadGoalkeepersData();
    });

    return {
      goalkeepersList,
      sortColumn,
      activeHeader,
      sortedPlayers,
      colorCells,
    };
  },
};
</script>

<style scoped>
table {
  table-layout: fixed;
  width: 100%;
}
td,
th {
  text-align: center;
  vertical-align: middle;
}

.wide {
  width: 12.5%;
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
}
</style>
