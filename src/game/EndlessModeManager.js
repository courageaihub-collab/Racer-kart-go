/**
 * EndlessModeManager.js
 * Offline Endless Racing & Survival Mode:
 * - Continuous infinite lap racing without 3-lap limit
 * - Dynamic checkpoint survival timer (+20s per completed lap)
 * - Drift Combo Multiplier (up to 5.0x) & Clean Sector Scoring
 * - High score & maximum distance persistence in localStorage
 */

export class EndlessModeManager {
  constructor(trackLengthM = 3.8371) {
    this.trackLengthM = trackLengthM;
    this.isActive = false;
    this.totalDistanceM = 0;
    this.score = 0;
    this.combo = 1.0;
    this.driftTimer = 0.0;
    this.survivalTimeRemaining = 35.0; // Seconds left
    this.cleanSectorStreak = 0;
    this.bestScore = Number(localStorage.getItem('dr_endless_best_score')) || 0;
    this.bestDistance = Number(localStorage.getItem('dr_endless_best_distance')) || 0;
    this.lastLap = 1;
    this.isGameOver = false;

    this.onGameOverCallback = () => {};
    this.onTelemetryUpdateCallback = () => {};
  }

  start() {
    this.isActive = true;
    this.totalDistanceM = 0;
    this.score = 0;
    this.combo = 1.0;
    this.driftTimer = 0.0;
    this.survivalTimeRemaining = 35.0;
    this.cleanSectorStreak = 0;
    this.lastLap = 1;
    this.isGameOver = false;
  }

  stop() {
    this.isActive = false;
  }

  onRailImpact() {
    if (!this.isActive) return;
    // Reset combo on collision
    this.combo = 1.0;
    this.cleanSectorStreak = 0;
    this.score = Math.max(0, this.score - 100);
  }

  onLapComplete(lapNum, splitTime) {
    if (!this.isActive) return;
    this.lastLap = lapNum;
    // Award +20 seconds checkpoint bonus time
    this.survivalTimeRemaining = Math.min(60.0, this.survivalTimeRemaining + 20.0);
    // Lap completion bonus points
    const lapBonus = Math.round(2500 * this.combo);
    this.score += lapBonus;

    this.saveHighScores();
  }

  update(dt, st) {
    if (!this.isActive || this.isGameOver) return;

    // 1. Tick Survival Checkpoint Timer
    if (st.raceClockActive) {
      this.survivalTimeRemaining -= dt;
      if (this.survivalTimeRemaining <= 0.0) {
        this.survivalTimeRemaining = 0.0;
        this.triggerGameOver();
        return;
      }
    }

    // 2. Track Distance
    const currentLap = st.lap || 1;
    const progress = st.sNorm || 0;
    const lapDist = (currentLap - 1) * this.trackLengthM + progress * this.trackLengthM;
    this.totalDistanceM = Math.max(this.totalDistanceM, lapDist);

    // 3. Accumulate Score based on Speed & Distance
    const speedKmh = st.speedKmh || (st.speed * 3.6);
    if (speedKmh > 10.0 && st.raceClockActive) {
      const baseDistancePts = Math.round(speedKmh * 0.45 * dt * 10.0);
      this.score += Math.round(baseDistancePts * this.combo);

      // Super Speed Bonus
      if (speedKmh > 75.0) {
        this.score += Math.round(25 * dt * this.combo);
      }
    }

    // 4. Drift Combo Multiplier
    if (st.isDrifting && speedKmh > 25.0) {
      this.driftTimer += dt;
      this.combo = Math.min(5.0, 1.0 + this.driftTimer * 0.85);
      this.score += Math.round(80 * dt * this.combo);
    } else {
      // Gentle combo decay
      this.driftTimer = Math.max(0.0, this.driftTimer - dt * 1.5);
      if (this.driftTimer === 0.0) {
        this.combo = Math.max(1.0, this.combo - dt * 0.5);
      }
    }

    this.onTelemetryUpdateCallback({
      score: this.score,
      bestScore: this.bestScore,
      distanceKm: (this.totalDistanceM * 0.001).toFixed(2),
      combo: this.combo.toFixed(1),
      survivalSec: Math.ceil(this.survivalTimeRemaining),
      lap: currentLap,
    });
  }

  saveHighScores() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('dr_endless_best_score', String(this.bestScore));
    }
    const distKm = parseFloat((this.totalDistanceM * 0.001).toFixed(2));
    if (distKm > this.bestDistance) {
      this.bestDistance = distKm;
      localStorage.setItem('dr_endless_best_distance', String(this.bestDistance));
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.saveHighScores();
    this.onGameOverCallback({
      finalScore: this.score,
      bestScore: this.bestScore,
      finalDistanceKm: (this.totalDistanceM * 0.001).toFixed(2),
      bestDistanceKm: this.bestDistance.toFixed(2),
      lapsRun: this.lastLap,
    });
  }
}
