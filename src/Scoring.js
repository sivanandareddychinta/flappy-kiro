/**
 * Flappy Kiro — Scoring Component
 *
 * Handles point awards when the player passes through wall gaps,
 * high-score tracking, and end-game score persistence.
 */

export class Scoring {
  /**
   * @param {object} [persistence] - Persistence instance for high-score loading/saving
   */
  constructor(persistence = null) {
    this.persistence = persistence
    this.score = 0
    this.highScore = 0
  }

  /**
   * Initialize scoring: reset current score and load high score from persistence.
   */
  init() {
    this.score = 0
    this.highScore = this.persistence ? this.persistence.getHighScore() : 0
  }

  /**
   * Check all walls to see if the player has passed through any unpassed wall.
   * Awards one point per wall passed. Marks wall as passed to prevent double-counting.
   *
   * @param {object} ghosty - Player object with { x, width }
   * @param {object[]} walls - Array of wall objects with { x, width, passed }
   * @returns {number} Number of new points scored this call (0 or more)
   */
  checkPassage(ghosty, walls) {
    let newPoints = 0
    const playerRight = ghosty.x + ghosty.width

    for (const wall of walls) {
      // Player has fully passed the wall's right edge and wall hasn't been scored yet
      if (!wall.passed && playerRight > wall.x + wall.width) {
        wall.passed = true
        this.score += 1
        newPoints += 1
      }
    }
    return newPoints
  }

  /**
   * Return the current score.
   * @returns {number}
   */
  getScore() {
    return this.score
  }

  /**
   * Return the high score (loaded from persistence on init).
   * @returns {number}
   */
  getHighScore() {
    return this.highScore
  }

  /**
   * Record the end-of-game result: update high score if the current score is higher,
   * then persist via the persistence layer.
   */
  recordEndGame() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      if (this.persistence) {
        this.persistence.setHighScore(this.highScore)
      }
    }
  }

  /**
   * Reset the current score to zero (used when restarting).
   */
  reset() {
    this.score = 0
  }
}
