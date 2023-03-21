<template>
  <div class="container mt-4">
    <h2>Best goalkeepers</h2>
    <div class="container mt-4 mb-4 p-0">
      <div class="row">
        <div class="col-6">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-sm"
                >Min. minutes played</span
              >
            </div>
            <input
              type="number"
              name="minutes-played-input"
              id="minutes-played-input"
              min="0"
              :max="maxMinutesPlayed"
              @input.prevent="filterByMinMinutes"
              :placeholder="0"
              class="form-control"
            />
          </div>
          <div class="form-check mt-4">
            <input
              class="form-check-input"
              type="radio"
              name="filterRadios"
              id="allRadio"
              value="allRadio"
              checked
              @change="onRadioChange('allRadio')"
            />
            <label class="form-check-label" for="allRadio"> All stats </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="filterRadios"
              id="allSeasonRadio"
              value="allSeasonRadio"
              @change="onRadioChange('allSeasonRadio')"
            />
            <label class="form-check-label" for="allSeasonRadio">
              Only all season stats
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="filterRadios"
              id="per90Radio"
              value="per90Radio"
              @change="onRadioChange('per90Radio')"
            />
            <label class="form-check-label" for="per90Radio">
              Only per 90 stats
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="stats-table">
      <table
        class="table table-striped table-bordered border-light teams-table"
      >
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
              :class="
                activeHeader === 'team-name-header' ? 'active-header' : ''
              "
            >
              Team
            </th>
            <th
              scope="col"
              @click="sortColumn('minutes')"
              id="minutes-header"
              :class="activeHeader === 'minutes-header' ? 'active-header' : ''"
            >
              Mins played
            </th>
            <th
              scope="col"
              @click="sortColumn('total_points')"
              id="points-header"
              :class="activeHeader === 'points-header' ? 'active-header' : ''"
            >
              Points
            </th>
            <th
              scope="col"
              @click="sortColumn('clean_sheets')"
              id="cs-header"
              :class="activeHeader === 'cs-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              Clean sheets
            </th>
            <th
              scope="col"
              @click="sortColumn('clean_sheets_per_90')"
              id="cs90-header"
              :class="activeHeader === 'cs90-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              Clean sheets per 90
            </th>
            <th
              scope="col"
              @click="sortColumn('goals_conceded')"
              id="gc-header"
              :class="activeHeader === 'gc-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              Goals conceded
            </th>
            <th
              scope="col"
              @click="sortColumn('goals_conceded_per_90')"
              id="gc90-header"
              :class="activeHeader === 'gc90-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              Goals conceded per 90
            </th>
            <th
              scope="col"
              @click="sortColumn('saves')"
              id="saves-header"
              :class="activeHeader === 'saves-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              Saves
            </th>
            <th
              scope="col"
              @click="sortColumn('saves_per_90')"
              id="saves90-header"
              :class="activeHeader === 'saves90-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              Saves per 90
            </th>
            <th
              scope="col"
              @click="sortColumn('expected_goals_conceded')"
              id="xgc-header"
              :class="activeHeader === 'xgc-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              xGC
            </th>
            <th
              scope="col"
              @click="sortColumn('expected_goals_conceded_per_90')"
              id="xgc90-header"
              :class="activeHeader === 'xgc90-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              xGC per 90
            </th>
            <th
              scope="col"
              @click="sortColumn('expected_goal_involvements')"
              id="xgi-header"
              :class="activeHeader === 'xgi-header' ? 'active-header' : ''"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              xGI
            </th>
            <th
              scope="col"
              @click="sortColumn('ep_next')"
              id="xpnext-header"
              :class="activeHeader === 'xpnext-header' ? 'active-header' : ''"
            >
              xPts (next GW)
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
            <td :class="colorCells('points', goalkeeper.total_points, 'desc')">
              {{ goalkeeper.total_points }}
            </td>
            <td
              :class="
                colorCells('clean_sheets', goalkeeper.clean_sheets, 'desc')
              "
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
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
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              {{ goalkeeper.clean_sheets_per_90 }}
            </td>
            <td
              :class="
                colorCells('goals_conceded', goalkeeper.goals_conceded, 'asc')
              "
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
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
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
            >
              {{ goalkeeper.goals_conceded_per_90 }}
            </td>
            <td
              :class="colorCells('saves', goalkeeper.saves, 'desc')"
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              {{ goalkeeper.saves }}
            </td>
            <td
              :class="
                colorCells('saves_per_90', goalkeeper.saves_per_90, 'desc')
              "
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
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
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
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
              :style="{
                display: currentFilter === 'allSeasonRadio' ? 'none' : '',
              }"
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
              :style="{
                display: currentFilter === 'per90Radio' ? 'none' : '',
              }"
            >
              {{ goalkeeper.expected_goal_involvements }}
            </td>
            <td :class="colorCells('ep_next', goalkeeper.ep_next, 'desc')">
              {{ goalkeeper.ep_next }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    const goalkeepersList = ref([]);
    const goalkeepersListFiltered = ref([]);

    const activeHeader = ref("points-header");

    const currentSort = ref("total_points");
    const currentSortDir = ref("desc");

    const currentFilter = ref("allRadio");

    const sortedPlayers = computed(() => {
      return goalkeepersListFiltered.value.sort((a, b) => {
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

    // Defining the maximum number of minutes - getting the maximum attribute from "Minutes played" column
    const maxMinutesPlayed = computed(() => {
      let maxMinutes = 0;
      sortedPlayers.value.forEach((player) => {
        if (player.minutes > maxMinutes) {
          maxMinutes = player.minutes;
        }
      });
      return maxMinutes;
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
      goalkeepersListFiltered.value = goalkeepers;
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

    function filterByMinMinutes(event) {
      console.log(event.target.value);
      if (!event.target.value) {
        goalkeepersListFiltered.value = goalkeepersList.value;
      } else {
        goalkeepersListFiltered.value = goalkeepersList.value.filter(
          (player) => {
            return player.minutes >= parseInt(event.target.value);
          }
        );
      }
    }

    function onRadioChange(radio) {
      currentFilter.value = radio;
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
      maxMinutesPlayed,
      filterByMinMinutes,
      onRadioChange,
      currentFilter,
    };
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
  font-size: 0.9rem;
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
  background-color: #ffe8a2;
}
</style>
