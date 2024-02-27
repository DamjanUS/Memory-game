<template>
  <div class="flex flex-col pt-1">
    <div class="flex justify-between px-1 gap-4">
      <div class="memory-cont">
        <div
          v-for="(comb, idx) in currentGame.combs"
          :key="idx"
          class="memory-card"
          @click="makeMove(comb)"
        >
          <img
            :src="!comb.hidden ? comb.image : imageHidden(comb.letter)"
            :class="[comb.status]"
          />
        </div>
      </div>
      <!-- <span class="px-1"></span> -->
      <div class="flex flex-col flex-1">
        <div class="flex justify-center items-center">
          <!-- <span
            class="px-2 py-1 flex-1 whitespace-nowrap text-yellow-300 font-serif border border-t-4 border-yellow-300 mr-2 mt-2 text-2xl"
            >Поени: {{ score }}
          </span> -->
          <span
            class="px-2 py-1 flex-1 whitespace-nowrap text-yellow-300 text-5xl font-serif border border-t-4 border-yellow-300 mt-2 text-2xl"
          >
            Време: {{ timer }}
          </span>
          <span
            class="px-2 py-1 flex-1 whitespace-nowrap text-yellow-300 text-5xl font-serif border border-t-4 border-yellow-300 mt-2 text-2xl"
            >Тим: {{ currentTeam }}</span
          >
        </div>
        <br />
        <div class="leaderboard flex flex-col flex-1">
          <div class="flex gap-2">
            <span
              class="flex-1 text-yellow-300 text-3xl border border-b-4 border-yellow-300 font-serif text-2xl w-32"
              >Рунда</span
            >
            <span
              class="flex-1 text-yellow-300 text-3xl border border-b-4 border-yellow-300 font-serif text-2xl w-32"
              >Тим</span
            >
            <!-- <span
              class="flex-1  text-yellow-300 border border-b-4 border-yellow-300 font-serif mr-2 text-2xl px-1 w-32"
              >Резултат</span
            > -->
            <span
              class="flex-1 p text-yellow-300 text-3xl border border-b-4 border-yellow-300 font-serif text-2xl w-32"
              >Поени</span
            >
          </div>
          <div
            v-for="(playedgame, idx) in sortedLeaderboard"
            :key="idx"
            class="flex"
          >
            <span
              class="flex-1 mt-2 text-3xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.round }}</span
            >
            <span
              class="flex-1 mt-2 text-3xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.name }}</span
            >
            <!-- <span
              class="flex-1 mt-2 text-2xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.won ? "Победа" : "Пораз" }}</span
            > -->
            <span
              class="flex-1 mt-2 mr-5 text-3xl"
              :class="getTextColor(playedgame.name)"
              >{{ playedgame.score }}</span
            >
          </div>
          <div class=" mt-2 border-t-2 border-yellow-300" v-if="summaryMode">
            <div style="display: flex flex direction:row  ;">
              <div class="flex justify-between">
                <span
                  class="flex-1 mt-2  text-3xl"
                  :class="getTextColor(summaryMode.zimzName)"
                  >{{ summaryMode.zimzName }}</span
                >
                <span
                  class="flex-1 mt-2 text-3xl"
                  :class="getTextColor(summaryMode.zimzName)"
                  >{{ summaryMode.zimzResult }}</span
                >
                <span
                  class="flex-1 mr-4 mt-2  text-3xl"
                  :class="getTextColor(summaryMode.zimzName)"
                  >{{ summaryMode.zimzScore }}</span
                >
              </div>
              <div class="flex justify-between">
                <span
                  class="flex-1 mt-2 text-3xl"
                  :class="getTextColor(summaryMode.hamiltonName)"
                  >{{ summaryMode.hamiltonName }}</span
                >
                <span
                  class="flex-1 mt-2 text-3xl"
                  :class="getTextColor(summaryMode.hamiltonName)"
                  >{{ summaryMode.hamiltonResult }}</span
                >
                <span
                  class="flex-1 mr-4 mt-2 text-3xl"
                  :class="getTextColor(summaryMode.hamiltonName)"
                  >{{ summaryMode.hamiltonScore }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bear from "../assets/imgs/bear.jpg";
import * as deer from "../assets/imgs/deer.jpg";
import * as eagle from "../assets/imgs/eagle.jpg";
import * as elephants from "../assets/imgs/elephants.jpg";
import * as lion from "../assets/imgs/lion.jpg";
import * as monkey from "../assets/imgs/monkey.jpg";
import * as squirrel from "../assets/imgs/squirrel.jpg";
import * as stork from "../assets/imgs/stork.jpg";

const shuffle = (array) =>
  array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

const TIMER = 15;

export default {
  mounted() {
    this.preloadImages();
    this.generateCombs();
    window.addEventListener("keyup", this.handleKeyDown);
  },

  data() {
    return {
      images: [lion, eagle, bear, monkey, stork, squirrel, deer, elephants],
      letters: [
        "А1",
        "А2",
        "А3",
        "А4",
        "Б1",
        "Б2",
        "Б3",
        "Б4",
        "В1",
        "В2",
        "В3",
        "В4",
        "Г1",
        "Г2",
        "Г3",
        "Г4",
      ],
      imageHiddenBase: "https://placehold.co/200x200/CECECE/000?text=",
      currentTeam: "",
      roundsCompleted: {
        Играч1: 0,
        Играч2: 0,
      },
      currentRound: {
        player: "",
        score: 0,
      },
      currentGame: {
        combs: [],
      },
      leaderboard: [],
      summaryResults: [],
      round: 1,
      summaryMode: null,
      timer: TIMER,
      timerRunning: false,
    };
  },
  computed: {
    getTextColor() {
      return function(teamName) {
        return teamName === "Играч1" ? "text-purple-400" : "text-pink-500";
      };
    },
    score() {
      return (
        this.currentGame.combs.filter((x) => x.status === "hit").length / 2
      );
    },

    won() {
      return this.score === this.currentGame.combs.length / 2;
    },
    lost() {
      return !this.won && this.timer === 0;
    },
    gameover() {
      return this.won;
      // return (
      //   this.won ||
      //   (this.lost &&
      //     this.roundsCompleted.Играч1 === ROUNDS &&
      //     this.roundsCompleted.Играч2 === ROUNDS)
      // );
    },
    sortedLeaderboard() {
      return this.leaderboard.sort((plA, plB) => {
        if (plA.round !== plB.round) return plA.round - plB.round;
        if (plA.won !== plB.won) return plB.won - plA.won;
        return plB.round - plA.round;
      });
    },
    imageHidden() {
      return function(letter) {
        return this.imageHiddenBase + letter;
      };
    },
    sortedLetters() {
      return [...this.letters].sort();
    },
  },
  watch: {
    timer(val) {
      if (val === 0) {
        this.sortedLeaderboard.push({
          name: this.currentRound.player,
          won: this.won,
          score: this.currentRound.score,
          lives: this.lives,
          round: this.round,
        });

        // this.currentGame.combs.forEach((comb) => {
        //   if (comb.status === "hit" && !comb.hidden) {
        //     comb.status = "ready";
        //     comb.hidden = true;
        //   }
        // });

        const playerName = this.currentRound.player;
        this.roundsCompleted[playerName]++;

        if (this.gameover) {
          this.showSummary();
        } else {
          setTimeout(() => {
            this.startRound();
          }, 3000);
        }
      }
    },
  },
  methods: {
    preloadImages() {
      const imagesToPreload = [
        lion,
        eagle,
        bear,
        monkey,
        stork,
        squirrel,
        deer,
        elephants,
      ];

      imagesToPreload.forEach((image) => {
        const img = new Image();
        img.src = image.default;
      });
    },
    revealCombs() {
      this.currentGame.combs.forEach((comb) => {
        comb.hidden = false;
      });

      setTimeout(() => {
        this.currentGame.combs.forEach((comb) => {
          comb.hidden = true;
        });
      }, 3000);
    },

    handleKeyDown(event) {
      if (event.key === "Enter") {
        if (!this.timerRunning) {
          this.generateCombs();
          this.round = 1;
          this.currentTeam = "";
          this.roundsCompleted = {
            Играч1: 0,
            Играч2: 0,
          };
          this.currentRound = {
            player: "",
            score: 0,
          };
          this.leaderboard = [];
          this.summaryResults = [];
          this.startRound();
          this.revealCombs();
        }
      }
    },
    startTimer() {
      this.timerRunning = true;
      this.timer = TIMER;
      this.timerInterval = setInterval(() => {
        this.timer--;
        if (this.timer === 0) {
          this.stopTimer();
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
    },

    showSummary() {
      const zimzTotalScore = this.sortedLeaderboard
        .filter((player) => player.name === "Играч1")
        .reduce((acc, player) => acc + player.score, 0);

      const hamiltonTotalScore = this.sortedLeaderboard
        .filter((player) => player.name === "Играч2")
        .reduce((acc, player) => acc + player.score, 0);

      console.log("Zimz Total Score:", zimzTotalScore);
      console.log("Hamilton Total Score:", hamiltonTotalScore);

      let zimzResult, hamiltonResult;

      if (zimzTotalScore > hamiltonTotalScore) {
        zimzResult = "Победа";
        hamiltonResult = "Пораз";
      } else if (zimzTotalScore < hamiltonTotalScore) {
        zimzResult = "Пораз";
        hamiltonResult = "Победа";
      } else {
        zimzResult = hamiltonResult = "Изедначено";
      }

      console.log("Zimz Result:", zimzResult);
      console.log("Hamilton Result:", hamiltonResult);

      this.summaryMode = {
        zimzName: "Играч1",
        hamiltonName: "Играч2",
        zimzResult,
        hamiltonResult,
        zimzScore: zimzTotalScore,
        hamiltonScore: hamiltonTotalScore,
      };
    },

    startRound() {
      if (this.currentTeam === "Играч2") {
        this.round++;
      }
      this.currentTeam = this.currentTeam === "Играч1" ? "Играч2" : "Играч1";
      this.currentRound = {
        player: this.currentTeam,
        score: 0,
      };
      this.currentGame.combs.forEach((comb) => {
        if (comb.status === "selected") {
          comb.hidden = true;
          comb.status = "ready";
        }
      });
      this.startTimer();
      this.summaryMode = null;
    },
    generateCombs() {
      const combs = this.images
        .map((image, idx) => {
          const imagex = image;
          const comb = {
            id: idx,
            image: imagex.default,
            status: "ready",
            hidden: true,
          };
          return [comb, comb];
        })
        .flat();

      this.currentGame.combs = shuffle(combs)
        .map((comb, idx) => {
          return {
            ...comb,
            letter: this.sortedLetters[idx],
          };
        })
        .map((x, idx) => ({ ...x, idx }));
      this.combsGenerated = true;
    },

    makeMove(comb) {
      if (this.gameover || !this.timerRunning) return;
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
            setTimeout(() => {
              comb.status = "ready";
              comb.hidden = true;
              curSelected.status = "ready";
              curSelected.hidden = true;
            }, 1000);
          } else {
            this.currentRound.score += 1;
          }
          this.stopTimer();
          this.timer = 0;
        } else {
          curSelected.status = "ready";
          comb.status = "ready";
          curSelected.hidden = true;
        }
      }
    },
  },
};
</script>

<style lang="postcss">
letters {
  color: black;
}

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
