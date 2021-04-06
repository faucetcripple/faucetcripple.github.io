// Ever Scaling Character stats.
// Essentially every physics property is augmented.. every formula in game by skill.



let charactersheet = {
    skills: {
        accelleration: 0,
        speed: 0,
        strength: 0, // multiplies the other skills like speed/accell, mass?
        speed_max: 0,
        mass: 0,
        jump: 0,
        fall: 0, // jump return accelleration 'falling faster'
    },
    stats: {
        jumps: 0,
        catches: 0,
        kicks: 0,
        punches: 0,
        distanceTraveled: 0,
        timelogged: 0,
        gamesplayer: 0,
        timesconnected: 0,
    }
}
