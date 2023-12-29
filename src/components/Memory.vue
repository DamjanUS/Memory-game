<template>
  <div class="flex flex-col pt-1">
    <div class="flex justify-between px-1">
      <div class="memory-cont">
        <div
          v-for="(comb, idx) in currentGame.combs"
          :key="idx"
          class="memory-card"
          @click="makeMove(comb)"
        >
          <img
            :src="!comb.hidden ? comb.image : imageHidden"
            :class="[comb.status]"
          />
        </div>
      </div>
      <span class="px-1"></span>
      <div class="flex flex-col">
        <div class="flex justify-center items-center">
          <span
            class="px-2 py-1 flex-1 whitespace-nowrap text-yellow-300 font-serif border border-t-4 border-yellow-300 mr-2 mt-2 text-2xl"
            >Поени: {{ score }}
          </span>
          <span
            class="px-2 py-1 flex-1 whitespace-nowrap text-yellow-300 font-serif border border-t-4 border-yellow-300 mr-2 mt-2 text-2xl"
          >
            Животи: {{ lives }}
          </span>
          <span
            class="px-2 py-1 font-bold text-yellow-300 border border-t-4 border-yellow-300 font-serif mr-16 mt-2 text-2xl"
            >Тим: {{ currentTeam }}</span
          >
        </div>
        <br />
        <div class="leaderboard flex flex-col flex-1">
          <div class="flex">
            <span
              class="flex-1 text-yellow-300 border border-b-4 border-yellow-300 font-serif mr-2 text-2xl"
              >Рунда</span
            >
            <span
              class="flex-1 text-yellow-300 border border-b-4 border-yellow-300 font-serif mr-2 text-2xl"
              >Тим</span
            >
            <span
              class="flex-1 text-yellow-300 border border-b-4 border-yellow-300 font-serif mr-2 text-2xl px-1"
              >Резултат</span
            >
            <span
              class="flex-1 text-yellow-300 border border-b-4 border-yellow-300 font-serif mr-16 text-2xl"
              >Поени</span
            >
          </div>
          <div
            v-for="(playedgame, idx) in sortedLeaderboard"
            :key="idx"
            class="flex"
          >
            <span
              class="flex-1 mt-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.round }}</span
            >
            <span
              class="flex-1 mt-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.name }}</span
            >
            <span
              class="flex-1 mt-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.won ? "Победа" : "Пораз" }}</span
            >
            <span
              class="flex-1 mt-2 mr-16 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.score }}</span
            >
          </div>
          <div class="flex border-t-2" v-if="summaryMode">
            <span
              class="flex-1 text-yellow-300 border-yellow-300 font-serif mr-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.round }}</span
            >
            <span
              class="flex-1 text-yellow-300 border-yellow-300 font-serif mr-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.name }}</span
            >
            <span
              class="flex-1 text-yellow-300 border-yellow-300 font-serif mr-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.won ? "Победа" : "Пораз" }}</span
            >
            <span
              class="flex-1 text-yellow-300 border-yellow-300 font-serif mr-16 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.score }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const shuffle = (array) =>
  array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

