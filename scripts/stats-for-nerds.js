/**
 * A single stat in our compendium of wonderful Stats for Nerds.
 * @typedef {Object} Stat
 * @property {string} id - A unique ID to identify this stat.
 * @property {string} name - A friendly, recognizable name for the stat.
 * @property {number} value - The value held by this stat (the fun part).
 * @property {string} userStatId - The user which this stat is tied to.
 */

/**
 * Defining some Constants for Nerds.
 */
class StatsForNerds {
    static ID = "stats-for-nerds";

    static FLAGS = {
        STATS: "stats"
    };

    static TEMPLATES = {
        STATISTICS: `modules/${this.ID}/templates/stats-for-nerds.hbs`
    };
}

/**
 * StatData holds all the CRUD methods for interacting with stats.
 */
class StatData {
    static get allStats() {
        const allStats = game.users.reduce((accumulator, user) => {
            const userStats = this.getStatsForUser(user.id);

            return {
                ...accumulator,
                ...userStats
            }
        }, {});

        return allStats;
    }
    
    static getStatsForUser(userId) {
        // Get the stats stored with this user's stats flag, in the module's scope.
        return game.users.get(userId)?.getFlag(StatsForNerds.ID, StatsForNerds.FLAGS.STATS);
    }

    static createStat(userId, statData) {
        // Define the new stat, explicitly defining id, userStatId and value,
        // but spreading statData over the remaining properties.
        const newStat = {
            id: foundry.utils.randomID(16),
            ...statData,
            value: 0,
            userStatId: userId
        };

        const newStats = {
            [newStat.id]: newStat
        };

        // Store the stats with this user's stats flag, in the module's scope.
        return game.users.get(userId)?.setFlag(StatsForNerds.ID, StatsForNerds.FLAGS.STATS, newStats);
    }

    static updateStat(statId, statValue) {
        const statToUpdate = this.allStats[statId];

        const updatedStat = {
            [statId]: statValue
        };

        // Update the database with the updated stat
        return game.users.get(statToUpdate.userStatId)?.setFlag(StatsForNerds.ID, StatsForNerds.FLAGS.STATS, updatedStat);
    }

    static updateUserStats(userId, updatedStats) {
        return game.users.get(userId)?.setFlag(StatsForNerds.ID, StatsForNerds.FLAGS.STATS, updatedStats);
    }

    static deleteStat(statId) {
        const statToDelete = this.allStats[statId];

        // Foundry specific syntax for deleting a key from a persisted object in the database
        const keyDeletion = {
            [`-=${statId}`]: null
        };

        // Update the database with the updated stat
        return game.users.get(statToDelete.userStatId)?.setFlag(StatsForNerds.ID, StatsForNerds.FLAGS.STATS, keyDeletion);
    }
}

/**
 * Add a button to the player list beside the currently logged in player.
 */
Hooks.on("renderPlayerList", (playerList, html) => {
    const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`);
    const tooltip = game.i18n.localize('stats-for-nerds.button-title');

    loggedInUserListItem.append(
        `<button type='button' class='stats-for-nerds-icon-button flex0' title='${tooltip}'><i class='fas fa-dice-d20'></i></button>`
    );

    html.on("click", ".stats-for-nerds-icon-button", () => {
        console.log("Stats for Nerds clicked.");
    });
});