export default {
  created() {
    this.startGame();
  },
  data() {
    return {
      images: [
        "/public/imgs/lion.jpg?text=?",
        "/public/imgs/eagle.jpg?text=?",
        "/public/imgs/bear.jpg?text=?",
        "/public/imgs/monkey.jpg?text=?",
        "/public/imgs/stork.jpg?text=?",
        "/public/imgs/squirrel.jpg?text=?",
        "/public/imgs/deer.jpg?text=?",
        "/public/imgs/elephants.jpg?text=?",
      ],
      imageHidden: "https://via.placeholder.com/100x100.png?text=?",
      currentTeam: "",
      currentGame: {
        player: "",
        combs: [],
        misses: 0,
      },
      leaderboard: [],
      round: 1,
      summaryMode: false,
    };
  },
  computed: {
    getTextColor() {
      return function(teamName) {
        return teamName === "Zimz" ? "text-red-500" : "text-green-500";
      };
    },
    score() {
      return (
        this.currentGame.combs.filter((x) => x.status === "hit").length / 2
      );
    },
    lives() {
      const LIVES = 3;
      return LIVES - this.currentGame.misses;
    },
    won() {
      return this.score === this.currentGame.combs.length / 2;
    },
    lost() {
      return this.lives === 0;
    },
    gameover() {
      return this.won || this.lost;
    },
    sortedLeaderboard() {
      return this.leaderboard.sort((plA, plB) => {
        if (plA.won !== plB.won) return plB.won - plA.won;
        if (plA.score === plB.score) return plB.lives - plA.lives;
        return plB.score - plA.score;
      });
    },
  },
  watch: {
    gameover(val) {
      if (val) {
        this.sortedLeaderboard.push({
          name: this.currentGame.player,
          won: this.won,
          score: this.score,
          lives: this.lives,
          round: this.round,
        });

        this.currentGame.combs.forEach((comb) => {
          if (comb.status === "hit" && !comb.hidden) {
            comb.status = "ready";
            comb.hidden = true;
          }
        });

        if (val) {
          if (this.round < 5) {
            setTimeout(() => {
              this.startGame();
            }, 1000);
          } else {
            this.showSummary();
          }
        }
      }
    },
  },

  methods: {
    showSummary() {
      const zimzScore = this.sortedLeaderboard
        .filter((player) => player.name === "Zimz")
        .reduce((acc, player) => acc + player.score, 0);

      const hamiltonScore = this.sortedLeaderboard
        .filter((player) => player.name === "Hamilton")
        .reduce((acc, player) => acc + player.score, 0);

      let zimzResult, hamiltonResult;

      if (zimzScore > hamiltonScore) {
        zimzResult = "Победа";
        hamiltonResult = "Пораз";
      } else if (zimzScore < hamiltonScore) {
        zimzResult = "Пораз";
        hamiltonResult = "Победа";
      } else {
        zimzResult = hamiltonResult = "Изедначено";
      }

      this.summaryMode = true;
      this.startGame();
    },

    startGame() {
      this.currentTeam = this.currentTeam === "Zimz" ? "Hamilton" : "Zimz";
      this.currentGame = {
        player: this.currentTeam,
        combs: [],
        misses: 0,
      };
      this.generateCombs();

      if (this.round % 2 === 0) {
        this.round++;
      }
      this.summaryMode = false;
    },

    generateCombs() {
      this.currentGame.combs = shuffle(
        this.images
          .map((image, idx) => {
            const comb = { id: idx, image, status: "ready", hidden: false };
            return [comb, comb];
          })
          .flat()
      ).map((x, idx) => ({ ...x, idx }));

      setTimeout(() => {
        this.currentGame.combs.forEach((comb) => {
          comb.hidden = true;
        });
      }, 3000);
    },
    makeMove(comb) {
      if (this.gameover) return;
      if (["hit", "miss"].includes(comb.status)) return;

      const curSelected = this.currentGame.combs.find(
        (x) => x.status === "selected"
      );
      if (!curSelected) {
        comb.status = "selected";
        comb.hidden = false;
      } else {
        if (curSelected.idx !== comb.idx) {
          const resultStatus = comb.id === curSelected.id ? "hit" : "miss";
          comb.status = resultStatus;
          comb.hidden = false;
          curSelected.status = resultStatus;
          curSelected.hidden = false;

          if (resultStatus === "miss") {
            this.currentGame.misses += 1;
            setTimeout(() => {
              comb.status = "ready";
              comb.hidden = true;
              curSelected.status = "ready";
              curSelected.hidden = true;
            }, 1000);
          } else {
            this.currentGame.misses = Math.max(this.currentGame.misses - 1, 0);
          }
        } else {
          comb.status = "ready";
        }
      }
    },
  },
};
</script>

<style lang="postcss">
body {
  @apply bg-blue-800 text-xl font-bold font-serif;
}

.memory-cont {
  @apply flex justify-between items-center flex-wrap w-1/2 h-1/2;
}

.memory-card {
  @apply w-1/4 h-1/4 pr-0.5 pb-0.5;

  img {
    @apply w-full h-full border-2;

    &.ready {
      @apply border-gray-600;
    }
    &.selected {
      @apply border-purple-600;
    }
    &.hit {
      @apply border-green-600;
    }
    &.miss {
      @apply border-red-600;
    }
  }
}
</style>
